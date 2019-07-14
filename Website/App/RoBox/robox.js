//
// robox.js
//
//   Interface functions to the robox backend.
//

document.addEventListener('DOMContentLoaded',
			  function() {
			      roboxInit();
			  });

var RoBoxBrain = new BLE();

//
// roboxInit() - initialize anything that needs to be initialized for RoBox.
//
function roboxInit()
{
    roboxAppControlInit(location.search);
    
    RoBoxBrain.connectionMonitor(roboxConnectionMonitor);
}

function roboxRun()
{
    var roboxCode = roboxCompile();

    var rcl = new RCLMessage();       // send the program
    rcl.Program(roboxCode);           // send the program
    rcl.Run();                        // and start the run
    rcl.Transmit(RoBoxBrain);

    RoBoxEvents.dispatch("onRun");
}

function roboxStop(resultsFn)
{
    var rcl = new RCLMessage();
    rcl.Stop();
    rcl.Transmit(RoBoxBrain);
}

function roboxScan(resultFn) {
//    chrome.runtime.sendMessage(chromeAppID,{ command: "scan" },resultFn);
}

function roboxDisConnect(resultsFn)
{
    RoBoxBrain.server.disconnect();
}

//
// roboxConnect() - Starts the BLE connection process
//
function roboxConnect()
{
    RoBoxBrain.connect(console.log);
}

//
// roboxConnectionMonitor() - called when the connection comes up/down.
//
function roboxConnectionMonitor(connection)
{
    if(connection) {
	RoBoxEvents.dispatch("onConnect");
	$('#ConnectButton').hide();
	$('#DisconnectButton').show();
	$('#robox-name').text(RoBoxBrain.device.name);
    } else {
	RoBoxEvents.dispatch("onDisconnect");
	$('#ConnectButton').show();
	$('#DisconnectButton').hide();
	$('#robox-name').text("");
    }
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
	html += 'src="media/roboxIcon128.png"/>';
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
	rcl.Transmit(RoBoxBrain);
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

    // at this point, the code may contain multiple lines,
    // with each indicating a string of code.  We run the
    // one with an "S" at the start.  We complain if there
    // are more than one with an "S".

    if(roboxFindStart(code)){
	var codeArray = roboxPostCompile(code);
	return(codeArray);
    }

    return [];
}

function roboxCompileDebug(testcode)
{

    var code;
    if(testcode) {
	console.log(testcode);
	code = testcode;
    } else {
	code = Blockly.RXP.workspaceToCode(workspace);
    }

    var newcode = roboxPostCompile(code);

    alert(newcode);
}

function roboxGetName()
{
    var rcl = new RCLMessage();
    rcl.GetName();
    rcl.Transmit(RoBoxBrain);
}
    
    

//
// roboxPostCompile() - given "compiled code" convert the integer-indication
//                      to real-live integers, and all of the single chars
//                      to real-live integers, too.
//
function roboxPostCompile(code)
{

    console.log("Before Compile:\n" + code)
    var returnCode = [];
    var length = code.length;

    //Parse the string and put () around Start lines
    var lines = code.split("\n");
    var foundStart = -1;

    for(var i=0; i < lines.length; i++) {
	if(lines[i][0] == "S") {
	    foundStart = i;
	}
    }
    //lines[foundStart] = lines[foundStart].chartAt[0] + "(" + lines[foundStart].substring(1,lines[foundStart].length) + ")";
    
    //reorder the lines so that start is last
    var temp = lines[foundStart];
    lines[foundStart] = lines[lines.length-1];
    lines[lines.length-1] = temp;


    // DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
    console.log("Ordered:\n------");
    for(var i=0;i<lines.length;i++){
	console.log(lines[i]);
    }
    console.log("------");
    
    //combine all the lines into 1 string without new lines
    var editedCode = "";
    for(var i=0; i < lines.length; i++) {
	if (lines[i].charAt(0)=='S' || lines[i].charAt(0)=='m')
	    editedCode = editedCode + lines[i];
    }
    
    // incoming code is a string, so, change to ints
    var skipping = false;
    for(var i=0; i < editedCode.length; i++) {
	if(skipping) {
	    if(editedCode[i] == "]") {
		skipping = false;
	    }
	} else {
	    if(editedCode[i] == "[") {
		returnCode.push(parseInt(editedCode.substring(i+1)));
		skipping = true;
	    } else if(editedCode[i] != " ") {              // punt all spaces in string
		returnCode.push(editedCode.charCodeAt(i));
	    }
	}
    }
    console.log("After Compile:\n" + editedCode);
    return(returnCode);
}

//
// roboxFindStart() - given a string of what should be code, see which one(s) has
//                    the start token. Complain if there isn't only one.
//
function roboxFindStart(code)
{
    var lines = code.split("\n");
    var foundStart = -1;

    for(var i=0; i < lines.length; i++) {
	if(lines[i][0] == "S") {
	    if(foundStart != -1) {
		alert("You have more than one START block!\nI can't run.");
		return false;
	    } else {
		foundStart = i;
	    }
	}
    }

    if(foundStart == -1) {
	alert("You don't have a START block!\n I can't run.");
	return false;
    }

    return true;
}

//
// roboxSensorReport() - initiate a sensor report.
//
function roboxSensorReport()
{
    var rcl = new RCLMessage();

    rcl.Ultrasonic();
    rcl.LineFollow();
    rcl.Transmit(RoBoxBrain);
}
