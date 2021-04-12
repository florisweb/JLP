
export default function ResultPage(_openPage:Function) {
	let HTML = {
	}
	

	this.questions = [];


	this.open = async function() {
		_openPage(2);

	}
}