
function _reviewPage(_openPage) {
	let HTML = {
		questionHolder: 	$<HTMLElement>("#mainContent .page.reviewPage .questionHolder")[0],
		questionTypeHolder: $<HTMLElement>("#mainContent .page.reviewPage .questionTypeHolder")[0],
		inputField: 		$<HTMLInputElement>("#mainContent .page.reviewPage .inputField")[0],
		infoMenu: 			$<HTMLElement>("#mainContent .page.reviewPage .infoPanel")[0]
	}
	
	let InputField = new function() {
		let wanakanaIsBound:boolean = false;
		
		this.reset = function() {
			HTML.inputField.value = null; 
			HTML.inputField.focus();
		}

		this.getValue = function():string {
			return HTML.inputField.value;
		}

		this.setKanaInputMode = function() {
			if (wanakanaIsBound) return;
			//@ts-ignore
			wanakana.bind(HTML.inputField, {IMEMode: 'toHiragana' || 'toKatakana'});
			wanakanaIsBound = true;
		}
		this.setNormalInputMode = function() {
			if (!wanakanaIsBound) return;
			//@ts-ignore
			wanakana.unbind(HTML.inputField);
			wanakanaIsBound = false;
		}
	}

	let WordInfoMenu = new _WordInfoMenu(HTML.infoMenu);

	this.questions = [];


	this.open = function(_questions: Question[]) {
		_openPage(1);
		this.questions = _questions;
		this.nextQuestion();
		
		InputField.reset();
	}

	this.nextQuestion = function() {
		WordInfoMenu.close();
		if (this.questions.length < 1) return; //open result page
		this.showQuestion(this.questions[0]);
	}


	this.checkAnswer = function() {
		let isCorrect = isAnswerCorrect(this.curQuestion);
		this.questions.splice(0, 1);
		if (isCorrect) return this.nextQuestion();
		WordInfoMenu.open(this.curQuestion.word);
	}


	function isAnswerCorrect(_question:Question):boolean {
		let answer:string = removeSpacesFromEnds(InputField.getValue()).toLowerCase();
		if (_question.askMeaning && _question.word.meaning.toLowerCase() == answer) return true;

		for (let reading of _question.word.readings)
		{
			if (answer == reading.toLowerCase()) return true;	
		}
		return false;
	}



	this.curQuestion = false;
	this.showQuestion = function(_question: Question) {
		InputField.reset();
		
		this.curQuestion = _question;
		writeQuestion(this.curQuestion);
		InputField.setKanaInputMode();
		if (this.curQuestion.askMeaning) InputField.setNormalInputMode();
	}


	function writeQuestion(_question: Question) {
		let questionString:string = _question.askMeaning ? _question.word.character : _question.word.meaning;
		
		setTextToElement(
			HTML.questionHolder, 
			questionString
		);

		let color = "rgb(140, 140, 205)";
		if (_question.word.type == 1) color = "rgb(205, 140, 140)";
		if (_question.word.type == 2) color = "rgb(140, 205, 140)";
		let questionHolderLine = $<HTMLElement>("#mainContent .page .questionHolder a")[0];
		questionHolderLine.style.borderBottomColor = color;
		HTML.questionHolder.style.color = color;
		HTML.questionTypeHolder.style.color = color;

		setTextToElement(
			HTML.questionTypeHolder, 
			_question.askMeaning ? "Meaning" : "Reading"
		);
	}
}