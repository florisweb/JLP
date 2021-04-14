import { App } from './app';
import Server from './server';
import WordInfoMenu from './wordInfoMenu';
import { Question } from './types';
import { $, setTextToElement, removeSpacesFromEnds } from './extraFunctions';
import './wanakana';



export default class ReviewPage {
	#openPage:Function;
	questions:Question[] = [];
	curQuestion:Question;
	
	#HTML = {
		questionHolder: 	$<HTMLElement>("#mainContent .page.reviewPage .questionHolder")[0],
		questionTypeHolder: $<HTMLElement>("#mainContent .page.reviewPage .questionTypeHolder")[0],
		inputField: 		$<HTMLInputElement>("#mainContent .page.reviewPage .inputField")[0],
		infoMenu: 			$<HTMLElement>("#mainContent .page.reviewPage .infoPanel")[0]
	};


	#InputField = new InputField(this.#HTML.inputField);

	constructor(_openPage:Function) {
		this.#openPage = _openPage;
	}

	#wordInfoMenu = new WordInfoMenu(this.#HTML.infoMenu);
	

	open = async function() {
		this.questions = await Server.review.getQuestions();
		App.curPage = this;
		
		this.#openPage(1);
		this.nextQuestion();
		
		this.#InputField.reset();
	}

	nextQuestion = function() {
		this.#wordInfoMenu.close();
		if (this.questions.length < 1) return; //open result page
		this.showQuestion(this.questions[0]);
	}


	checkAnswer = function() {
		let isCorrect = this.#isAnswerCorrect(this.curQuestion);
		if (this.questions[0] == this.curQuestion) this.questions.splice(0, 1);
		if (isCorrect)
		{	
			this.#InputField.showAnswerCorrectAnimation();
			setTimeout(function () {
				App.reviewPage.nextQuestion();
			}, 500);
			return;
		}

		this.#InputField.showAnswerIncorrectAnimation();
		setTimeout(function () {
			this.#wordInfoMenu.open(this.curQuestion.word);
		}, 500);
		this.questions.push(this.curQuestion);
	}


	#isAnswerCorrect = function(_question:Question):boolean {
		let answer:string = removeSpacesFromEnds(this.#InputField.getValue()).toLowerCase();
		if (_question.askMeaning && _question.word.meaning.toLowerCase() == answer) return true;

		for (let reading of _question.word.readings)
		{
			if (answer == reading.toLowerCase()) return true;	
		}
		return false;
	}




	showQuestion = function(_question: Question) {
		this.#InputField.reset();
		
		this.curQuestion = _question;
		this.#writeQuestion(this.curQuestion);
		this.#InputField.setKanaInputMode();
		if (this.curQuestion.askMeaning) this.#InputField.setNormalInputMode();
	}


	
	#writeQuestion = function(_question: Question) {
		let questionString:string = _question.askMeaning ? _question.word.character : _question.word.meaning;
		
		setTextToElement(
			this.#HTML.questionHolder, 
			questionString
		);

		let color = "rgb(140, 140, 205)";
		if (_question.word.type == 1) color = "rgb(205, 140, 140)";
		if (_question.word.type == 2) color = "rgb(140, 205, 140)";
		let questionHolderLine = $<HTMLElement>("#mainContent .page .questionHolder a")[0];
		questionHolderLine.style.borderBottomColor = color;
		this.#HTML.questionHolder.style.color = color;
		this.#HTML.questionTypeHolder.style.color = color;

		setTextToElement(
			this.#HTML.questionTypeHolder, 
			_question.askMeaning ? "Meaning" : "Reading"
		);
	}
};




class InputField {
	#HTML:HTMLInputElement;
	constructor(_html:HTMLInputElement) {
		this.#HTML = _html;
	}

	#wanakanaIsBound:boolean = false;
	
	reset = function() {
		this.#HTML.value = null; 
		this.#HTML.focus();
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

	showAnswerIncorrectAnimation = function() {
		this.#HTML.classList.add("answerIncorrect");
		setTimeout(function () {
			this.#HTML.classList.remove("answerIncorrect");
		}, 900);
	}
	showAnswerCorrectAnimation = function() {
		this.#HTML.classList.add("answerCorrect");
		setTimeout(function () {
			this.#HTML.classList.remove("answerCorrect");
		}, 900);
	}
}