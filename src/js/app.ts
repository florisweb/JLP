import 'reviewPage';
import 'resultPage';

const App = new function() {
  const HTML = {
    pages: $<HTMLElement>("#mainContent .page")
  }

  this.setup = function() {
    document.body.addEventListener("keydown", function(_e) {
      KEYS[_e["key"]] = true;
      let preventDefault = KeyHandler.handleKeys(KEYS, _e);
      if (preventDefault) _e.preventDefault();
    });

    document.body.addEventListener("keyup", function(_e) {
      KEYS[_e["key"]] = false;
    });
  }

  this.curPage = false;
  this.reviewPage = new ReviewPage(openPage);
  this.resultPage = new ResultPage(openPage);

  function openPage(_index) {
    for (let page of HTML.pages) page.classList.add("hide");
    HTML.pages[_index].classList.remove("hide");
  } 
};

App.setup();


export default App;