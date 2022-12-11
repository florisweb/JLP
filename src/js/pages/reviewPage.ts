import Page from './page';
import { App } from '../app';
import Server from '../server';
import WordInfoMenu from '../wordInfoMenu';
import SmallInfoMenu from '../smallInfoMenu';
import { Question, WordTypes } from '../types';
import { $, setCharacterToElement, setTextToElement, removeSpacesFromEnds } from '../extraFunctions';


type Result = {
	correct: Question[],
	inCorrect: Question[]
}

export default class ReviewPage extends Page {
	questions:Question[] = [];
	curQuestion:Question;
	questionIndex:number;
	resultStatus:Result;
	
	#HTML = {
		questionHolder: 		$<HTMLElement>("#mainContent .page.reviewPage .questionHolder")[0],
		questionTypeHolder: 	$<HTMLElement>("#mainContent .page.reviewPage .questionTypeHolder")[0],
		inputField: 			$<HTMLInputElement>("#mainContent .page.reviewPage .inputField")[0],
		iWasRightButton:		$<HTMLElement>("#mainContent .page.reviewPage .iWasRightButton")[0],

		infoMenu: 				$<HTMLElement>("#mainContent .page.reviewPage .infoPanel")[0],
		smallInfoMenuHolder: 	$<HTMLElement>("#mainContent .page.reviewPage .smallInfoPanelHolder")[0],
		progressBar:			$<HTMLElement>("#mainContent .page.reviewPage .progressBar")[0],
		topBar:					$<HTMLElement>("#mainContent .page.reviewPage .topBar")[0],
		scoreHolder:			$<HTMLElement>("#mainContent .page.reviewPage .topBar .scoreHolder")[0],
	};


	private InputField 		= new InputField(this.#HTML.inputField);
	#ProgressBar 			= new ProgressBar(this.#HTML.progressBar);
	private wordInfoMenu 	= new WordInfoMenu(this.#HTML.infoMenu);
	#smallInfoMenu 			= new SmallInfoMenu(this.#HTML.smallInfoMenuHolder);
	
	constructor() {
		super({index: 1});
	}

	setup = async function() {
		let homeButton = $<HTMLElement>("#mainContent .page.reviewPage .topBar .homeButton")[0];
		homeButton.addEventListener("click", function () {App.homePage.open()});

		this.#HTML.iWasRightButton.addEventListener("click", () => this.iWasRight());
	}

	onOpen = async function(_questions:Question[] = []) {
		this.questions = _questions.length ? _questions : await Server.reviews.getQuestions();
		this.resultStatus = {
			correct: [],
			inCorrect: [],
		};

		this.nextQuestion();
		this.InputField.reset();
		this.#HTML.iWasRightButton.classList.add('hide');
	}

	openWithLesson = function(_questions:Question[]) {
		return this.open(_questions);
	}

	
	onClose = async function() {
		this.wordInfoMenu.close();
		this.#ProgressBar.setPercentage(0);
	}

	#lastFailedAnswer:any = 0;
	onEnterPress = function(_inInputField:boolean) {
		let curTime:any = new Date();
		if (curTime - this.#lastFailedAnswer < 1000) return;
		this.#smallInfoMenu.close();
		if (this.wordInfoMenu.openState) return this.nextQuestion();
		if (!_inInputField) return;
		this.checkAnswer();
	}

	iWasRight = function() {
		this.resultStatus.correct.push(this.questions.splice(this.questions.length - 1, 1)[0]);
		this.nextQuestion();
	}

	


	nextQuestion = function() {
		this.wordInfoMenu.close();
		this.#ProgressBar.setPercentage(this.resultStatus.correct.length / (this.questions.length + this.resultStatus.correct.length));
		setTextToElement(this.#HTML.scoreHolder, this.resultStatus.correct.length + "/" + (this.questions.length + this.resultStatus.correct.length));

		if (this.questions.length < 1) return App.homePage.open(); // TODO: Will be resultPage
		this.showQuestion(this.questions[0]);
	}


	checkAnswer = function() {
		let isCorrect = this.#isAnswerCorrect(this.curQuestion);
		if (isCorrect == 'InvalidInput')
		{
			this.InputField.focus();
			return this.#smallInfoMenu.openWithTimeout('The reading only uses kana', '#f77', 2000);
		}

		if (this.curQuestion == this.questions[0]) this.questions.splice(0, 1);
		Server.reviews.updateWordTrainStatus(this.curQuestion, isCorrect);
		
		if (isCorrect)
		{	
			this.#answerIsCorrect();
		} else this.#answerIsIncorrect();

		this.wordInfoMenu.open(this.curQuestion.word, this.curQuestion.askMeaning);
	}

	#answerIsCorrect = function() {
		if (this.curQuestion.askMeaning && this.curQuestion.word.meanings.length > 1) this.#smallInfoMenu.openWithTimeout('Did you know this word has multiple meanings?', '#88c', 3000);
		if (!this.curQuestion.askMeaning && this.curQuestion.word.readings.length > 1) this.#smallInfoMenu.openWithTimeout('Did you know this word has multiple readings?', '#88c', 3000);

		this.resultStatus.correct.push(this.curQuestion);
		this.InputField.setAnswerCorrectStatus(true);

	}
	#answerIsIncorrect = function() {
		this.InputField.setAnswerCorrectStatus(false);
		this.resultStatus.inCorrect.push(this.curQuestion);
		this.#HTML.iWasRightButton.classList.remove('hide');
		this.questions.push(this.curQuestion);
		this.#lastFailedAnswer = new Date();
	}


	#isAnswerCorrect = function(_question:Question):boolean {
		let answer:string = removeSpacesFromEnds(this.InputField.getValue()).toLowerCase();
		if (_question.askMeaning)
		{
			for (let meaning of _question.word.meanings)
			{
				if (answer == meaning.toLowerCase()) return true;	
			}
			return false;
		}
		// @ts-ignore
		if (!wanakana.isHiragana(answer) && answer) return "InvalidInput";

		for (let reading of _question.word.readings)
		{
			console.log(answer, reading);
			if (answer == reading.toLowerCase()) return true;	
		}
		return false;
	}




	showQuestion = function(_question: Question) {
		this.InputField.reset();
		this.#HTML.iWasRightButton.classList.add('hide');

		this.curQuestion = _question;
		this.#writeQuestion(this.curQuestion);
		this.InputField.setKanaInputMode();
		if (this.curQuestion.askMeaning) this.InputField.setNormalInputMode();
	}


	
	#writeQuestion = function(_question: Question) {		
		setCharacterToElement(
			this.#HTML.questionHolder, 
			_question.word.character,
			false
		);
		
		let color = "rgb(140, 140, 205)";
		if (_question.word.type == 1) color = "rgb(205, 140, 140)";
		if (_question.word.type == 2) color = "rgb(140, 205, 140)";
		let questionHolderLine = $<HTMLElement>("#mainContent .page.reviewPage .questionHolder a")[0];
		questionHolderLine.style.borderBottomColor = color;
		this.#HTML.questionHolder.style.color = color;
		this.#HTML.questionTypeHolder.style.color = color;

		this.#HTML.questionTypeHolder.innerHTML = 
			"<strong>" + WordTypes[_question.word.type].name + "</strong> - " +
			(_question.askMeaning ? "Meaning" : "Reading");
	}
};




class InputField {
	#HTML:HTMLInputElement;
	constructor(_html:HTMLInputElement) {
		this.#HTML = _html;
	}

	#wanakanaIsBound:boolean = false;
	
	focus = function() {
		this.#HTML.focus();
	}
	reset = function() {
		this.#HTML.removeAttribute("readonly");
		this.#HTML.value = null; 
		this.#HTML.focus();
		this.#clearAnimation();
	}

	getValue = function():string {
		return this.#HTML.value;
	}

	setKanaInputMode = function() {
		if (this.#wanakanaIsBound) return;
		//@ts-ignore
		wanakana.bind(this.#HTML, {IMEMode: 'toHiragana' || 'toKatakana'});
		this.#wanakanaIsBound = true;
		this.#HTML.setAttribute('placeHolder', '答え');
	}
	setNormalInputMode = function() {
		if (!this.#wanakanaIsBound) return;
		//@ts-ignore
		wanakana.unbind(this.#HTML);
		this.#wanakanaIsBound = false;
		this.#HTML.setAttribute('placeHolder', 'meaning');
	}

	setAnswerCorrectStatus = function(_correct:boolean) {
		this.#HTML.setAttribute("readonly", '');
		if (_correct) return this.#showAnswerCorrectAnimation();
		this.#showAnswerIncorrectAnimation();
	}

	#showAnswerIncorrectAnimation = function() {
		this.#HTML.classList.add("answerIncorrect");
	}
	#showAnswerCorrectAnimation = function() {
		this.#HTML.classList.add("answerCorrect");
	}
	#clearAnimation = function() {
		this.#HTML.classList.remove("answerIncorrect");
		this.#HTML.classList.remove("answerCorrect");
	}
}


class ProgressBar {
	#HTML:HTMLElement;
	constructor(_html:HTMLElement) {
		this.#HTML = _html;
	}

	setPercentage = function(_percentage:number) {
		this.#HTML.style.width = _percentage * 100 + "%";
	}
}