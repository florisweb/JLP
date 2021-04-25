import Page from './page';
import { $, setTextToElement } from '../extraFunctions';
import { App } from '../app';
import Server from '../server';

export default class HomePage extends Page {
	#HTML = {
		navHolder: $("#navigationHolder"),
		navButtons: $("#navigationHolder .panel"),
	}

	constructor() {
		super({index: 0});
	}

	setup = async function() {
		this.#HTML.navButtons[1].addEventListener("click", function () {
			App.reviewPage.open();
		});
	}

	onOpen = async function() {	
		await this.#updateNavButtons();
	}


	#updateNavButtons = async function() {
		await Server.sync();
		console.log('sync');
		this.#HTML.navButtons[0].classList.remove("disabled");
		this.#HTML.navButtons[1].classList.remove("disabled");
		
		if (Server.lessons.list.length == 0) this.#HTML.navButtons[0].classList.add("disabled");
		if (Server.reviews.list.length == 0) this.#HTML.navButtons[1].classList.add("disabled");

		setTextToElement(this.#HTML.navButtons[0].children[1], Server.lessons.list.length + " words");
		setTextToElement(this.#HTML.navButtons[1].children[1], Server.reviews.list.length + " words");
	}
}