
// get username, password
document.getElementById('login-button').onclick = function() {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;

	chrome.storage.local.set({'username': username});

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({"username":username,"password":password});

	var requestOptions = {
	method: 'POST',
	headers: myHeaders,
	body: raw,
	redirect: 'follow'
	};

	fetch("http://147.182.156.48:8080/auth", requestOptions)
	.then(response => response.json())
	.then(result => {

		chrome.storage.local.set({'noAuth': username});

		alert(JSON.stringify(result));

		var requestOptions2 = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify({'username':username}),
			redirect: 'follow'
			};
	
		fetch("http://147.182.156.48:8080/", requestOptions2)
		.then(response => response.text())
		.then(result => alert(result))
		.catch(error => alert('Error: ' + error));
	})
	.catch(error => alert('Error: ' + error));

	

};


function sendPagesVisited(pagesVisited) {
	alert("json\n" + JSON.stringify(pagesVisited));

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	chrome.storage.local.get(['noAuth'], function(result) {
		const username = result.noAuth;

		alert("username: " + username);

		var raw = JSON.stringify({"username":username,"nodeList":pagesVisited});

		var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
		};

		fetch("http://147.182.156.48:8080/makeGraph", requestOptions)
		.then(response => response.text())
		.then(result => {
			alert(JSON.stringify(result));
		})
		.catch(error => alert('Error: ' + error));


		chrome.storage.local.remove(["storedArray"], function(){
			var error = chrome.runtime.lastError;
			if (error) console.error(error);
		})

	  });

}

// start button: set start time and first page when clicked
document.getElementById('start-button').onclick = function() {
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(result) {
		var pagesVisited = []; // each entry will be [the page url, page title, time spent on page]

		// initial data for the starting page, time spent is time accessed
		var pageEntry = [result[0].url, result[0].title, Date.now()];
		pagesVisited.push(pageEntry);

		chrome.storage.local.set({'storedArray': pagesVisited});

		/* DEBUGGING
		alert("first title which is " + result[0].title);
		alert("first time which is " + Date.now());
		alert("end of start\n" + JSON.stringify(pagesVisited));


		chrome.storage.local.get(['storedArray'], function(result) {
		alert('start storage check ' + JSON.stringify(result.storedArray));
		});
		*/
	});	
};

// end button: set end time and last page when clicked
document.getElementById('end-button').onclick = function() {
	chrome.tabs.query({lastFocusedWindow: true, active: true}, function(result) {
		chrome.storage.local.get(['storedArray'], function(result) {
			var pagesVisited = result.storedArray;

			// alert('end stoarge currently is ' + JSON.stringify(pagesVisited));
			// alert('array legnth is ' + pagesVisited.length);

			// update time spent on the last (i.e. this) page
			var lastPageEntry = pagesVisited.pop();
			// var lastPageTime = lastPageEntry[2];
			lastPageEntry[2] = (Date.now()-lastPageEntry[2]);
			pagesVisited.push(lastPageEntry); // add lastPageEntry back to pagesVisited array

			// alert("end of end\n" + JSON.stringify(pagesVisited));

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


