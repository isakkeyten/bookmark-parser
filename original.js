var cli = process.argv.slice(2)
var path = require('path')
var fs = require('fs-extra')
var cheerio = require('cheerio')

var $ = cheerio.load(fs.readFileSync(path.resolve(__dirname, cli[0])))

function getCategories($a) {
	var $node = $a.closest('DL').prev();
	var title = $node.text();
	if ($node.length > 0 && title.length > 0) {
		return title = [title].concat(getCategories($node));
	} else {
		return [];
	}
}

var jsonbmArray = []
$('a').each(function (index, a) {
	let $a = $(a)
	let categories = getCategories($a)
	// add level information
	let new_categories = categories.reverse().map(function (currentValue, index) {
		return currentValue['level'] = index + 1, currentValue
	})
	let jsonbm = {
		'title': $a.text(),
		'url': $a.attr('href'),
		'categories': categories,
	}
	jsonbmArray.push(jsonbm)
})

fs.writeFileSync(path.resolve(__dirname, cli[1]), JSON.stringify(jsonbmArray, null, 4))