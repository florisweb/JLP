# JLP
Problems:
- XSS in the info-field in the wordInfoMenu



======== DEFINITIONS ======== 


	
	Frontend:
		Word ={
		  character: string,
		  meanings: string[],
		  readings: string[],
		  type: number,

		  readingInfo?: string,
		  meaningInfo?: string
		}

	Backend:
		Word = {
		  character: string,
		  meanings: string[],
		  readings: string[],
		  type: number,

		  readingInfo?: string,
		  meaningInfo?: string,
		}
		
		TrainerWord: LearnedWords & toLearnWords
		{
			word: Backend.Word,
			lastReviewTime: PHP.time,
		  	knowledgeLevel: number
		}
		



DB:
- userList
	- LearnedWords & toLearnWords
		{
			wordId: ..,
			lastReviewTime: PHP.time,
		  	knowledgeLevel: number
		}
