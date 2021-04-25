import Page from './page';
import { App } from '../app';
import Server from '../server';
import WordInfoMenu from '../wordInfoMenu';
import { Word, Question } from '../types';
import { $, setTextToElement } from '../extraFunctions';


export default class LessonPage extends Page {
	words:Word[] = [];
	
	#HTML = {
		questionHolder: 	$<HTMLElement>("#mainContent .page.lessonPage .questionHolder")[0],
		infoMenu: 			$<HTMLElement>("#mainContent .page.lessonPage .infoPanel")[0],
	};


	#wordInfoMenu = new WordInfoMenu(this.#HTML.infoMenu);
	
	constructor() {
		super({index: 3});
	}

	setup = async function() {
		let homeButton = $<HTMLElement>("#mainContent .page.lessonPage .topBar .homeButton")[0];
		homeButton.addEventListener("click", function () {App.homePage.open()});
	}

	onOpen = async function() {
		this.words = await Server.lessons.getWords();
		console.log(this.words);
		this.showWord(this.words[0]);

	}


	onEnterPress = function(_inInputField:boolean) {
	}

	


	nextQuestion = function() {
	
	}



	showWord = function(_word: Word) {		
		this.#writeWord(_word);
		this.#wordInfoMenu.open(_word, false);
		Server.lessons.learnedWord(_word);
	}


	
	#writeWord = function(_word: Word) {
		setTextToElement(
			this.#HTML.questionHolder, 
			_word.character
		);

		let color = "rgb(140, 140, 205)";
		if (_word.type == 1) color = "rgb(205, 140, 140)";
		if (_word.type == 2) color = "rgb(140, 205, 140)";

		let questionHolderLine = $<HTMLElement>("#mainContent .page.lessonPage .questionHolder a")[0];
		questionHolderLine.style.borderBottomColor = color;
		this.#HTML.questionHolder.style.color = color;
	}
};
