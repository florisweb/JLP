



const App = new function() {
  const HTML = {
    pages: $("#mainContent .page")
  }

  this.reviewPage = new _reviewPage(openPage);
  this.openPage = openPage;
  function openPage(_index) {
    for (let page of HTML.pages) page.classList.add("hide");
    HTML.pages[_index].classList.remove("hide");
  } 
};



