import Page from './page';
import { App } from '../app';
import Server from '../server';
import WordInfoMenu from '../wordInfoMenu';
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
		questionHolder: 	$<HTMLElement>("#mainContent .page.reviewPage .questionHolder")[0],
		questionTypeHolder: $<HTMLElement>("#mainContent .page.reviewPage .questionTypeHolder")[0],
		inputField: 		$<HTMLInputElement>("#mainContent .page.reviewPage .inputField")[0],
		infoMenu: 			$<HTMLElement>("#mainContent .page.reviewPage .infoPanel")[0],
		progressBar:		$<HTMLElement>("#mainContent .page.reviewPage .progressBar")[0],
		topBar:				$<HTMLElement>("#mainContent .page.reviewPage .topBar")[0],
		scoreHolder:		$<HTMLElement>("#mainContent .page.reviewPage .topBar .scoreHolder")[0],
	};


	private InputField = new InputField(this.#HTML.inputField);
	#ProgressBar = new ProgressBar(this.#HTML.progressBar);
	private wordInfoMenu = new WordInfoMenu(this.#HTML.infoMenu);
	
	constructor() {
		super({index: 1});
	}

	setup = async function() {
		let homeButton = $<HTMLElement>("#mainContent .page.reviewPage .topBar .homeButton")[0];
		homeButton.addEventListener("click", function () {App.homePage.open()});
	}

	onOpen = async function() {
		this.questions = await Server.reviews.getQuestions();
		this.resultStatus = {
			correct: [],
			inCorrect: [],
		};

		this.nextQuestion();
		
		this.InputField.reset();
	}
	
	onClose = async function() {
		this.wordInfoMenu.close();
		this.#ProgressBar.setPercentage(0);
	}


	onEnterPress = function(_inInputField:boolean) {
		if (this.wordInfoMenu.openState) return this.nextQuestion();
		if (!_inInputField) return;
		this.checkAnswer();
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
		if (isCorrect == 'InvalidInput') return alert('invalid input'); // TODO: Actual visual indication that the input is incorrect

		if (this.curQuestion == this.questions[0]) this.questions.splice(0, 1);
		Server.reviews.updateWordTrainStatus(this.curQuestion.word.id, isCorrect);
		
		if (isCorrect)
		{	
			this.resultStatus.correct.push(this.curQuestion);
			this.InputField.setAnswerCorrectStatus(true);
			setTimeout(function () {
				App.reviewPage.nextQuestion();
			}, 500);
			return;
		}

		this.InputField.setAnswerCorrectStatus(false);
		let This = this;
		setTimeout(function () {
			This.wordInfoMenu.open(This.curQuestion.word, This.curQuestion.askMeaning);
		}, 500);
		
		this.resultStatus.inCorrect.push(this.curQuestion);
		this.questions.push(this.curQuestion);
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
		if (!wanakana.isHiragana(answer)) return "InvalidInput";

		let readings = _question.word.readings;
		// @ts-ignore
		if (_question.word.type == 1) readings = _question.word.readings[0];
		console.log('readings', readings);
		for (let reading of readings)
		{
			console.log(answer, reading);
			if (answer == reading.toLowerCase()) return true;	
		}
		return false;
	}




	showQuestion = function(_question: Question) {
		this.InputField.reset();
		
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