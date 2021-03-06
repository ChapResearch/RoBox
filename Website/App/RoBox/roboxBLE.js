//
// roboxBLE.js
//
//   Interface to the Romeo board through Web BLE.
//   Much of this code was lifted-from/inspired-by the NASA scouting app
//

//const BLEService =  '0000dfb0-0000-1000-8000-00805f9b34fb';
//const BLEServiceAbbr = 0xdfb0;
//const BLECharSend = '0000dfb1-0000-1000-8000-00805f9b34fb';
//const BLECharSendAbbr = 0xdfb1;
//const BLECharCmd =  '0000dfb2-0000-1000-8000-00805f9b34fb';

const BLEService =  '0000ffe0-0000-1000-8000-00805f9b34fb';
const BLECharSend = '0000ffe1-0000-1000-8000-00805f9b34fb';


//
// BLE OBJECT
//   The interface to the BLE controller board is implemented as an object.
//

function BLE()
{
    this.connectedStatus = false;       // get/set through this.connected - defined below
    
    this.service = BLEService;

    // the filters object used when connecting to bluetooth
    //    this.filters = [{ services: [this.service], name: this.name }];
    this.filters = [{services: [BLEService]}];

//    if(name) {
//	this.filters[0].name = name;
//    }

    // the device we're connecting to
    this.device = null;
    
    // the gatt server - this is only valid if connected
    this.server = null;

    // the primary service
    this.serviceObj = null;
    
    // connection monitoring function - it would be "nice" if the web bluetooth
    //   had a "connection" event, as well as the disconnect event. But since
    //   it doesn't, we need to fire the connection event ourselves. This is
    //   done by watching the "connected" variable.
    
    this.connectionMonitorFN = null;

    this.disconnectFN = this._disconnect.bind(this);

    this.transmissionPromise = null;     // the promise chain that transmits packets
}

Object.defineProperties(BLE.prototype, {
    connected: { set: function(a) {
	                 if(a) {
			     this.connectedStatus = true;
			 } else {
			     this.connectedStatus = false;
			 }
	                 if(this.connectionMonitorFN) {
			     this.connectionMonitorFN(a);
			 }},
		 get: function() { return(this.connectedStatus); }},
});

//
// incoming() - process incoming BLE message
//
BLE.prototype.incoming = function(event)
{
    var packet = new Uint8Array(event.target.value.buffer);

    console.log("incoming data");
    console.log(packet);
    
    RCL_Incoming(packet);
}

//
// _disconnect() - this routine is attached to the bluetooth interface to be called
//                 when the connection drops.
//
BLE.prototype._disconnect = function()
{
    if(this.connected) {
	this.device.removeEventListener('gattserverdisconnected',this.disconnectFN);
	this.connected = false;
    }
}

//
// connect() - connects to a RoBox out there.
//
BLE.prototype.connect = function(reportFN)
{
    var BLEObj = this;
    
    reportFN("contact");

    console.log(BLEObj.filters);

    // kick-off the connection process by getting the BLE device and connecting to the device
    //  that the user specified in the pop-up. The disconnect listener is attached upon
    //  the filters, imply specify the service UUID - no names - it doesn't work right in the API yet

//    navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: [ BLEService ]})
    navigator.bluetooth.requestDevice({ filters: BLEObj.filters })
	.then(device => {
	    device.addEventListener('gattserverdisconnected',BLEObj.disconnectFN);
	    BLEObj.device = device;
	    return(BLEObj.device.gatt.connect());
	})

    // if we get BLEObj far, then we have a connection, so get the primary service for it
    
	.then(server => {
	    BLEObj.server = server;
	    console.log("connected - getting primary service - first try");
	    return(server.getPrimaryService(BLEService));
	})

        .catch(error => {
	    return(BLEObj.device.gatt.connect()
		   .then(server => {
		       BLEObj.server = server;
		       console.log("connected - getting primary service - second try");
		       return(server.getPrimaryService(BLEService));
		   }))})

    // first get the contoller name, so any errors may be figured out - particularly
    //   if the controller name wasn't available
    
	.then(service => {
	    BLEObj.serviceObj = service;
	    reportFN("contact-done");
	})

    // then set-up notifications

    	.then(() => {
	    console.log("setting up notifications");
	    return(BLEObj.serviceObj.getCharacteristic(BLECharSend));
	})
	.then((char) => {
	    console.log("here we go");
	    return(char.startNotifications());
	})
    	.then((char) => {
	    console.log("OK - setting up listener");
	    char.addEventListener('characteristicvaluechanged', (event) => {
		BLEObj.incoming(event);
	    });
	})
	.then(() => {
	    BLEObj.connected = true;
	    // DEBUG DEBUG DEBUG - nice way to indicate connection
	    // var rcl = new RCLMessage();
	    // rcl.LED(1,1);
	    // rcl.Transmit(BLEObj);
	})

	.catch(error => {

	    console.log('"' + error +'"');
	    switch(error.toString()) {
	    case 'NotSupportedError: GATT operation not permitted.':
	    case 'DOMException: GATT operation not permitted.':
		error = 'slot-fail';
		reportFN("slot-fail");
		break;
	    case 'DOMException: User cancelled the requestDevice() chooser.':
	    case 'NotFoundError: User cancelled the requestDevice() chooser.':
		error = "contact-fail";
		break;
	    case 'Error: password-fail':
		error = 'password-fail';
		break;
	    }

	    reportFN(error);
 	    BLEObj.connected = false;
	});
}

//
// transmit() - send the data out to the RoBox. This routine will fragmentize into smaller
//              chunks if necessary.  If other transmit's have occurred, then they stack
//              into the transmission buffer.
//
//     TODO - this COULD return a promise, or have a callback upon transmission completion,
//            which could be used by a GUI with the result of the transmission (with a .then() or .catch()).
//            It will be pretty tough, however, because of multiple transmisions.
//
BLE.prototype.transmit = function(data)
{
    var CHUNKSIZE = 20;
    var uuid = BLECharSend;

    if(this.connected) {

	var chunks = [];
	var chunkCount = Math.floor(data.length / CHUNKSIZE);    // count of full chunks
	if(data.length % CHUNKSIZE != 0) {
	    chunkCount++;                                        // have a final non-full chunk
	}

	for(var i=0; i < chunkCount; i++) {
	    chunks.push(data.slice(i*CHUNKSIZE,(i+1)*CHUNKSIZE));
	}

	// for ease of use below, go ahead and package up the individual messages
	
	var messages = [];
	for(var i=0; i < chunkCount; i++) {
	    messages[i] = new Uint8Array(chunks[i].length);
	    messages[i].set(chunks[i],0);
	}
	
	if(this.transmissionPromise === null) {
	    this.transmissionPromise = this.serviceObj.getCharacteristic(uuid);
	}

	// note that the chunks are added as "then" before this thread relinquishes
	//   so that the getCharacteristic() can't return before the chunk thens are added

	var transmitDelay = 200;           // delay between chunk transmission

	var BLEObj = this;

	// this confusing chunk of code causes the array of messages to be turned into a
	//  string of promise-then's which have, for each message:
	//
	//    - { writeValue() with return of characteristic }
	//    - delay of "transmitDelay" ms
	//
	// Each message then's are appended to the previous.

	messages.forEach(function(message) {
	    BLEObj.transmissionPromise =
		BLEObj.transmissionPromise
		.then(function(characteristic) {
		    console.log("-----prior to transmit----");
		    console.log(message);
		    return(characteristic.writeValue(message).then(()=>characteristic));})
		.then((characteristic) => new Promise( resolve => setTimeout(()=>resolve(characteristic),transmitDelay)));
	});
    }
}

//
// connectionMonitor() - used to specify a callback that is called whenever
//                       the connection is made/lost.
//
BLE.prototype.connectionMonitor = function(fn)
{
    this.connectionMonitorFN = fn;
}
