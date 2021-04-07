
type Word = {
  character: string,
  meaning: string,
  readings: string[],
  type: number,

  info?: string
}

type Question = {
	askMeaning: boolean
	word: Word,
}






let word1: Word = {
  character: "ト",
  readings: ['とう'],
  meaning: "Toe",
  info: "This radical looks just like the katakana character <span lang=\"ja\">ト</span> (to), which sounds like the word <span class=\"radical-highlight\" title=\"Radical\" rel=\"tooltip\">toe</span>. So when you see <span lang=\"ja\">ト</span>, think toe.",
  type: 0
}

let question: Question = {
	askMeaning: false,
	word: word1
}