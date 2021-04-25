export const WordTypes:string[] = ["Radical", "Kanji", "Voca"];

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
