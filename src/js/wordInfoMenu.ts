import { Word } from 'types';
import { setTextToElement } from 'extraFunctions';

export function WordInfoMenu(_HTML:HTMLElement) {
	let HTML = {
		menu: _HTML,
		titleHolder: _HTML.children[0],
		meaningHolder: _HTML.children[1].children[0],
		readingsHolder: _HTML.children[2].children[0],
		infoHolder: _HTML.children[3],
	}
	
	this.open = function(_word: Word, _showMeaning:boolean = false) {
		HTML.menu.classList.remove("hide");	
		setTextToElement(HTML.titleHolder, _word.character);
		setTextToElement(HTML.meaningHolder, _word.meaning);
		setTextToElement(HTML.readingsHolder, _word.readings.join(", "));
		setTextToElement(HTML.infoHolder, _word.info);
	}


	this.close = function() {
		HTML.menu.classList.add("hide");
	}
}