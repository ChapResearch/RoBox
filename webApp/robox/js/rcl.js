//
// rcl.js
//
//   Implements RCL communication with the RoBox (through
//   the help app of course).
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

console.log("defined RCLMessage");

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

RCLMessage.prototype.Transmit = function()
{
    if(this.messages.length) {
	msgAppPort.postMessage(this.messages);
    }
}

    
