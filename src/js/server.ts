import { Question, Word } from './types';

// //@ts-ignore
function shuffleArray(arr:Question[]) {
  return arr.sort(() => Math.random() - 0.5);
}



const Server = new (function() {
  const syncTimeout:number = 1000 * 120; //ms

  this.sync = async function() {
    await Promise.all([
      this.reviews.getQuestions(true),
      this.lessons.getWords(true)
    ]);
  }

  this.reviews = new (function() {
    let lastSync:Date = new Date(0);
    this.list = [];

    this.getQuestions = async function(_forceUpdate: Boolean):Promise<Question[] | Boolean> {
      if (new Date().getTime() - lastSync.getTime() < syncTimeout && !_forceUpdate) return this.list;
      //@ts-ignore
      let result = await REQUEST.send("database/trainer/getReviewSession.php");
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

    this.updateWordTrainStatus = async function(_wordId: number, _correct:Boolean) {
      //@ts-ignore
      return await REQUEST.send(
        "database/trainer/updateWordTrainStatus.php", 
        "wordId=" + _wordId + "&correct=" + (_correct ? "1" : "0")
      );
    }
  } as any);


  this.lessons = new (function() {
    let lastSync:Date = new Date(0);
    this.list = [];
    
    this.learnedWord = function(_word:Word) {
      return Server.reviews.updateWordTrainStatus(_word.id, true);
    }

    this.getWords = async function(_forceUpdate:boolean):Promise<Word[] | Boolean> {
      if (new Date().getTime() - lastSync.getTime() < syncTimeout && !_forceUpdate) return this.list;
      //@ts-ignore
      let result = await REQUEST.send("database/trainer/getLessonSession.php");
      if (!result) return false;

      shuffleArray(result);
      this.list = result;
      lastSync = new Date();
      return result;
    }
  } as any);
} as any);

export default Server;