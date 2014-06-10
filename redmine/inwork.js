// ==UserScript==
// @name        inwork
// @namespace   mobdim
// @include     https://redmine.mobdim.com/issues/*
// @version     1
// @grant       none
// ==/UserScript==

var tt = document.createElement('DIV');
tt.innerHTML = "<script>\
var linkInWork = '<a href=\"javascript:void(0);\" onclick=\"setInWork(); return false;\" class=\"icon\">In work</a>';\
$A( $$( '#content .contextual a.icon-del' ) ).each( function( Elem ) {\
	Elem.insert( {'after': linkInWork} );\
});\
function setInWork()\
{\
	var t = $('loggedas').innerHTML;\
	var userId = /\\/users\\/([0-9]*)/.exec(t);\
	if ( userId !== null ) {\
		userId = userId[1];\
	}\
	var statusValue = 2;\
	setSelectOptionSelected( 'issue_assigned_to_id', userId );\
	setSelectOptionSelected( 'issue_status_id', statusValue );\
	$('issue-form').submit();\
}\
function setSelectOptionSelected( SelId, Value )\
{\
	var sel = $( SelId );\
	$A( sel.options ).find( function( option, index ) {\
	   if( option.value == Value ) {\
			sel.selectedIndex = index;\
	   }\
	});\
}\
</script>";

document.getElementById('content').appendChild(tt);
