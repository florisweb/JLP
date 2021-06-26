declare const window:any;
import Page from './page';
import { App } from '../app';
import Server from '../server';
import WordInfoMenu from '../wordInfoMenu';
import { Word, Question, WordTypes } from '../types';
import { $, setCharacterToElement, setTextToElement } from '../extraFunctions';


export default class LessonPage extends Page {
	words:Word[] = [];
	curWordIndex:number = -1;
	
	#HTML = {
		questionHolder: 	$<HTMLElement>("#mainContent .page.lessonPage .questionHolder")[0],	
		questionTypeHolder: $<HTMLElement>("#mainContent .page.lessonPage .questionTypeHolder")[0],
		infoMenu: 			$<HTMLElement>("#mainContent .page.lessonPage .infoPanel")[0],
		wordNavigator: 		$<HTMLElement>("#mainContent .page.lessonPage .topBar .wordNavigator")[0],
	};


	#wordInfoMenu = new WordInfoMenu(this.#HTML.infoMenu);
	#wordNavigator = new WordNavigator(this.#HTML.wordNavigator);

	constructor() {
		super({index: 3});
	}

	setup = async function() {
		let homeButton = $<HTMLElement>("#mainContent .page.lessonPage .topBar .homeButton")[0];
		homeButton.addEventListener("click", function () {App.homePage.open()});
	}

	onOpen = async function() {
		this.words = await Server.lessons.getWords();
		this.curWordIndex = -1;
		this.#wordNavigator.setWords(this.words);
		this.nextWord();
	}
	onClose = async function() {
		this.#wordInfoMenu.close();
	}


	onEnterPress = function(_inInputField:boolean) {
		return this.nextWord();
	}
	
	prevWord = function() {
		if (this.curWordIndex <= 0) return;
		this.curWordIndex--;
		this.showWordByIndex(this.curWordIndex);
	}

	nextWord = function() {
		if (this.curWordIndex >= this.words.length - 1) {
			return this.openLessonReviewer();
		};

		this.curWordIndex++;
		this.showWordByIndex(this.curWordIndex);
	}

	openLessonReviewer = function() {
		let questions:Question[] = [];
		for (let word of this.words)
		{
			questions.push({
				askMeaning: true,
				word: word,
			});
			if (word.type == 0) continue;
			questions.push({
				askMeaning: false,
				word: word,
			});
		}
		App.reviewPage.openWithLesson(questions);
	}



	showWordByIndex = function(_index: number) {
		if (_index < 0) return;
		if (_index >= this.words.length) return;

		this.#wordNavigator.setLeftArrowStatus(_index != 0);

		App.lessonPage.curWordIndex = _index;	
		let word = this.words[_index];	
		this.#wordInfoMenu.close();
		this.#writeWord(word);
		this.#wordInfoMenu.open(word, false);
	}

	#writeWord = function(_word: Word) {
		setCharacterToElement(
			this.#HTML.questionHolder, 
			_word.character
		);

		let color = "rgb(140, 140, 205)";
		if (_word.type == 1) color = "rgb(205, 140, 140)";
		if (_word.type == 2) color = "rgb(140, 205, 140)";

		let questionHolderLine = $<HTMLElement>("#mainContent .page.lessonPage .questionHolder a")[0];
		questionHolderLine.style.borderBottomColor = color;
		this.#HTML.questionHolder.style.color = color;
		this.#HTML.questionTypeHolder.style.color = color;

		this.#HTML.questionTypeHolder.innerHTML = 
			"<strong>" + WordTypes[_word.type].name + "</strong> - " +
			(true ? "Meaning" : "Reading");
	}
};


class WordNavigator {
	#HTML = {};
	#words:Word[] = [];
	#leftArrow:HTMLElement;

	constructor(_wordNavigator:HTMLElement) {
		this.#HTML = _wordNavigator;
	}

	setWords = function(_words: Word[]) {
		this.#words = [];
		this.#HTML.innerHTML = '';
		
		this.#leftArrow = this.#addArrow(true);
		for (let i = 0; i < _words.length; i++) this.#addWordNavigationItem(_words[i], i);
		
		this.#addArrow(false);
	}

	setLeftArrowStatus = function(_enabled:boolean) {
		this.#leftArrow.classList.remove("disabled");
		if (_enabled) return;
		this.#leftArrow.classList.add("disabled");
	}

	#addWordNavigationItem = function(_word: Word, _index:number) {
		let element = this.#createWordNavigationBaseItem(_word.character, _word.type);

		element.addEventListener('click', function () {
			App.lessonPage.showWordByIndex(_index);
		});

		this.#words.push({
			html: element,
			word: _word,	
		});
	}

	#addArrow = function(_isLeftArrow:boolean) {
		let element = this.#createWordNavigationBaseItem(_isLeftArrow ? '‹' : '›', 0);
		element.classList.add('arrowButton');
		
		element.addEventListener('click', function () {
			if (_isLeftArrow) return App.lessonPage.prevWord();
			App.lessonPage.nextWord();
		});
		return element;
	}


	#createWordNavigationBaseItem = function(_character:string, _type:number):HTMLElement {
		let element = document.createElement('span');
		element.className = 'text highLightType wordButton noselect';
		element.classList.add(WordTypes[_type].class);
		
		setCharacterToElement(
			element, 
			_character,
			true
		);

		this.#HTML.appendChild(element);
		return element;
	}
}