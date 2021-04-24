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
		let reviews = await Server.review.getQuestions();
		setTextToElement(this.#HTML.navButtons[1].children[1], reviews.length + " words");
		
		let lessons = await Server.lessons.getWords();
		setTextToElement(this.#HTML.navButtons[0].children[1], lessons.length + " words");
	}
}