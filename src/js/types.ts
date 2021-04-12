
export type Word = {
  character: string,
  meaning: string,
  readings: string[],
  type: number,

  info?: string
}

export type Question = {
	askMeaning: boolean
	word: Word,
}
