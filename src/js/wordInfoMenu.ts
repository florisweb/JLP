import { Word, WordTypes } from './types';
import { setTextToElement, setCharacterToElement } from './extraFunctions';

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
		this.#setReadings(_word);
		
		let info = _word.readingInfo;
		if (_showMeaning || _word.type == 0) info = _word.meaningInfo;
		this.HTML.infoHolder.innerHTML = info;
		// setTextToElement(this.HTML.infoHolder, info);
	}

	#setTitle = function(_word:Word) {
		for (let type of WordTypes)
		{
			this.HTML.titleHolder.classList.remove(type.class);	
		}
		
		setCharacterToElement(
			this.HTML.titleHolder, 
			_word.character,
			true
		);
		
		this.HTML.titleHolder.classList.add(WordTypes[_word.type].class);
	}

	#setReadings = function(_word: Word) {
		let reading =  _word.readings.join(', ');
		this.HTML.readingsHolder.parentNode.classList.remove('hide');
		if (!reading || _word.type == 0)
		{
			this.HTML.readingsHolder.parentNode.classList.add('hide');
		}

		setTextToElement(this.HTML.readingsHolder, reading);
	}	


	close() {
		this.openState = false;
		this.HTML.menu.classList.add("hide");
	}
}