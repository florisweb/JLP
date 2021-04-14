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
	constructor(_HTML: HTMLElement) { 
		this.HTML = {
			menu:				_HTML,
			titleHolder: 		_HTML.children[0],
			meaningHolder: 		_HTML.children[1].children[0],
			readingsHolder: 	_HTML.children[2].children[0],
			infoHolder: 		_HTML.children[3],
		};
	}
	
	open(_word: Word, _showMeaning:boolean = false) {
		this.HTML.menu.classList.remove("hide");	
		setTextToElement(this.HTML.titleHolder, _word.character);
		setTextToElement(this.HTML.meaningHolder, _word.meaning);
		setTextToElement(this.HTML.readingsHolder, _word.readings.join(", "));
		setTextToElement(this.HTML.infoHolder, _word.info);
	}


	close() {
		this.HTML.menu.classList.add("hide");
	}
}