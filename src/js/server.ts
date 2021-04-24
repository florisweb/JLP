import { Question, Word } from './types';

// //@ts-ignore
function shuffleArray(arr:Question[]) {
  return arr.sort(() => Math.random() - 0.5);
}



const Server = new (function() {
    this.review = new (function() {
        this.getQuestions = async function():Promise<Question[] | Boolean> {
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
          return questions;
        }

        this.updateWordTrainStatus = async function(_question: Question, _correct:Boolean) {
          //@ts-ignore
          let result = await REQUEST.send("database/trainer/updateWordTrainStatus.php", "wordId=" + _question.word.id + "&correct=" + _correct);
          console.warn(result);
        }
    } as any);


    this.lessons = new (function() {
      this.getWords = async function():Promise<Question[] | Boolean> {
        //@ts-ignore
        let result = await REQUEST.send("database/trainer/getLessonSession.php");
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
        return questions;
      }
  } as any);
} as any);

export default Server;