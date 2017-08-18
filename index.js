'use strict'
module.exports = opt => {
	// Switch to ES5 since this executes in browser
	var reviews = document.querySelectorAll(opt.elements.reviewBlock)
	var title = document.querySelector(opt.elements.productTitle)
	title = title ? title.textContent : 'Not found'
	var arr = []

	for (var i = 0; i < reviews.length; i++) {
		// Get review ID from link
		var els = {
			link: reviews[i].querySelector(opt.elements.link),
			title: reviews[i].querySelector(opt.elements.title),
			text: reviews[i].querySelector(opt.elements.text),
			rating: reviews[i].querySelector(opt.elements.rating),
			author: reviews[i].querySelector(opt.elements.author),
			date: reviews[i].querySelector(opt.elements.date)
		}
		if (els.link) {
			var link = els.link.href
			var id = link.split('/')
			id = id[id.length - 2]
		} else {
			cb('No link/ID found in reviews')
		}

		// If this is the most recent, stop crawling page
		if (opt.stopAtReviewId == id) {
			break
		}

		// Trim date
		var date
		if (els.date) {
			date = els.date.textContent.trim()
			if (date.indexOf('on ') === 0) {
				date = new Date(date.replace('on ', ''))
				if (date == 'Invalid Date') {
					date = undefined;
				}
			}
		}

		// Put each in try statement
		arr[i] = {
			id: id,
			link: link,
			title: els.title ? els.title.textContent : 'Not found',
			text: els.text ? els.text.textContent : 'Not found',
			rating: els.rating,
			author: els.author ? els.author.textContent : 'Not found',
			date: date
		}
		// Get rating from class
		if (els.rating) {
			var rat = els.rating.classList
			var found = false
			for (var ii = rat.length; ii--;) {
				if (rat[ii].indexOf(opt.elements.ratingPattern) == 0) {
					found = rat[ii].replace(opt.elements.ratingPattern, '')
					found = Number(found)
				}
			}
			arr[i].rating = found
		} else {
			arr[i].rating = 'Not found'
		}
	}

	return {
		title: title,
		reviews: arr
	}
}