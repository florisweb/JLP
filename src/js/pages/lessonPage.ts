import Page from './page';
import { App } from '../app';
import Server from '../server';
import WordInfoMenu from '../wordInfoMenu';
import { Word, Question } from '../types';
import { $, setTextToElement } from '../extraFunctions';


export default class LessonPage extends Page {
	words:Word[] = [];
	curWord:Word;
	
	#HTML = {
		questionHolder: 	$<HTMLElement>("#mainContent .page.reviewPage .questionHolder")[0],
		questionTypeHolder: $<HTMLElement>("#mainContent .page.reviewPage .questionTypeHolder")[0],
		inputField: 		$<HTMLInputElement>("#mainContent .page.reviewPage .inputField")[0],
		infoMenu: 			$<HTMLElement>("#mainContent .page.reviewPage .infoPanel")[0],
		progressBar:		$<HTMLElement>("#mainContent .page.reviewPage .progressBar")[0],
		topBar:				$<HTMLElement>("#mainContent .page.reviewPage .topBar")[0],
		scoreHolder:		$<HTMLElement>("#mainContent .page.reviewPage .topBar .scoreHolder")[0],
	};


	private wordInfoMenu = new WordInfoMenu(this.#HTML.infoMenu);
	
	constructor() {
		super({index: 3});
	}

	setup = async function() {
		let homeButton = $<HTMLElement>("#mainContent .page.reviewPage .topBar .homeButton")[0];
		homeButton.addEventListener("click", function () {App.homePage.open()});
	}

	onOpen = async function() {
		this.words = await Server.lessons.getLessons();
		console.log(this.words);

	}


	onEnterPress = function(_inInputField:boolean) {
	}

	


	nextQuestion = function() {
	
	}



	// showQuestion = function(_question: Question) {
	// 	this.InputField.reset();
		
	// 	this.curQuestion = _question;
	// 	this.#writeQuestion(this.curQuestion);
	// 	this.InputField.setKanaInputMode();
	// 	if (this.curQuestion.askMeaning) this.InputField.setNormalInputMode();
	// }


	
	// #writeQuestion = function(_question: Question) {		
	// 	setTextToElement(
	// 		this.#HTML.questionHolder, 
	// 		_question.word.character
	// 	);

	// 	let color = "rgb(140, 140, 205)";
	// 	if (_question.word.type == 1) color = "rgb(205, 140, 140)";
	// 	if (_question.word.type == 2) color = "rgb(140, 205, 140)";
	// 	let questionHolderLine = $<HTMLElement>("#mainContent .page .questionHolder a")[0];
	// 	questionHolderLine.style.borderBottomColor = color;
	// 	this.#HTML.questionHolder.style.color = color;
	// 	this.#HTML.questionTypeHolder.style.color = color;

	// 	setTextToElement(
	// 		this.#HTML.questionTypeHolder, 
	// 		_question.askMeaning ? "Meaning" : "Reading"
	// 	);
	// }
};
