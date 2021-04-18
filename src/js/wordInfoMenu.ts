import { Word } from './types';
import { setTextToElement } from './extraFunctions';

type HTMLHolder = {
	menu: 				HTMLElement
	titleHolder: 		Element,
	meaningHolder: 		Element,
	readingsHolder: 	Element,
	infoHolder: 		Element
}

export default class WordInfoMenu {
	private HTML: HTMLHolder;
	openState:boolean = false;

	constructor(_HTML: HTMLElement) { 
		this.HTML = {
			menu:				_HTML,
			titleHolder: 		_HTML.children[0],
			meaningHolder: 		_HTML.children[2].children[0],
			readingsHolder: 	_HTML.children[3].children[0],
			infoHolder: 		_HTML.children[4],
		};
	}
	
	open(_word: Word, _showMeaning:boolean = false) {
		this.openState = true;
		this.HTML.menu.classList.remove("hide");	
		this.#setTitle(_word);

		setTextToElement(this.HTML.meaningHolder, _word.meanings.join(', '));
		setTextToElement(this.HTML.readingsHolder, _word.readings.join(', '));
		setTextToElement(this.HTML.infoHolder, _word.info);
	}

	#setTitle = function(_word:Word) {
		this.HTML.titleHolder.classList.remove('radical');
		this.HTML.titleHolder.classList.remove('kanji');
		this.HTML.titleHolder.classList.remove('voca');
		setTextToElement(this.HTML.titleHolder, _word.character);
		
		let typeClasses = ['radical', 'kanji', 'voca'];
		this.HTML.titleHolder.classList.add(typeClasses[_word.type]);
	}


	close() {
		this.openState = false;
		this.HTML.menu.classList.add("hide");
	}
}