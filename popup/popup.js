
function sendPagesVisited(pagesVisited) {
	alert("json\n" + JSON.stringify(pagesVisited));
}


// start button: set start time and first page when clicked
document.getElementById('start-button').onclick = function() {
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(result) {
		var pagesVisited = []; // each entry will be [the page url, page title, time spent on page]

		// initial data for the starting page, time spent is time accessed
		var pageEntry = [result[0].url, result[0].title, Date.now()];
		pagesVisited.push(pageEntry);

		alert("first title which is " + result[0].title);
		alert("first time which is " + Date.now());
		alert("end of start\n" + JSON.stringify(pagesVisited));

		chrome.storage.local.set({pagesVisited: JSON.stringify(pagesVisited)}, function() {
			alert('start stroage is set to ' + JSON.stringify(pagesVisited));
		  });
	});	
};

// end button: set end time and last page when clicked
document.getElementById('end-button').onclick = function() {
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(result) {
		chrome.storage.local.get(['pagesVisited'], function(pagesVisited) {
			alert('end stoarge currently is ' + pagesVisited.key);
			alert('array is ' + (typeof pagesVisited));
			alert("start of end\n" + JSON.parse(pagesVisited));
			alert('array legnth is ' + JSON.parse(pagesVisited).length);
			

			// update time spent on the last (i.e. this) page
			var lastPageEntry = pagesVisited.pop();
			// var lastPageTime = lastPageEntry[2];
			lastPageEntry[2] = (Date.now()-lastPageEntry[2]);
			pagesVisited.push(lastPageEntry); // add lastPageEntry back to pagesVisited array

			alert("end of end\n" + JSON.stringify(pagesVisited));

			sendPagesVisited(pagesVisited);

		  });
	});	
};

// code starts here

// get current tab info and set the popup text
// (note that activeTabs is a one element array)
chrome.tabs.query({lastFocusedWindow: true, active: true}, function(result) {
	const tabURL = new URL(result[0].url);
	var domain = tabURL.hostname;
	document.getElementById('domain').textContent = domain;
});
