//
// roboxevents.js
//
//   Defines the events object that serves as the dispatch point
//   for all incoming robox events like program stop, disconnect, etc.
//

function RoBoxEvents()
{
    this.id = 1;
    this.events = [];
}

RoBoxEvents.prototype.addListener = function(eventName,fn)
{
    this.events.push({name:eventName,fn:fn,id:this.id});
    return(this.id++);
}

RoBoxEvents.prototype.removeListener = function(id)
{
    for(var i=0; i < this.events.length; i++) {
	if(this.events[i].id == id) {
	    this.events.splice(i,1);
	}
    }
}

// TODO - currently, a single rock is allowed, but it really should call with all args

RoBoxEvents.prototype.dispatch = function(eventName,rock)
{
//    console.log("dispatching " + eventName);
    
    for(var i=0; i < this.events.length; i++) {
	if(this.events[i].name == eventName) {
	    this.events[i].fn(rock);
	}
    }
}

RoBoxEvents = new RoBoxEvents();
