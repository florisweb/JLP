type WordType = {
  name: string,
  class: string,
}
export const WordTypes:WordType[] = [
  {name: "Radical", class: 'radical'}, 
  {name: "Kanji", class: 'kanji'}, 
  {name: "Voca", class: 'voca'}
];

export type Word = {
  id?: number,
  character: string,
  meanings: string[],
  readings: string[],
  type: number,

  readingInfo?: string,
  meaningInfo?: string
}

export type Question = {
	askMeaning: boolean
	word: Word,
}
