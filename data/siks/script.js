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
const tampil_rt = document.querySelector(".tampil_rt");
const art = document.getElementById("art");
const tampil_art = document.querySelector(".tampil_art");
const data_kecamatan = document.getElementById("data_kecamatan");
const data_desa = document.getElementById("data_desa");
const result = document.querySelector("#result");

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

function clearTag(attr){
	const tag = document.querySelector(attr);
	if(tag){
		tag.remove();
	}
}

function decodeString(str){
	const char = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "A", "L", "M", "N", "O", "5", "9", "S", "U", "7", "6", "3", "8", "4", "1", "2", " "];
    const encode = ["€", "£", "¥", "∞", "µ", "α", "β", "π", "Ω", "∑", "#", "§", "†", "Φ", "℗", "∂", "ⱷ", "±", "≠", "ⱴ", "¤", "«", "¶", "»", "ō", "ƍ", "ʓ"];

	let newStr='';
	for(let j=0; j<str.length; j++){
		newStr +=(encode.indexOf(str.charAt(j))) == -1 ? str.charAt(j) : char[encode.indexOf(str.charAt(j))];
	}
	return newStr;
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

function renderTable(data){
	const table = document.createElement('table');
	const tableHead = document.createElement('thead');
	const tableBody = document.createElement('tbody');

	const rowHead = document.createElement('tr');
	data[0].columns.forEach( (val, key) => {
		let cell = document.createElement('td');
		cell.appendChild(document.createTextNode(val))
		rowHead.appendChild(cell);
	} )
	tableHead.appendChild(rowHead);

	data[0].values.forEach( (val, key) => {
		let rowBody = document.createElement('tr');
		val.forEach( (val2, key2) => {

			let cell = document.createElement('td');
			cell.appendChild(document.createTextNode(decodeString(val2)))
			rowBody.appendChild(cell);
		} )
		tableBody.appendChild(rowBody);
	} )

	table.appendChild(tableHead);
	table.appendChild(tableBody);
	table.setAttribute("id", "table-result");
	return table;
}

function renderModalAtributes(label, className){

	document.getElementById("exampleModalLabel").innerHTML = label;
	if(className == 'tampil_rt'){
		document.querySelector('.tampil_rt').style.display = 'block';
		document.querySelector('.tampil_art').style.display = 'none';
	}

	if(className == 'tampil_art'){
		document.querySelector('.tampil_rt').style.display = 'none';
		document.querySelector('.tampil_art').style.display = 'block';
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

	renderModalAtributes('Tampil RT', 'tampil_rt');
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

	renderModalAtributes('Tampil ART', 'tampil_art');
	$("#modalInfo").show();
})

data_kecamatan.addEventListener('change', () => {
	let id = data_kecamatan.value;
	var data = renderSQL("SELECT * FROM m_desa WHERE kode_kecamatan='"+id+"' ORDER BY kode_desa", "data_desa");
	chrome.runtime.sendMessage(data, function(response) {
		console.log('responeMessage', response);
	});
})

tampil_rt.addEventListener('click', () => {
	const kec = data_kecamatan.value;
	const desa = data_desa.value;

	var data = renderSQL("SELECT IDBDT, Nama_KRT, Alamat FROM udrt WHERE KDKEC='"+kec+"' AND KDDESA='"+desa+"' AND KDKAB='20' ORDER BY IDBDT", "result");
	chrome.runtime.sendMessage(data, function(response) {
		console.log('responeMessage', response);
	});
})

tampil_art.addEventListener('click', () => {
	const kec = data_kecamatan.value;
	const desa = data_desa.value;

	var data = renderSQL("SELECT IDARTBDT, IDBDT, Nama, NIK, NoKK, DUK_ALAMAT FROM udart WHERE KDKEC='"+kec+"' AND KDDESA='"+desa+"' AND KDKAB='20' ORDER BY IDARTBDT", "result");
	chrome.runtime.sendMessage(data, function(response) {
		console.log('responeMessage', response);
	});
})

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('sender, request', sender, request);

	var current_url = window.location.href;
	if(request.type == 'response-fecth-sql'){

		let data;
		var res = request.data;
		if(request.message.id=='data_kecamatan'){
			data = renderItem(res[0].values);
		}

		if(request.message.id=='data_desa'){
			data = renderItem(res[0].values);
		}

		if(request.message.id=='result'){
			data = renderTable(res);
		}

		jQuery('#'+request.message.id).html(data);
		$(document).ready(function() {
		    $('#table-result').DataTable();
		} );
	}
	
	jQuery('#wrap-loading').hide();
	return sendResponse("THANKS from content_script!");
});