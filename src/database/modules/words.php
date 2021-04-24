<?php
	require_once __DIR__ . "/databaseManager.php";

	class _App_words {
		public function __construct() {
		}

		public function get($_id) {
			$list = $this->getAll();
			$found = false;
			for ($i = 0; $i < sizeof($list); $i++)
			{
				if ($list[$i]["word"]["id"] == $_id) return $list[$i];
			}
			return false;
		}

		public function update($_item) {
			$list = $this->getAll();
			$found = false;
			for ($i = 0; $i < sizeof($list); $i++)
			{
				if ($list[$i]["word"]["id"] != $_item["word"]["id"]) continue;

				$found = true;
				$list[$i] = $_item;
			}

			if (!$found) array_push($list, $_item);

			$this->set($list);
			return $this->get($_item["word"]["id"]);
		}
		
		public function remove($_id) {
			$list = $this->getAll();
			$newList = array();

			for ($i = sizeof($list) - 1; $i > 0; $i--)
			{
				if ($list[$i]["word"]["id"] != $_item["word"]["id"]) continue;
				array_splice($list, $i, 1);
				$this->set($list);
				return true;
			}

			return false;
		}
		
		public function getAll() {
			return $GLOBALS["DBManager"]->userData->getWordListByUId($GLOBALS["App"]->userId);
		}

		private function set($_list) {
			return $GLOBALS["DBManager"]->userData->setWordListByUId($_list, $GLOBALS["App"]->userId);
		}
	}
?>