
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.url) {
		alert("pagechanged");
		chrome.storage.local.get(['storedArray'], function(result) {
			var pagesVisited = result.storedArray;

			alert('bkg storage check ' + JSON.stringify(pagesVisited));

			// update time spent on last page
			var lastPageEntry = pagesVisited.pop();
			var lastPageTime = lastPageEntry.pop();
			lastPageEntry.push((Date.now()-lastPageTime));
			pagesVisited.push(lastPageEntry); // add lastPageEntry back to pagesVisited array

			// create new pageEntry for current page
			var pageEntry = [tab.url, tab.title, Date.now()];
			pagesVisited.push(pageEntry);

			chrome.storage.local.set({'storedArray': pagesVisited}, function() {
				alert('bkg storage is set to ' + JSON.stringify(pagesVisited));
			});
		})
	}
});