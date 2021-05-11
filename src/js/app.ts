import ReviewPage from './pages/reviewPage';
import ResultPage from './pages/resultPage';
import LessonPage from './pages/lessonPage';
import HomePage from './pages/homePage';
import KeyHandler from './keyHandler';
import { $ } from './extraFunctions';
import Page from './pages/page';

export namespace App {
  const HTML = {
    pages: $<HTMLElement>("#mainContent .page"),
  }


  export let homePage       = new HomePage();
  export let reviewPage     = new ReviewPage();
  export let resultPage     = new ResultPage();
  export let lessonPage     = new LessonPage();
  export let curPage:Page   = homePage;


  export function requestSignIn() {
    window.location.replace('http://localhost/user/login?redirect=' + window.location.href);
    // window.location.replace('https://user.florisweb.tk/login?redirect=' + window.location.href);
  }

  export async function setup() {
    console.warn("Started setting up...");
    await homePage.setup();
    await reviewPage.setup();
    await lessonPage.setup();
    await resultPage.setup();

    KeyHandler.setup();
    
    await homePage.open();
    console.warn("Finished setting up!");
  }
}
