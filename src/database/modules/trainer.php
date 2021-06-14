<?php
	require_once __DIR__ . "/databaseManager.php";
	require_once __DIR__ . "/constants.php";
	


	class _App_trainer {
		private $secondsPerLevel = 60 * 60; // 1 hour per level
		private $parent;
		private $newWordsPerSession = 5;
		private $minAverageKnowledgeLevelForNewWords = 3;
		private $maxReviewCountPerDay = 25; // words per day

		public function __construct($_parent) {
			$this->parent = $_parent;
		}

		public function autoAddWordsToTrainer() {
			$score = $this->getKnowledgeLevelScore();
			$wordsToReviewNextDay = $this->getWordsByTimeDomain(0, time() + 60 * 60 * 24);

			if ($score < $this->minAverageKnowledgeLevelForNewWords || $wordsToReviewNextDay > $this->maxReviewCountPerDay) return false;
			$curIndex = $this->parent->words->getHighestIndex();

			for ($di = 0; $di < $this->newWordsPerSession; $di++)
			{
				$this->addWordToTrainer($di + $curIndex + 1);
			}

			return true;
		}

		public function getScoreByTWord($_trainerWord) {
			$score = $_trainerWord['meaningKnowledgeLevel'] + $_trainerWord['readingKnowledgeLevel'];
			if ($_trainerWord["word"]->type == 0) return $score;
			return $score / 2;
		}

		public function getKnowledgeLevelScore() {
			$words = $this->parent->words->getAll();
			if (sizeof($words) == 0) return $this->minAverageKnowledgeLevelForNewWords;

			usort($words, "sortWordArray");
			$sum = 0;
			$totalWordCount = 0;
			for ($i = 0; $i < $this->newWordsPerSession * 2; $i++)
			{
				if (sizeof($words) - 1 < $i) break;
				$totalWordCount++;
				$sum += $this->getScoreByTWord($words[$i]);
			}

			return $sum / $totalWordCount;
		}


		public function getReviewSchedule() {
			$result = [];

			for ($i = 0; $i < 24; $i++) 
			{
				$result[$i] = sizeof($this->getWordsByTimeDomain(0, time() + $i * 60 * 60));
			};
			array_push($result, $this->getKnowledgeLevelScore());

			return $result;
		}
		


		public function getReviewSession() {
			$words = $this->getWordsByTimeDomain(0, time());
			$session = array();

			foreach ($words as $trainerWord) array_push($session, $trainerWord["word"]);

			return $session;			
		}
		
		private function getWordsByTimeDomain($_min, $_max) {
			$words = $this->parent->words->getAll();
			$result = array();
			foreach ($words as $trainerWord) 
			{
				$releaseTime = $trainerWord['lastReviewTime'] + $this->secondsPerLevel * pow(2, $this->getScoreByTWord($trainerWord)) * .5;
				if ($releaseTime < $_min || $releaseTime > $_max || $trainerWord["meaningKnowledgeLevel"] == 0) continue;
				array_push($result, $trainerWord);
			}
			return $result;	
		}


		public function getLessonSession() {
			$words = $this->parent->words->getAll();
			$session = array();
			foreach ($words as $trainerWord) 
			{
				if ($trainerWord["meaningKnowledgeLevel"] != 0) continue;
				array_push($session, $trainerWord["word"]);
			}
			return $session;			
		}

		public function addWordToTrainer($_wordId) {
			$actualWord = $GLOBALS["DBManager"]->words->getById($_wordId);
			if (!$actualWord) return E_wordNotFound;
			$trainerWord = array(
				"lastReviewTime" => false,
				"meaningKnowledgeLevel" => 0,
				"readingKnowledgeLevel" => 0,
				"word" => $actualWord,
			);
			return $this->parent->words->update($trainerWord);
		}

		public function updateWordTrainStatus($_wordId, $_correct, $_isMeaning = true) {
			$trainerWord = $this->parent->words->get($_wordId);
			if (!$trainerWord) $trainerWord = $this->addWordToTrainer($_wordId);
			if ($trainerWord == E_wordNotFound) return E_wordNotFound;
			$knowledgeType = $_isMeaning ? 'meaningKnowledgeLevel' : 'readingKnowledgeLevel';
			
			$trainerWord["lastReviewTime"] = time();
			if ($_correct)
			{
				$trainerWord[$knowledgeType]++;
			} else {
				$removeCount = 2;
				if ($trainerWord[$knowledgeType] < 3) $removeCount = 1;
				if ($trainerWord[$knowledgeType] < 2) $removeCount = 0;
				
				$trainerWord[$knowledgeType] -= $removeCount;
			}
			return $this->parent->words->update($trainerWord);
		}
	}


	function sortWordArray($a, $b) {
		$scoreA = $a['meaningKnowledgeLevel'] + $a['readingKnowledgeLevel'];
		if ($a["word"]->type == 0) $scoreA *= 2;
		$scoreB = $b['meaningKnowledgeLevel'] + $b['readingKnowledgeLevel'];
		if ($b["word"]->type == 0) $scoreB *= 2;

		if ($scoreA > $scoreB) return 1;
		return -1;
	}
?>