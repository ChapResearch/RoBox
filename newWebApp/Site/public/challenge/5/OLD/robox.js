//
// robox.js
//
//   Interface functions to the robox backend.
//

//
// The "chromeAppID" is used to rendevouz with the helper app. This ID
// will change to something more "packaged" when the app is put on the
// Chrome store.
//
var chromeAppID = "jeamalbnbjiiljceaaghddgiohpahiib";

function roboxRun()
{
    scan();
}

function roboxStop()
{
    info();
}

function roboxPause()
{

}

function roboxScan(resultFn) {
    chrome.runtime.sendMessage(chromeAppID,{ command: "scan" },resultFn);
}

function roboxDisConnect(resultsFn)
{
    if(!resultsFn) {
	resultsFn = function(data) {
	    roboxStatus();
	}
    }

    chrome.runtime.sendMessage(chromeAppID, { command: "disconnect" }, resultsFn);
}

function roboxConnect(name,address,resultsFn)
{
    if(!resultsFn) {
	resultsFn = function(data) {
	    if(data) {
		document.getElementById('robox-select').style.display = "none";
		document.getElementById('robox-name').innerHTML = name;
	    }
	    console.log(data);
	    roboxStatus();
	}
    }

    var html = "";
    html += '<span class="robox-select-close">&times;</span>';
    html += '<div>';
    html += '<img style="margin-left:auto;margin-right:auto;display:block;" src="/media/robox.gif"/>';
    html += '<p id="robox-select-scanning">Connecting...</p>';
    html += '</div>';

    var content = document.getElementById('robox-select-content');

    content.style.backgroundColor = "#36bace";
    content.innerHTML = html;;

    chrome.runtime.sendMessage(chromeAppID, { command: "connect", address: address }, resultsFn);
}
    
//
// roboxStatus() - kick-off a status request. The given function is called
//                 with the results of the request, once they come in.
//
function roboxStatus(resultsFn)
{
    if(!resultsFn) {
	resultsFn = function(data) {
	    var ind = document.getElementById("conn-indicator");
	    switch(data) {
	    case "yes":
		ind.className = "conn-indicator conn-indicator-green";
		break;
	    case "no":
		ind.className = "conn-indicator conn-indicator-red";
		document.getElementById('robox-name').innerHTML = "";
		break;
	    default:
		ind.className = "conn-indicator";
		document.getElementById('robox-name').innerHTML = "";
		break;
	    }
	}
    }
    
    chrome.runtime.sendMessage(chromeAppID, { command: "status" }, resultsFn);
}

function roboxSelect()
{
    var modal = document.getElementById('robox-select');
    var content = document.getElementById('robox-select-content');

    content.style.backgroundColor = "#36bace";

    var html = "";
    html += '<span class="robox-select-close">&times;</span>';
    html += '<div>';
    html += '<img style="margin-left:auto;margin-right:auto;display:block;" src="/media/robox.gif"/>';
    html += '<p id="robox-select-scanning">Scanning...</p>';
    html += '</div>';

    content.innerHTML = html;;

    modal.style.display = "block";

    var span = document.getElementsByClassName("robox-select-close")[0];
    span.onclick = function() {
	modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
	if (event.target == modal) {
	    modal.style.display = "none";
	}
    }

    roboxScan(roboxSelectList);
}

function roboxSelectList(data)
{
    var modal = document.getElementById('robox-select');
    var content = document.getElementById('robox-select-content');
    var scanning = document.getElementById('robox-select-scanning');

    if(data.length == 0) {
	var html = "";
	html += '<span class="robox-select-close">&times;</span>';
	html += '<div>';
	html += '<img style="margin-left:auto;margin-right:auto;display:block;" '
	html += 'src="/media/roboxIcon128.png"/>';
	html += '<p id="robox-select-scanning">';
	html += 'Can\'t find any RoBox!';
	html += '<br>Is the power on?';
	html += '</p>';
	html += '</div>';

	content.innerHTML = html;
	return;
    } 

    content.style.backgroundColor = "#56daee";

    var html = "";
    for(var i=0; i < data.length; i++) {
	html += '<div class="robox-select-choice" ';
	html += 'onclick="roboxConnect(\'';
	html += data[i].name + '\',\'';
	html += data[i].address + '\')">';
	html += '<table><tr>'
	html += '<td><img width="40px" src="/media/roboxIcon128.png"/></td>';
	html += '<td>';
	html += '<span class="robox-select-choice-name">';
	html += data[i].name;
	html += '</span><br>';
	html += '<span class="robox-select-choice-address">';
	html += data[i].address;
	html += '</span>';
	html += '</td></tr></table>';
	html += '</div>';
    }
    html += '<div style="float:clear;"></div>';
    content.innerHTML = html;
    
}

roboxStatus();
setInterval(roboxStatus,5000);
