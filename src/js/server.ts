import { Question, Word } from './types';
import { App } from './app';

// //@ts-ignore
function shuffleArray(arr:Question[]) {
  return arr.sort(() => Math.random() - 0.5);
}

const Server = new (function() {
  const syncTimeout:number = 1000 * 60 * 2; //ms

  this.sync = async function() {
    await Promise.all([
      this.reviews.getQuestions(true),
      this.lessons.getWords(true),
      this.wordBaskets.getWordBaskets(true),
      this.curLevel.getCurLevelData(true),
    ]);
  }

  this.sendRequest = async function() {
    //@ts-ignore
    let response = await REQUEST.send(...arguments);
    if (response == "E_noAuth") App.requestSignIn();
    return response;
  }

  this.reviews = new (function() {
    let lastSync:Date = new Date(0);
    this.list = [];

    this.getQuestions = async function(_forceUpdate: Boolean):Promise<Question[] | Boolean> {
      if (new Date().getTime() - lastSync.getTime() < syncTimeout && !_forceUpdate) return this.list;
      let result = await Server.sendRequest("database/trainer/getReviewSession.php");
      if (!result) return false;

      let questions: Question[] = [];
      for (let word of result)
      {
        questions.push({
          askMeaning: true,
          word: word,
        });
        if (word.type == 0) continue;
        questions.push({
          askMeaning: false,
          word: word,
        });
      }

      shuffleArray(questions);
      this.list = questions;
      lastSync = new Date();
      return questions;
    }

    this.updateWordTrainStatus = async function(_question:Question, _correct:Boolean) {
      return await Server.sendRequest(
        "database/trainer/updateWordTrainStatus.php", 
        "wordId=" + _question.word.id + "&correct=" + (_correct ? "1" : "0") + "&isMeaning=" + (_question.askMeaning ? "1" : "0")
      );
    }
  } as any);


  this.lessons = new (function() {
    let lastSync:Date = new Date(0);
    this.list = [];
    this.getWords = async function(_forceUpdate:boolean):Promise<Word[] | Boolean> {
      if (new Date().getTime() - lastSync.getTime() < syncTimeout && !_forceUpdate) return this.list;
      let result = await Server.sendRequest("database/trainer/getLessonSession.php");
      if (!result) return false;

      shuffleArray(result);
      this.list = result;
      lastSync = new Date();
      return result;
    }
  } as any);

  this.wordBaskets = new (function() {
    let lastSync:Date = new Date(0);
    this.list = [];
    this.getWordBaskets = async function(_forceUpdate:boolean):Promise<Word[] | Boolean> {
      if (new Date().getTime() - lastSync.getTime() < syncTimeout && !_forceUpdate) return this.list;
      let result = await Server.sendRequest("database/trainer/getWordBaskets.php");
      if (!result) return false;

      this.list = result;
      lastSync = new Date();
      return result;
    }
  } as any);
  
  this.curLevel = new (function() {
    let lastSync:Date = new Date(0);
    this.data = {
      level: 0,
      progress: 0,
    }
    this.getCurLevelData = async function(_forceUpdate:boolean):Promise<Word[] | Boolean> {
      if (new Date().getTime() - lastSync.getTime() < syncTimeout && !_forceUpdate) return this.list;
      let result = await Server.sendRequest("database/trainer/getCurLevelData.php");
      if (!result) return false;

      this.data = result;
      lastSync = new Date();
      return result;
    }
  } as any);
} as any);

export default Server;