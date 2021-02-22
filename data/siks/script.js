/*
	- file sql manajemen backend ada di folder data/manager-new/engine/worker.js
	- di file data/manager-new/sql.js menginisiasi worker dengan kode
		- const worker = new Worker('engine/worker.js');
	- 
*/

var data = {
    message:{
        type: "fecth-sql",
        sql: "SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY 1"
    }
};
jQuery('#wrap-loading').show();
chrome.runtime.sendMessage(data, function(response) {
    console.log('responeMessage', response);
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('sender, request', sender, request);
	var current_url = window.location.href;
	if(request.type == 'response-fecth-sql'){
		var res = request.data;
		jQuery('#data-sql').val(JSON.stringify(res));
		jQuery('#wrap-loading').hide();
	}
	return sendResponse("THANKS from content_script!");
});