
export type Word = {
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
