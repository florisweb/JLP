import 'reviewPage';
import 'resultPage';
import KeyHandler from 'keyHandler';
import { $ } from 'extraFunctions';

const App = new (function() {
  const HTML = {
    pages: $<HTMLElement>("#mainContent .page")
  }

  this.setup = function() {
    KeyHandler.setup();
  }

  this.curPage = false;
  this.reviewPage = new ReviewPage(openPage);
  this.resultPage = new ResultPage(openPage);

  function openPage(_index: number) {
    for (let page of HTML.pages) page.classList.add("hide");
    HTML.pages[_index].classList.remove("hide");
  } 
} as any);

App.setup();



export default App;