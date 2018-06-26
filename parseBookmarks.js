const fs = require('fs')
const cheerio = require('cheerio')

async function parseBookmarks() {
	/*
	* type: Object
	* error: Boolean
	* errorCode: Error/undefined
	* data: undefined/fileData
	*/
	let temp = await readFile()
	if (temp.error) {
		console.log(temp.errorCode)
		return;
	} else {
		let $ = await cheerio.load(temp.data)
		let result = await []

		$('a').each((index, a) => {
			let $a = $(a)
			let categories = getCategories($a)
			let data = {
				title: $a.text(),
				url: $a.attr('href'),
				categories
			}
			result.push(data)
		})
		await console.log(JSON.stringify(result, null, 4))
	}
}

// let parseLinks

let getCategories = ($a) => {
		let $node = $a.closest('DL').prev();
		let title = $node.text();
		if ($node.length > 0 && title.length > 0) {
			return title = [title].concat(getCategories($node))
		} else {
			return [];
		}
}

let readFile = () => {
	return new Promise((resolve, reject) => {
		fs.readFile('bookmarks.html', 'utf-8', (err, data) => {
			(err) ? resolve({ error: true, errorCode: err }) : resolve({ error: false, data })
		})
	})
}

parseBookmarks();