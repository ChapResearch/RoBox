//
// roboxAppControl.js
//
//   Controls for the overall app (switch between sub apps for example)
//

function roboxAppControlInit(searchString)
{
    gamepadInit();
    battleInit();
    challengeInit();
    testingInit();
    drivingInit();
    
    var page = roboxAppControlValidatePage(searchString);

    // page is set to either an int, or a string
    //   int means start challenge mode, string means one of the other modes

    roboxAppControlLoad(page);

    // attach the selector listeners

    $('#topDivSelector td').click(function() {
	roboxAppSwitch($(this).data('type'));
    });
}
    
//
// roboxAppControlValidatePage() - validate the given URL searchString to get the requested
//                                 page.  Either a valid page string is returned, or an integer
//                                 representing the index into the challenges[] array. If no
//                                 page was given, then the first challenge is returned.
//
function roboxAppControlValidatePage(searchString)
{
    var page = null;

    // get the specified page, if any
    
    if(searchString && searchString.length > 1) {
	var params = parseQuery(searchString);
	if(params.hasOwnProperty('page')) {
	    page = params.page;
	}
    }

    // page is either 'null' or something, but that something may not be right...
    //   so decode the page and init appropraitely
    
    switch(page) {

	// for any of these cases, the page is valid

    case "testing":
    case "driving":
    case "competition":
	return(page);

	// the default case handles both null and a challenge specified in URL

    default:
	index = 0;
	if(page) {
	    var index = challenges.indexOf(page);
	    if(index < 0) {
		index = 0;
	    }
	}
	return(index);
    }
}

//
// roboxSelector() - sets the mode selector to the given display value.
//
function roboxSelector(mode)
{
    var selector = $('#topDivSelector');
    
    selector.find('td').removeClass('selected');
    
    switch(mode) {
    case 'challenge':	selector.find('td.selectorChallenges').addClass('selected'); break;
    case 'testing':	selector.find('td.selectorTesting').addClass('selected'); break;
    case 'driving':     selector.find('td.selectorDriving').addClass('selected'); break;
    case 'competition':	selector.find('td.selectorDriving').addClass('selected'); break;
    }
}

//
// roboxAppSwitch() - switches to the given app mode.
//
function roboxAppSwitch(mode)
{
    challengeOff();
    testingOff();
    drivingOff();
    battleOff();
    
    switch(mode) {
    case 'challenge':	challengeOn(); break;
    case 'testing':	testingOn(); break;
    case 'driving':     drivingOn(); battleOn(); break;
    case 'competition':	drivingOn(); battleOn(); break;
    }

    roboxSelector(mode);
}


//
// roboxAppControlLoad() - given either "testing","driving","competition", or a valid challenge
//                         index, load the appropriate stuff to do it.
//

function roboxAppControlLoad(page)
{
    if((typeof page) == 'number') {
	challengeSetCurrent(page);
	roboxAppSwitch('challenge');
    } else {
	roboxAppSwitch(page);
    }
}
	    
	
//
// parseQuery() - turn the given querystring into an object with properties for each search variable
//                (from stackoverflow https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript)
    
function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}
