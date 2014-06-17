// ==UserScript==
// @name        gmail.office.button
// @namespace   mobdim
// @include     https://mail.google.com/*
// @version     1
// @grant       none
// ==/UserScript==

window.addEventListener("load", function(e) {
		  addButton();
		  }, false);
 
function addButton(){
	 var buttonElems = document.getElementsByClassName('gbt');
	     if (buttonElems != null) {
			        buttonElems[0].innerHTML = buttonElems[0].innerHTML + '<input id="greasemonkeyButton" type="button" value="Офис" />'
						       addButtonListener();
					    }
}
 
function addButtonListener(){
	  var button = document.getElementById("greasemonkeyButton");
	    button.addEventListener('click',doMonkey,true);
}
 
function doMonkey(){
		window.location.href = 'https://mail.google.com/mail/u/0/#label/%D0%9E%D1%84%D0%B8%D1%81';
}
