function _reviewPage(_openPage) {
	let HTML = {
		page: $("#mainContent .page.reviewPage")[0],
		questionHolder: $("#mainContent .page.reviewPage .questionHolder")[0],
		inputField: $("#mainContent .page.reviewPage .inputField")[0],
	}

	this.open = function() {
		_openPage(1);
		HTML.inputField.value = null;
		HTML.inputField.focus();
		


	}


}