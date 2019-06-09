//
// rcl.js
//
//   Implements RCL communication with the RoBox.  This used to go
//   through the helper app, but this current version uses Web BLE.
//

//
// RCLMessage() - this object is used to compose and transmit
//                RCL messages.  The generate procedure is:
//                1) create an RCLMessage instance
//                2) add messages to it
//                3) transmit
//
function RCLMessage()
{
    this.messages = [];
}

RCLMessage.prototype.AppendMessage = function(cmd,data)
{
    this.messages.push({cmd:cmd,length:data.length,data:data});
}

RCLMessage.prototype.Motor = function(motor,power)
{
    this.AppendMessage('M',[motor.charCodeAt(0),power]);
}

RCLMessage.prototype.LED = function(num,op)
{
    this.AppendMessage('E',[num,op]);
}

RCLMessage.prototype.Ultrasonic = function()
{
    this.AppendMessage('U',[]);
}


RCLMessage.prototype.LineFollow = function()
{
    this.AppendMessage('L',[]);
}

RCLMessage.prototype.PlaySound = function(freq,dur)
{
    this.AppendMessage('T',[freq,dur]);
}

RCLMessage.prototype.Blast = function(count,power)
{
    this.AppendMessage('B',[count,power]);
}

RCLMessage.prototype.Program = function(program)
{
    this.AppendMessage('P',program);
}

RCLMessage.prototype.Run = function()
{
    this.AppendMessage('R',[]);
}

RCLMessage.prototype.Stop = function()
{
    this.AppendMessage('S',[]);
}

RCLMessage.prototype.GetName = function()
{
    this.AppendMessage('G',[]);
    return(this);
}

RCLMessage.prototype.SetName = function(name)
{
    this.AppendMessage('N',name);
    return(this);
}

RCLMessage.prototype.Empty = function()
{
    return(this.messages.length == 0);
}

RCLMessage.prototype.Transmit = function(BLEObject)
{
    if(this.messages.length) {

	// the OLD way of doing this...the message(s) were sent to the helper app
	//
	//     msgAppPort.postMessage(this.messages);    

	var data = this.TransmitEncode();
	return BLEObject.transmit(data);   // returns a promise
    }
}

//
// TransmitEncode() - takes all messages and encodes them for over-the-wire
//                    BLE transmission.  This function used to live in the
//                    helper app.
//
RCLMessage.prototype.TransmitEncode = function()
{
    // the format of the messages coming in is an array of individual objects
    //   comprised of cmd (string),length (int),data (int array)

    console.log("got %d commands",this.messages.length);

    // first, precompute the Uint8Array size that we need

    var totalLength = 0;
    for(var i=0; i < this.messages.length; i++) {
	totalLength += 2;     // for cmd and length
	totalLength += this.messages[i].length;
    }

    var data = new Uint8Array(totalLength);

    var ptr = 0;
    for(var i=0; i < this.messages.length; i++) {
	console.log("got a %s with length %d (%d)",this.messages[i].cmd,this.messages[i].length,this.messages[i].data.length);

	var cmd = this.messages[i].cmd.charCodeAt(0);
	var length = this.messages[i].length;

	cmd = ((cmd & 0x3f) << 2) | ((length >> 8) & 0x03);
	length = length & 0xff;

	data[ptr++] = cmd;
	data[ptr++] = length;

	for(var j=0; j < this.messages[i].length; j++) {
	    var datum = this.messages[i].data[j];
	    if(typeof datum === 'string') {
		data[ptr++] = datum.charCodeAt(0);
	    } else {
		data[ptr++] = datum;          // this automatically deals with negative numbers
	    }                                 //  translating negative ints to bytes (like -1 to 255)
            //  but lets large ints through (like 255 to 255)
	}
    }

    return(data);
}    

//
// RCL_Incoming() - An incoming message is always in RCL, although the format of the message
//                  must be appropriately translated.  It is possible that the message from
//                  the RoBox will be a multi-packet message (like a program upload) and it
//                  needs to be assimilated before dispatching. There is a command, and some data. 
//
//                  Input into this function is a Uint8Array of raw data that supposedly adheres
//                  to RCL, unless, of course, it is a continuation of a data stream.
//
//    TODO: this routine has been updated to (1) allow multiple incoming packets to be
//          consumed "appropriately" by waiting for the right amount of data, and (2) allowing
//          multiple commands in a single packet to be split appropriately.  HOWEVER, little
//          testing has been done on this!
//
//    As data comes in, it adds to the data that is currently the RCL processing
//    buffer. Dispatching occurs whenever there is enough RCL data to satisfy
//    an incoming RCL command.
//
//    Note that we don't worry much about the size of the buffer, we just let it
//    grow as needed.
//
//    NOTE - this routine was taken nearly verbatim from the original Chrome app.

RCL_IncomingBuffer = new Uint8Array(0);

function RCL_Incoming(packet)
{
    // first, put the incoming data in the buffer of incoming data

    console.log("RCL_Incoming - length is " + packet.length);
    
    var c = new Uint8Array(RCL_IncomingBuffer.length+packet.length);
    c.set(RCL_IncomingBuffer);
    c.set(packet,RCL_IncomingBuffer.length)
    RCL_IncomingBuffer = c;

    // now, start dispatching commands until out of data, but only
    //  if a complete command has been received.

    while(RCL_IncomingBuffer.length >= 2) {

	var cmd = ((RCL_IncomingBuffer[0]>>2) & 0x3f) | 0x40;
	var payloadLength = ((RCL_IncomingBuffer[0]&0x03)<<8) | (RCL_IncomingBuffer[1] & 0xff);

	if(RCL_IncomingBuffer.length - 2 >= payloadLength) {
	    RCL_PostToGUI({ cmd: cmd,
			    length: payloadLength,
			    data: RCL_IncomingBuffer.slice(2,payloadLength+3) });
	} else {
	    // need more data
	    break;
	}

	RCL_IncomingBuffer = RCL_IncomingBuffer.slice(payloadLength+2);
    }
}

//
// RCL_PostToGUI() - given a message from the RoBox, send it up to the GUI.
//                   Just a little translation done, not much.  The .cmd is
//                   translated to a string for easy switch/casing, and the
//                   data is turned in to an int array with appropriate
//                   positive/negative translation.
//
function RCL_PostToGUI(msg)
{
    var cmd = String.fromCharCode(msg.cmd);
    var length = msg.length;
    var data = [];

    // the following "trick" for javascript converts the unsigned byte back
    // to a signed int. Taken from:
    // http://blog.vjeux.com/2013/javascript/conversion-from-uint8-to-int8-x-24.html

    for(var i=0; i < length; i++) {
	data[i] = msg.data[i] << 24 >> 24;
    }

    RCL_CMDProcess({cmd: cmd, length: length, data: data});
}

//
// RCL_CMDProcess() - Processes all current RCL incoming commands and
//                  updates the display appropriately.  The current
//                  commands are:
//
//     L - line follow report
//     U - ultrasonic report
//     I - IR hit (includes ID of hitter)
//     S - stop occurred (either naturally or due to stop request)
//     G - incoming name report
//     X - connection dropped (either due to request or otherwise)
//     V - firmware version report
//
//   (This used to be RCL_Incoming() when the Chrome app was being used)

function RCL_CMDProcess(msg)
{
    console.log("RCL incoming: %s",msg.cmd);

    switch(msg.cmd) {

    case 'L':              // line follow reading
	RoBoxEvents.dispatch("onLineFollow",msg.data[0]);
	break;

    case 'U':              // ultra sonic reading
	RoBoxEvents.dispatch("onUltraSonic",msg.data[0]);
	break;
	
    case 'I':              // IR hit
	RoBoxEvents.dispatch("onIRHit",[msg.data[0],msg.data[1]]);
	break;
	
    case 'S':             // Program has stopped
	RoBoxEvents.dispatch("onStop");
	break;

    case 'G':             // incoming name report
	var name = "";
	for(var i=0; i < msg.length; i++) {
	    name += String.fromCharCode(msg.data[i]);
	}
	
	RoBoxEvents.dispatch("onNameReport",name);
	break;

    case 'X':             // connection dropped
	RoBoxEvents.dispatch("onDisconnect");
	break;

    case 'C':             // connection established
	RoBoxEvents.dispatch("onConnect",msg.data);   // should be 6 bytes of MAC address
	break;

    case 'V':             // robox firmware version report
	RoBoxEvents.dispatch("onVersionReport",[msg.data[0],msg.data[1]]);  // major,minor number
	break;
    }
}
