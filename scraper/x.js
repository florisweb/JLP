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

	// await scrapeLevelRecursively(0);
	output = await scrapeLevel(0);
	
	
	// let data = await getLinkInfo("vocabulary/%E5%85%AB");
	// console.log(data);
	// let data = await getLinkInfo('vocabulary/%E4%B8%8A%E3%82%8B');
	
	writeToFile(JSON.stringify(output));
}

async function scrapeLevelRecursively(l) {
	output[l] = await scrapeLevel(l);

	return new Promise(async function (resolve) {
		setTimeout(async function() {
			if (l + 1 > 10) return resolve();

			await scrapeLevelRecursively(l + 1)
			resolve();

		}, 1000 * 10);
	});
}


run();

async function scrapeLevel(_level) {
	let links = await getLevelLinks(0);
	console.log("Scrape Level: " + _level, links.length)
	let data = [];
	let promises = [];
	for (let link of links)
	{
		promises.push(
			getLinkInfo(link).then(function(_result) {
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
		links.push(link);
	}
	if (links.length == 0) writeToFile(page);
	return links;
}

async function getLinkInfo(_link) {
	let response = await fetch(domain + _link);
	let page = await response.text();
	
	let contentRadical = page.split('<span class="radical-icon" lang="ja">')[1];
	let contentKanji = page.split('<span class="kanji-icon" lang="ja">')[1];
	let contentVoca = page.split('<span class="vocabulary-icon" lang="ja">')[1];
	let content = contentRadical;

	
	let type = 0; // 0 = radical, 1 = kanji, 2 = voca
	if (contentKanji) {content = contentKanji; type = 1;}
	if (contentVoca) {content = contentVoca; type = 2;}

	let parts = content.split("</span>");
		
	let meaningSubPart = parts[1].split('</h1>')[0];
	let meaning = meaningSubPart.substr(1, meaningSubPart.length - 12);

	let infoSubPart = content.split('<section class="mnemonic-content mnemonic-content--new">')[1].split('</section>')[0];
	let info = infoSubPart.substr(8, infoSubPart.length - 17);

	let readings = [];
	if (type == 1)
	{
		let readingParts = page.split('<p lang="ja">');
		for (let i = 1; i < readingParts.length; i++)
		{
			let curPart = readingParts[i].split("</p>")[0];
			let curReadingString = curPart.substr(17, curPart.length - 32);
			readings.push(curReadingString.split(", "));
		}
	} else if (type == 2)
	{
		let readingPart = page.split('<div data-react-class="AudioPronunciations/AudioPronunciations" data-react-props="{&quot;readings&quot;:[{&quot;primary&quot;:true,&quot;reading&quot;:&quot;')[1];
		let reading = readingPart.split("&quot;,&quot;acceptedAnswer&quot;:true}]")[0]
		readings.push(reading);
	}


	let linkInfo = {
		character: parts[0],
		readings: readings, //On, Kun, Na
		meaning: meaning,
		info: info,
		type: type 
	}

	return linkInfo;
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