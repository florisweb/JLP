import { setCharacterToElement } from './extraFunctions';

type HTMLHolder = {
	holder:	HTMLElement,
	menu: 	HTMLElement
}

export default class SmallInfoMenu {
	private HTML: HTMLHolder;
	openState:boolean = false;

	constructor(_HTML: HTMLElement) { 
		this.HTML = {
			holder:	_HTML,
			menu: 	<HTMLElement>_HTML.children[0],
		};
	}
	
	open(_text:string, _backgroundColor:string) {
		this.openState = true;
		this.HTML.holder.classList.remove('hide');
		
		this.HTML.menu.style.background = _backgroundColor;
		setCharacterToElement(this.HTML.menu, _text, true);
	}
	openWithTimeout(_text:string, _backgroundColor:string, _timeOut:number = 1000) {
		//@ts-ignore
		this.open(...arguments);
		let This = this;
		setTimeout(
			function () {
				This.close();
			},
			_timeOut
		);
	}

	close() {
		this.openState = false;
		this.HTML.holder.classList.add('hide');
	}
}