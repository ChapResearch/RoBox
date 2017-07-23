//
// roboxevents.js
//
//   Defines the events object that serves as the dispatch point
//   for all incoming robox events like program stop, disconnect, etc.
//

function RoBoxEvents()
{
    this.events = [];
}

RoBoxEvents.prototype.addListener = function(eventName,fn)
{
    this.events.push({name:eventName,fn:fn});
}

RoBoxEvents.prototype.dispatch = function(eventName,rock)
{
    for(var i=0; i < this.events.length; i++) {
	if(this.events[i].name == eventName) {
	    this.events[i].fn(rock);
	}
    }
}

RoBoxEvents = new RoBoxEvents();
