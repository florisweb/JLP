
let words = JSON.parse(`[{"character":"九","readings":["く","きゅう","ここの"],"meaning":"Nine","info":"Nice! This kanji is the same as the radical that looks just like it (down to the meaning, even!). The radical is nine and the kanji is nine, making the meaning of this kanji really easy to remember as long as you know the radical first. If you know your radicals well, this kanji will be a breeze!","type":1}, {"character": "ハ","readings": [],"meaning": "Fins","info": "Picture a fish. Now picture the fish a little worse, like a child's drawing of the fish. Now erase the fish's body and... you're left with two fins! Do you see these two fins? Yeah, you see them.","type": 0}]`);
let questions: Question[] = words.map(function (w: Word):Question {
  return {
    askMeaning: Math.random() > .5, 
    word: w
  }
});

const Server = new function() {
    
    this.review = new function() {
        this.getQuestions = async function():Promise<Question[]> {
            // let result = REQUEST.send();
            
            return questions;
        }
    }
}