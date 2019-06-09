src="https://code.jquery.com/jquery-3.3.1.min.js"
integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
crossorigin="anonymous"

$( document ).ready(function(){
    onLoad(1);
});

function onLoad(challengeNumber){
    console.log("we are inside onLoad");
    loadChallenges();
    var challengeNum = challengeNumber;
}


function loadChallenges(){

    console.log("we are inside loadChallenges");
    var loadedChallenges = [];
    var numFile = $.get('numChallenges.txt', "text");
    var numChallenges = parseInt(numFile,10);

    for(i=1;i<numChallenges+1;i++)
    {
	var challenge = {};
	challenge.number = $.get('/' + i + '/number.txt', "text");
	challenge.name =   $.get('/' + i + '/name.txt', "text");
	challenge.help =   $.get('/' + i + '/help.html', "text");
	challenge.blocks = $.get('/' + i + '/number.txt', "text");
	loadedChallenges.push(challenge);
    }
    return;
	
}


function changeChallenge(newChallange){

    $("#robox-explain-text").empty();
    $("#robox-explain-content").append(newChallenge.number);    
    return;
}

function nextChallenge(){

    var nextChallenge = loadedChallenges[challengeNum + 1];
    changeChallenge(nextChallenge);
    return;
}
