const fetch = require('node-fetch');
const fs = require('fs')

const domain = "https://www.wanikani.com/";


// let elements = document.getElementsByClassName("character");
async function getPage(_level = 0) {
	let response = await fetch(domain + "level/" + (_level + 1));
	return await response.text();
}

let output = [];
async function run() {

	await scrapeLevelRecursively(0);
	// output = await scrapeLevel(0);
	// output = [await getLinkInfo({link: 'radicals/barb', level: 0})];
	// output = output.concat(await getLinkInfo({link: 'kanji/%E7%94%9F', level: 0}));
	// output = output.concat(await getLinkInfo({link: 'vocabulary/%E7%94%9F', level: 0}));
	// output = output.concat(await getLinkInfo({link: 'vocabulary/%E6%96%B9', level: 0}));
	// output = output.concat(await getLinkInfo({link: 'vocabulary/%E5%BA%83%E3%81%84', level: 0}));
	// output = output.concat(await getLinkInfo({link: 'vocabulary/%E3%82%A4%E3%82%AE%E3%83%AA%E3%82%B9%E4%BA%BA', level: 0}));
	// output = output.concat(await getLinkInfo({link: 'vocabulary/%E4%BA%BA%E5%B7%A5', level: 0}));
	
	
	
	// let data = await getLinkInfo("vocabulary/%E5%85%AB");
	// console.log(data);
	// let data = await getLinkInfo('vocabulary/%E4%B8%8A%E3%82%8B');
	writeToFile(replaceRadicalImages(JSON.stringify(output)));
}

function replaceRadicalImages(_string) {
	let string = _string.split('<img class="radical-image" alt="gun" src="https://cdn.wanikani.com/subjects/images/8762-gun-large.png" />').join('url:images/radicals/gun');
	string = string.split('<img class="radical-image" alt="leaf" src="https://cdn.wanikani.com/subjects/images/8763-leaf-large.png" />').join('url:images/radicals/leaf');
	return string.split('<img class="radical-image" alt="stick" src="https://cdn.wanikani.com/subjects/images/8761-stick-large.png" />').join('url:images/radicals/stick');
}


async function scrapeLevelRecursively(l) {
	output[l] = await scrapeLevel(l);

	return new Promise(async function (resolve) {
		setTimeout(async function() {
			if (l + 1 > 10) return resolve();

			await scrapeLevelRecursively(l + 1)
			resolve();
			writeToFile(replaceRadicalImages(JSON.stringify(output)));
		}, 1000 * 10);
	});
}


run();

async function scrapeLevel(_level) {
	let linkObjects = await getLevelLinks(_level);
	// linkObjects.splice(10, 1000);
	console.log("Scrape Level: " + _level, linkObjects.length)
	let data = [];
	let promises = [];
	for (let obj of linkObjects)
	{
		console.log("scrape", obj.link);
		promises.push(
			await getLinkInfo(obj).then(function(_result) { // remove await for async scraping
				data.push(_result)
			})
		);
	}
	await Promise.all(promises);
	return data;
}

async function getLevelLinks(_level) {
	let page = await getPage(_level);
	let parts = page.split('<span lang="ja" class="item-badge"></span>');
	let links = [];

	for (let i = 1; i < parts.length; i++)
	{
		let link = parts[i].split("\">")[0].substr(13, 100);
		links.push({link: link, level: _level});
	}
	return links;
}

async function getLinkInfo(_linkObj) {
	let linkInfo = {
		character: "",
		readings: [],
		meanings: [],
		meaningInfo: "",
		readingInfo: "",
		type: 0,
		level: _linkObj.level,
	}

	console.log("getLinkInfo", domain + _linkObj.link);
	let response = await fetch(domain + _linkObj.link);
	let page = await response.text();
	
	let contentRadical = page.split('<span class="radical-icon" lang="ja">')[1];
	let contentKanji = page.split('<span class="kanji-icon" lang="ja">')[1];
	let contentVoca = page.split('<span class="vocabulary-icon" lang="ja">')[1];

	
	linkInfo.type = 0; // 0 = radical, 1 = kanji, 2 = voca
	let content = contentRadical;
	if (contentKanji) {content = contentKanji; linkInfo.type = 1;}
	if (contentVoca) {content = contentVoca; linkInfo.type = 2;}

	let info = getMeaningAndCharacter(content)
	linkInfo.character = info.character;
	linkInfo.meanings = info.meanings;

	let rmInfo = getReadingAndMeaningInfo(page);
	linkInfo.meaningInfo = rmInfo.meaningInfo;
	linkInfo.readingInfo = rmInfo.readingInfo;


	
	switch (linkInfo.type)
	{
		case 0: 
			delete linkInfo.readings;
			delete linkInfo.readingInfo;
			linkInfo.meaningInfo = getRadicalMeaningInfo(page);
		break;
		case 1:
			linkInfo.readings = getKanjiReadings(page);
		break;
		case 2:
			linkInfo.readings = getVocaReadings(page);
		break;
	}

	return linkInfo;
}

function getVocaReadings(_content) {
	let parts = _content.split('pronunciation-variant" lang="ja">');
	let readings = [];
	for (let i = 1; i < parts.length; i++)
	{
		let subPart = parts[i].split('</p>')[0];
		readings.push(cleanString(subPart));
	}

	return readings;
}

function getKanjiReadings(_content) {
	let part = _content.split('id="reading">')[1];
	let subPart = part.split('<div class="span4 ">')[1];
	let readingPart = subPart.split('<p lang="ja">')[1];
	let actualReadings = readingPart.split('</p>')[0];
	return cleanString(actualReadings).split(', ');
}


function getRadicalMeaningInfo(_content) {
	let part = _content.split('<section class="mnemonic-content mnemonic-content--new">')[1];
	let subPart = part.split('<p>')[1];
	let string = subPart.split("</section>")[0];
	let meaningInfo = cleanString(string);

	return meaningInfo.substr(0, meaningInfo.length - 4);
}


function getReadingAndMeaningInfo(_content) {
	let readingPart = _content.split('<section id="reading"')[1];
	let meaningPart = _content.split('<section id="meaning"')[1];

	return {
		readingInfo: getInfoFromContentPart(readingPart),
		meaningInfo: getInfoFromContentPart(meaningPart),
	}
}

function getInfoFromContentPart(_contentPart) {
	if (!_contentPart) return "";
	let parts = _contentPart.split('<section class="mnemonic-content mnemonic-content--new">');
	if (parts.length < 2) return "";
	let subPart = parts[1].split('<p>').splice(1, 1000).join('<p>');
	let subPart2 = subPart.split('</section>')[0];
	let info = cleanString(subPart2);
	return info.substr(0, info.length - 4);
}


function getMeaningAndCharacter(_content) {
	let parts = _content.split("</span>");
	let primaryMeaningParts = parts[1].split("</h1>");
	let primaryMeaning = cleanString(primaryMeaningParts[0]);

	let secondaryMeanings = getSecondaryMeanings(_content);

	return {
		character: parts[0],
		meanings: [primaryMeaning].concat(secondaryMeanings)
	}
}


function getSecondaryMeanings(_content) {
	let parts = _content.split('<h2>Alternatives</h2>');
	if (parts.length < 2) 
	{
		parts = _content.split('<h2>Alternative</h2>');
		if (parts.length < 2) return [];
	}

	let newParts = parts[1].split("<p>");
	let string = newParts[1].split("</p>")[0];
	return string.split(', ');
}



function cleanString(_str) {
	return removeSpacesFromEnds(removeNewLines(_str));
}

function removeNewLines(_str) {
	let stringParts = _str.split('\n');
	return stringParts.join("");
}

function removeSpacesFromEnds(_str) {
  for (let c = 0; c < _str.length; c++)
  {
    if (_str[0] !== " ") continue;
    _str = _str.substr(1, _str.length);
  }

  for (let c = _str.length; c > 0; c--)
  {
    if (_str[_str.length - 1] !== " ") continue;
    _str = _str.substr(0, _str.length - 1);
  }
  return _str;
} 


// async function run() {
// 	let output = [];
// 	for (let l = 0; l < 1; l++)
// 	{
// 		console.log("Level " + l);
// 		let page = await getPage(1);
// 		let parts = page.split('<span class="character" lang="ja">');
// 		let characters = [];
// 		for (let i = 1; i < parts.length; i++)
// 		{
// 			let subPart = parts[i].split("</span>");
// 			let character = subPart[0].substr(9, subPart[0].length - 9 - 5);
// 			characters.push(character);
// 		}
// 		output[l] = characters;
// 		writeToFile(page);
// 	}

// 	// writeToFile(JSON.stringify(output));
// }




function writeToFile(_content) {
	fs.writeFile('output.txt', _content, err => {
  		if (err) {
    		console.error(err)
    		return
  		}
	})
}