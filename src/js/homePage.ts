import { $ } from './extraFunctions';
import { App } from './app';

export default function HomePage(_openPage:Function) {
	let HTML = {
		navHolder: $("#navigationHolder"),
		navButtons: $("#navigationHolder .panel"),
	}

	this.setup = function() {
		// HTML.navButtons[0].addEventListener("click", App.reviewPage.open);
		HTML.navButtons[1].addEventListener("click", App.reviewPage.open);
	}

	this.open = async function() {
		_openPage(0);

	}
}