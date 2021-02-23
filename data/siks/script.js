/*
	- file sql manajemen backend ada di folder data/manager-new/engine/worker.js
	- di file data/manager-new/sql.js menginisiasi worker dengan kode
		- const worker = new Worker('engine/worker.js');
	

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

*/

const rt = document.getElementById("rt");
const art = document.getElementById("art");
const data_kecamatan = document.getElementById("data_kecamatan");
const data_desa = document.getElementById("data_desa");
const modal_footer = document.querySelector(".modal-footer");

function renderSQL(sql, id){
	if(sql == '' || sql == 'undefined'){
		sql = "SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY 1";
	}

	var data = {
    message:{
	        type: "fecth-sql",
	        id: id,
	        sql: sql
	    }
	};
	return data;
}

function renderItem(items){
	let i = 0;
	let item = '';

	item +=`<option>Pilih Salah Satu</option>`;
	items.forEach( (val, key) => {
		item +=`<option value="${val[0]}">"${val[1]}"</option>`;
		i++;
	} );
	return item;
}

function renderModalAtributes(label){
	clearTag('.tampil');
	document.getElementById("exampleModalLabel").innerHTML = label;

	const btn = document.createElement('button');
	btn.className = "btn btn-primary tampil";
	btn.appendChild(document.createTextNode(label));
	
	return modal_footer.appendChild(btn);
}

function clearTag(attr){
	const tag = document.querySelector(attr);
	if(tag){
		tag.remove();
	}
}


rt.addEventListener('click', function(){

	var data = renderSQL("SELECT * FROM m_kecamatan WHERE kode_kab=20 ORDER BY kode_kecamatan", "data_kecamatan");
	chrome.runtime.sendMessage(data, function(response) {
		console.log('responeMessage', response);
	});

	if(document.querySelector("#data_desa").firstChild){
		document.querySelector("#data_desa").innerHTML = "";
	}

	renderModalAtributes('Tampil RT');
	$("#modalInfo").show();
})

art.addEventListener('click', function(){

	var data = renderSQL("SELECT * FROM m_kecamatan WHERE kode_kab=20 ORDER BY kode_kecamatan", "data_kecamatan");
	chrome.runtime.sendMessage(data, function(response) {
		console.log('responeMessage', response);
	});

	if(document.querySelector("#data_desa").firstChild){
		document.querySelector("#data_desa").innerHTML = "";
	}

	renderModalAtributes('Tampil ART');
	$("#modalInfo").show();
})

data_kecamatan.addEventListener('change', () => {
	let id = data_kecamatan.value;
	var data = renderSQL("SELECT * FROM m_desa WHERE kode_kecamatan='"+id+"' ORDER BY kode_desa", "data_desa");
	chrome.runtime.sendMessage(data, function(response) {
		console.log('responeMessage', response);
	});
})

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('sender, request', sender, request);

	var current_url = window.location.href;
	if(request.type == 'response-fecth-sql'){

		var res = request.data;
		if(request.message.id=='data_kecamatan'){

			let data = renderItem(res[0].values);
			jQuery('#'+request.message.id).html(data);
		}

		if(request.message.id=='data_desa'){

			let data = renderItem(res[0].values);
			jQuery('#'+request.message.id).html(data);
		}

		jQuery('#wrap-loading').hide();
	}

	return sendResponse("THANKS from content_script!");
});