console.log('Salam semangat!');

window.db = openDatabase('SIKS', '1.0', 'siks database', 50 * 1024 * 1024);
db.transaction(function (tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS siks (key, data)', [], function(tx, success){
		// console.log('success', success);
	}, function(tx, error){
		console.log('error', error);
	});
});


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('request', request);
	var type = request.message.type;
	if(type == 'get-url'){
		jQuery.ajax({
		    url: request.message.content.url,
		    type: request.message.content.type,
		    data: request.message.content.data,
		    dataType: 'json',
		    success:function(ret){
		    	if(request.message.content.return){
			     	var options = {
			     		type: 'response-fecth-url',
			     		data: ret
			     	}
			     	sendMessageTabActive(options);
			    }
		        // console.log(ret, request.message.content);
		        console.log(ret);
		    },
		    error:function(){
		        alert("Error");
		    }      
		});
	}
	return sendResponse("THANKS from background!");
});