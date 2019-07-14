//
// roboxChallenge.js
//
//   code for the challenges portion of the app
//

// GLOBAL
challengeCurrentIndex = 0;           // by default, starts on the first challenge

//
// challengeInit() - initialize all challenge-oriented things
//
function challengeInit()
{
    challengeCurrentIndex = 0;           // by default, starts on the first challenge
    
    roboxBlocklyStart('blocklyDiv');
    roboxBlocklyChallengeLoad();       // loads Blockly but with an empty toolbox
}

//
// challengeSetCurrent() - sets the current challenge to the given index
//
function challengeSetCurrent(i)
{
    challengeCurrentIndex = i;
}

//
// challengeOn() - turns ON the challenge stuff
//                 NOTE - div visibiliity in roboxAppControl
//
function challengeOn()
{
    $('#blocklyDiv').show();

    var hasData = roboxLoad();

    roboxBlocklyChallengeLoad(challenges[challengeCurrentIndex]);
    roboxUIChallengeLoad(!hasData);

    $('#prevChallengeButton').show();
    $('#nextChallengeButton').show();

    $('#StopButton').show();
    $('#RunButton').show();
}

//
// challengeOff() - turns OFF the challenge pane.
//
function challengeOff()
{
    $('#blocklyDiv').hide();
    
    $('#prevChallengeButton').hide();
    $('#nextChallengeButton').hide();

    $('#StopButton').hide();
    $('#RunButton').hide();
    
}


//
// roboxUIChallengeLoad() - loads the challenge identified by the global index
//
function roboxUIChallengeLoad(doHelp)
{
    var id = challenges[challengeCurrentIndex];
    var type = challengeType[id];
    var name = challengeName[id];
    var help = atob(challengeHelp[id]);

    $('#topDivTitle .title').text(name);
    $('#topDivTitle .type').text(type);
    $('#topDivTitle .number').text(id);
    
    $('#robox-explain-content div').html(help);

    roboxNextPrevButtonLightUp();
    if(doHelp) {
	roboxExplain();
    }
}

function roboxNextPrevButtonLightUp()
{
    // NOTE - assumes that there is at least ONE challenge
    
    if(challengeCurrentIndex == 0) {
	$('#prevChallengeButton').addClass("lastone");
    } else {
	$('#prevChallengeButton').removeClass("lastone");
    }

    if(challengeCurrentIndex == challenges.length-1) {
	$('#nextChallengeButton').addClass("lastone");
    } else {
	$('#nextChallengeButton').removeClass("lastone");
    }
}
    
function roboxNextChallenge()
{
    if(challengeCurrentIndex !== challenges.length-1) {
	challengeCurrentIndex++;
	var next = challenges[challengeCurrentIndex];
	var hasData = roboxLoad();
	roboxBlocklyChallengeLoad(next);
	roboxUIChallengeLoad(!hasData);
    }
}

function roboxPrevChallenge()
{
    if(challengeCurrentIndex != 0) {
	challengeCurrentIndex--;
	var prev = challenges[challengeCurrentIndex];
	var hasData = roboxLoad();
	roboxBlocklyChallengeLoad(prev);
	roboxUIChallengeLoad(!hasData);
    }
}    


//
// The Save and Load functions for the blockly workspace
//
function roboxSave()
{
    var location = 'blockly.xml.' + challenges[challengeCurrentIndex];

    roboxBlocklySave(location);
}

//
// roboxLoad() - returns true if something was loaded, false otherwise
//
function roboxLoad()
{
    var location = 'blockly.xml.' + challenges[challengeCurrentIndex];

    return(roboxBlocklyLoad(location));
}
