import { App } from '../app';
import { $ } from '../extraFunctions';

const HTML = {
	pages: $<HTMLElement>("#mainContent .page"),
}

export default class Page {
	pageIndex:number = 0;
	constructor({index}: {index:number}) {
		this.pageIndex = index;
	}
	
	setup = async function() {console.log('defaultSetup');}
	onOpen = async function() {console.warn('Warning: You forgot to add a onOpen-handler to this page.', this);}
	onClose = async function() {console.warn('Warning: You forgot to add a onClose-handler to this page.', this);}
	onEnterPress = function(_inInputField:boolean) {console.warn('Warning: You forgot to add a onEnterPress-handler to this page.', this);}

	open = async function() {
		App.curPage.onClose();
		this.#openHTMLPage(this.pageIndex);
		App.curPage = this;
		let result;
		try {
			result = await this.onOpen(...arguments);
		} catch (e) {};

		return result;
	}

	#openHTMLPage = function(_index: number) {
		// @ts-ignore
		for (let page of HTML.pages) page.classList.add("hide");
		HTML.pages[_index].classList.remove("hide");
	} 
};