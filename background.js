
// code starts here

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	  if (changeInfo.url) {
		chrome.storage.local.get(['pagesVisited'], function(pagesVisited) {
			// update time spent on last page
			var lastPageEntry = pagesVisited.pop();
			var lastPageTime = lastPageEntry.pop();
			lastPageEntry.push((request.data.time-lastPageTime));
			pagesVisited.push(lastPageEntry); // add lastPageEntry back to pagesVisited array

			// create new pageEntry for current page
			var pageEntry = [request.data.url, request.data.title, request.data.time];
			pagesVisited.push(PageEntry);
		})
	  }
	});