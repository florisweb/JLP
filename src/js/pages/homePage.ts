import Page from './page';
import { $, setTextToElement } from '../extraFunctions';
import { App } from '../app';
import Server from '../server';

export default class HomePage extends Page {
	#HTML = {
		navHolder: $("#navigationHolder"),
		navButtons: $("#navigationHolder .panel"),
		basketTitles: $('#basketHolder .basket .title'),
		levelHolder: {
			levelText: $('.page .levelHolder .levelText')[0],
			progressScalar: $('.page .levelHolder .progressBar .front')[0],
			progressText: $('.page .levelHolder .progressBar .back, .page .levelHolder .progressBar .front')
		}
	}

	constructor() {
		super({index: 0});
	}

	setup = async function() {
		this.#HTML.navButtons[0].addEventListener("click", function () {
			App.lessonPage.open();
		});
		this.#HTML.navButtons[1].addEventListener("click", function () {
			App.reviewPage.open();
		});
	}

	onOpen = async function() {	
		await this.#updateNavButtons();
		this.#updateBaskets();
		this.#updateLevelHolder();
	}

	#updateBaskets = function() {
		let baskets = Server.wordBaskets.list;
		const basketOffset = 1;
		const groupSize = 2;
		for (let i = 0; i < this.#HTML.basketTitles.length; i++)
		{
			let wordCount = 0;
			for (let a = 0; a < groupSize; a++) wordCount += baskets[i * groupSize + a + basketOffset];
			if (i >= this.#HTML.basketTitles.length - 1)
			{
				for (let b = (i + 1) * groupSize + basketOffset; b < baskets.length; b++) wordCount += baskets[b];
			}
			setTextToElement(this.#HTML.basketTitles[i], String(wordCount));
		}
	}

	#updateLevelHolder = function() {
		let data = Server.curLevel.data;

		setTextToElement(this.#HTML.levelHolder.levelText, "Level " + (data.level + 1));
		let progress = Math.round(data.progress * 1000) / 10 + "%";
		let progressText = 'Progress ' + progress;
		setTextToElement(this.#HTML.levelHolder.progressText[0], progressText);
		setTextToElement(this.#HTML.levelHolder.progressText[1], progressText);
		
		this.#HTML.levelHolder.progressScalar.style.clipPath = 'inset(0 0 0 ' + progress + ')';
	}


	#updateNavButtons = async function() {
		await Server.sync();
		this.#HTML.navButtons[0].classList.remove("disabled");
		this.#HTML.navButtons[1].classList.remove("disabled");
		
		if (Server.lessons.list.length == 0) this.#HTML.navButtons[0].classList.add("disabled");
		if (Server.reviews.list.length == 0) this.#HTML.navButtons[1].classList.add("disabled");

		setTextToElement(this.#HTML.navButtons[0].children[1], Server.lessons.list.length + " words");
		setTextToElement(this.#HTML.navButtons[1].children[1], Server.reviews.list.length + " words");
	}
}