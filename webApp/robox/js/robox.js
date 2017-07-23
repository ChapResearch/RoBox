//
// robox.js
//
//   Interface functions to the robox backend.
//

function roboxRun()
{
    // DEBUG DEBUG DEBUG - some test code here - real code below that
    //    var roboxCode = roboxCompile("L[2][1]S[10]L[2][0]");

//    var roboxCode = roboxCompile("L[2][1]L[1][1]");
    //    var roboxCode = roboxCompile("L21L20L21L20");
//    var roboxCode= roboxCompile("L21S[10]L20");
  //      var roboxCode= roboxCompile("L21WL[-100]WR[50]S[20]L20");
    //    var roboxCode = roboxCompile("RT[3](L21S[10]L20S[10])");
//    var roboxCode = roboxCompile("B[77][1]S[10]B[65][1]");
//     var roboxCode = roboxCompile("L21WL[-100]S[20]L20");

//    var roboxCode = roboxCompile("L21L20L21");
  //        var roboxCode = roboxCompile("L21L20L21");
//        var roboxCode = roboxCompile("L21S[0]L20");

    var roboxCode = roboxCompile();
    console.log("running: \"" + roboxCode + "\"");

    var rcl = new RCLMessage();       // send the program
    rcl.Program(roboxCode);           // send the program
    rcl.Run();                        // and start the run
    rcl.Transmit();

    RoBoxEvents.dispatch("onRun");
}

function roboxRunOrig(resultsFn)
{
    if(!resultsFn) {
	resultsFn = function(data) {
	    roboxStatus();
	}
    }

    chrome.runtime.sendMessage(chromeAppID,{ command: "send" },resultsFn);

}

function roboxStop(resultsFn)
{
    var rcl = new RCLMessage();
    rcl.Stop();
    rcl.Transmit();
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
    document.getElementById('robox-name').innerHTML = "";

    setTimeout(roboxStatus,1000);
}

//
// roboxConnect() - called from the GUI, when a user clicks on one of the tiles
//                  presented after a scan.  The name and address are normally
//                  given, but the resultsFn isn't.

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
	    switch(data) {
	    case "yes":
		RoBoxEvents.dispatch("onConnect");
		break;
		
	    case "no":
		RoBoxEvents.dispatch("onDisconnect");
		break;
		
	    default:
		RoBoxEvents.dispatch("onNoDongle");
		break;
	    }
	}
    }
    
    chrome.runtime.sendMessage(chromeAppID, { command: "status" }, resultsFn);
}

function roboxExplain()
{
    var modal = document.getElementById('robox-explain');

    modal.style.display = "block";

    var span = document.getElementsByClassName("robox-explain-close")[0];
    span.onclick = function() {
	modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
	if (event.target == modal) {
	    modal.style.display = "none";
	}
    }
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


function roboxChangeNameClose()
{
    var modal = document.getElementById('robox-changename');

    modal.style.display = "none";
}

function roboxChangeName()
{
    var modal = document.getElementById('robox-changename');
    var content = document.getElementById('robox-changename-content');

    modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
	if (event.target == modal) {
	    modal.style.display = "none";
	}
    }

    var html = '<span onclick="javascript:roboxChangeNameClose();" class="robox-changename-close">&times;</span>';

    html += '<br><br><br>';
    html += '<form action="javascript:roboxChangeNameExecute();">';
    html += '<input id="robox-input-name" type="text" name="robox-name" size="13" maxlength="13" onkeyup="roboxNoSpaces(\'robox-input-name\')">'
    html += '<br><span id="robox-changename-notes">(13 letters maximum, no spaces or weird characters!)</span>';
    html += '<br><br><input type="submit" value="Change Name!">';
    html += '</form>';

    content.innerHTML = html;

    document.getElementById("robox-input-name").focus();
}

roboxChangeNameCount = 5;

function roboxChangeNameCountdown()
{
    roboxChangeNameCount -= 1;

    document.getElementById("robox-changename-countdown").innerHTML = roboxChangeNameCount;

    if(roboxChangeNameCount != 0) {
	setTimeout(roboxChangeNameCountdown,1000);
    } else {
	document.getElementById('robox-changename').style.display = "none";
	roboxSelect();
    }
    roboxStatus();
}
    
function roboxChangeNameExecute()
{
    var content = document.getElementById('robox-changename-content');
    var newName = document.getElementById("robox-input-name").value;

    var html = '<span class="robox-changename-close">&times;</span>';

    html += '<br>';
    html += '<div class="robox-changename-waiting">';
    html += 'Changing the RoBox name...<br>';
    html += 'please wait...<br>';
    html += 'it takes a little bit of time...<br>';
    html += '<span id="robox-changename-countdown">10</span>';
    html += '</div>';

    content.innerHTML = html;

    roboxChangeNameCount = 5;
    document.getElementById("robox-changename-countdown").innerHTML = roboxChangeNameCount;
    setTimeout(roboxChangeNameCountdown,1000);

    // TODO - need to restrict name just like the input field does (just in case)

    if(newName) {
	var rcl = new RCLMessage();
	rcl.SetName(newName);
	rcl.Transmit();
    }
}

function roboxNoSpaces(id)
{
    // restrict the input to only those characters that are allowed

    var rx = new RegExp("[A-Za-z0-9-_]*", 'g');
    var target = document.getElementById(id);

    if(target) {
	var matches = target.value.match(rx);
	target.value = matches.join('');
    }
}

//
// roboxCompile() - given the current workspace, compile the blocks into
//                  RXL.  The first step compiles into integer-indicated
//                  which is using the square brackets. The second step
//                  is to covert that to bytes.
//
//                  It is important to point out that the upstream client
//                  has mapped the important things to numbers. In particular,
//                  sensors and variables are mapped to > 100 numbers.
//
//       NOTE - you can supply "test code" to this routine if you want.
//              It should be in the format that is normally output by
//              Blockly compile.  If you don't supply test code, then
//              the current blockly workspace will be compiled.
//
function roboxCompile(testcode)
{
    // NOTE - blockly compiles into pretty ascii-readable code
    //        But to send it off to RoBox, we need to change the
    //        integer indicators to integers.
    //
    // FURTHER - we convert all of the code into an array of integers
    //           which will then be sent off to the RoBox.

    var code;
    if(testcode) {
	code = testcode;
    } else {
	code = Blockly.RXP.workspaceToCode(workspace);
    }
    console.log(code);

    // at this point, the code may contain multiple lines,
    // with each indicating a string of code.  We run the
    // one with an "S" at the start.  We complain if there
    // are more than one with an "S".

    code = roboxFindStart(code);
    
    var codeArray = roboxPostCompile(code);

    return(codeArray);
}

function roboxCompileDebug(testcode)
{
    var code;
    if(testcode) {
	code = testcode;
    } else {
	code = Blockly.RXP.workspaceToCode(workspace);
    }

    alert(code);
}

function roboxGetName()
{
    var rcl = new RCLMessage();
    rcl.GetName();
    rcl.Transmit();
}
    
    

//
// roboxPostCompile() - given "compiled code" convert the integer-indication
//                      to real-live integers, and all of the single chars
//                      to real-live integers, too.
//
function roboxPostCompile(code)
{
    var returnCode = [];
    var length = code.length;

    // incoming code is a string, so, dissect it

    var skipping = false;
    for(var i=0; i < length; i++) {
	if(skipping) {
	    if(code[i] == "]") {
		skipping = false;
	    }
	} else {
	    if(code[i] == "[") {
		returnCode.push(parseInt(code.substring(i+1)));
		skipping = true;
	    } else if(code[i] != " ") {              // punt all spaces in string
		returnCode.push(code.charCodeAt(i));
	    }
	}
    }
    return(returnCode);
}

//
// roboxFindStart() - given a string of what should be code, see which one(s) has
//                    the start token. Complain if there isn't only one. Return
//                    one of them in any case.
//
function roboxFindStart(code)
{
    var lines = code.split("\n");
    var foundStart = -1;

    for(var i=0; i < lines.length; i++) {
	if(lines[i][0] == "S") {
	    if(foundStart != -1) {
		alert("You have more that one START block!\nI'll use the first one.\nBut you should really fix that!");
	    } else {
		foundStart = i;
	    }
	}
    }

    if(foundStart == -1) {
	alert("You don't have a START block!\nHow do I know where to start?\nI'll make a guess.");
	foundStart = 0;
	lines[foundStart] = "S" + lines[foundStart];
    }

    return(lines[foundStart]);
}

//
// roboxSensorReport() - initiate a sensor report.
//
function roboxSensorReport()
{
    var rcl = new RCLMessage();

    rcl.Ultrasonic();
    rcl.LineFollow();
    rcl.Transmit();
}

// The following functions should run upon page load

document.addEventListener('DOMContentLoaded',
  function() {
      roboxGetName();
      roboxStatus();
  }
);


//setInterval(roboxStatus,5000);
