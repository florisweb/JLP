import { Question, Word } from './types';

function shuffleArray(arr:[]) {
  arr.sort(() => Math.random() - 0.5);
}
let words = JSON.parse(`[{"character":"九","readings":["く","きゅう","ここの"],"meaning":"Nine","info":"Nice! This kanji is the same as the radical that looks just like it (down to the meaning, even!). The radical is nine and the kanji is nine, making the meaning of this kanji really easy to remember as long as you know the radical first. If you know your radicals well, this kanji will be a breeze!","type":1}, {"character": "ハ","readings": [],"meaning": "Fins","info": "Picture a fish. Now picture the fish a little worse, like a child's drawing of the fish. Now erase the fish's body and... you're left with two fins! Do you see these two fins? Yeah, you see them.","type": 0}]`);
words.push({
  character: '少し',
  readings: ['すこし'],
  meaning: 'A little',
  info: 'This word is a single kanji with hiragana attached, though there is no specific clue as to what type of word it is. That means you can usually guess it\'s a noun, adverb or na-adjective (in this case it\'s a noun / adverb). The meaning of this word is pretty much the same as the kanji, though, making it fairly easy. The kanji meaning for 少 is few, and the meaning of the vocab form is a little or a few.',
  type: 1,
});
words.push({
  character: '少ない',
  readings: ['すくない'],
  meaning: 'Not many, A few, Scarce, Not much',
  info: 'This word has a single kanji with hiragana attached, ending in a い. This means you know it\'s an adjective. What is the adjective form of few? It\'s also few.',
  type: 2,
});


let questions: Question[] = [];
for (let word of words)
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
shuffleArray(words);


const Server = new (function() {
    this.review = new (function() {
        this.getQuestions = async function():Promise<Question[]> {
            // let result = REQUEST.send();
            
            return questions;
        }
    } as any);
} as any);

export default Server;