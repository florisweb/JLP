
function _reviewPage(_openPage) {
	let HTML = {
		questionHolder: 	$<HTMLElement>("#mainContent .page.reviewPage .questionHolder")[0],
		questionTypeHolder: $<HTMLElement>("#mainContent .page.reviewPage .questionTypeHolder")[0],
		inputField: 		$<HTMLInputElement>("#mainContent .page.reviewPage .inputField")[0]
	}

	this.questions = [];


	this.open = function(_questions: Question[]) {
		_openPage(1);
		this.questions = _questions;
		this.nextQuestion();

		HTML.inputField.value = null; 
		HTML.inputField.focus();
	}

	this.nextQuestion = function() {
		if (this.questions.length < 1) return; //open result page
		this.showQuestion(this.questions[0])
	}


	this.checkAnswer = function() {
		console.log(isAnswerCorrect(this.curQuestion));
	}


	function isAnswerCorrect(_question:Question):boolean {
		let answer:string = removeSpacesFromEnds(HTML.inputField.value);
		
		for (let reading of _question.word.readings)
		{
			if (answer == reading) return true;	
		}
		return false;
	}



	this.curQuestion = false;
	this.showQuestion = function(_question: Question) {
		this.curQuestion = _question;
		writeQuestion(this.curQuestion);
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