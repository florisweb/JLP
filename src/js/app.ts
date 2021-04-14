import ReviewPage from './reviewPage';
// import ResultPage from './resultPage';
// import HomePage from './homePage';
// import KeyHandler from './keyHandler';
import { $ } from './extraFunctions';

export namespace App {
  const HTML = {
    pages: $<HTMLElement>("#mainContent .page"),
  }

  export function setup() {
    console.warn("setup", this);
    // KeyHandler.setup();
  }

  export let curPage = false;
  export let reviewPage = new ReviewPage(openPage);
  // export let resultPage = new (ResultPage(openPage) as any);
  // export let homePage = new (HomePage(openPage) as any);


  function openPage(_index: number) {
    // @ts-ignore
    for (let page of HTML.pages) page.classList.add("hide");
    HTML.pages[_index].classList.remove("hide");
  } 
}
