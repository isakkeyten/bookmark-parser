const fs = require('fs')
const cheerio = require('cheerio')
const util = require('util')
const readFile = util.promisify(fs.readFile)

async function parseBookmarks() {
	let temp = await readFile('bookmarks.html', 'utf-8').catch(err => Promise.resolve(err));
	let $ = await cheerio.load(temp)
	let result = await []

	$('a').each(function (index, a) {
		let $a = $(a)
		let categories = getCategories($a)
		let data = {
			'title': $a.text(),
			'url': $a.attr('href'),
			'categories': categories,
		}
		result.push(data)
	})
	await console.log(JSON.stringify(result, null, 4))
}

function getCategories($a) {
	let $node = $a.closest('DL').prev();
	let title = $node.text();
	if ($node.length > 0 && title.length > 0) {
		return title = [title].concat(getCategories($node));
	} else {
		return [];
	}
}

parseBookmarks();