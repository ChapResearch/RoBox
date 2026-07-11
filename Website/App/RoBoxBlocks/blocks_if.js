Blockly.Blocks['if'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("If")
	    .appendField(new Blockly.FieldDropdown([["Ultrasonic","101"],
						    ["Light","102"],
						    ["IR","103"],
						    ["A","104"],
						    ["B","105"],
						    ["C","106"]]), "sensor")
	    .appendField(new Blockly.FieldDropdown([["=","="],
						    ["<","<"],
						    [">",">"],
						    ["<>","!"],
						    [">=","G"],
						    ["<=","L"]]), "comparison")
	    .appendField(new Blockly.FieldNumber(0,0,100), "value");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.Blocks['if_ultrasonic']=Blockly.Blocks['if'];

Blockly.Blocks['if_light'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("If")
	    .appendField(new Blockly.FieldDropdown([["Light","102"],
                ["Ultrasonic","101"],
						    ["IR","103"],
						    ["A","104"],
						    ["B","105"],
						    ["C","106"]]), "sensor")
	    .appendField(new Blockly.FieldDropdown([["=","="],
						    ["<","<"],
						    [">",">"],
						    ["<>","!"],
						    [">=","G"],
						    ["<=","L"]]), "comparison")
	    .appendField(new Blockly.FieldNumber(0,0,100), "value");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.Blocks['if_IR'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("If")
	    .appendField(new Blockly.FieldDropdown([["IR","103"],
                ["Light","102"],
                ["Ultrasonic","101"],
						    ["A","104"],
						    ["B","105"],
						    ["C","106"]]), "sensor")
	    .appendField(new Blockly.FieldDropdown([["=","="],
						    ["<","<"],
						    [">",">"],
						    ["<>","!"],
						    [">=","G"],
						    ["<=","L"]]), "comparison")
	    .appendField(new Blockly.FieldNumber(0,0,100), "value");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.Blocks['if_variable'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("If")
	    .appendField(new Blockly.FieldDropdown([
                ["A","104"],
                ["B","105"],
                ["C","106"],
                ["IR","103"],
                ["Light","102"],
                ["Ultrasonic","101"]]), "sensor")
	    .appendField(new Blockly.FieldDropdown([["=","="],
						    ["<","<"],
						    [">",">"],
						    ["<>","!"],
						    [">=","G"],
						    ["<=","L"]]), "comparison")
	    .appendField(new Blockly.FieldNumber(0,0,100), "value");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP.forBlock['if'] = function(block) {
    var out = "";
    var sense = block.getFieldValue('sensor');
    var val = block.getFieldValue('value');

    if(sense==101 && val<3)
	val = 3;

    out += "I[";
    out += sense;
    out += "]";

    out += block.getFieldValue('comparison');

    out += "[";
    out += val;
    out += "](";

    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};

Blockly.RXP.forBlock['if_ultrasonic'] = Blockly.RXP.forBlock['if'];
Blockly.RXP.forBlock['if_light'] = Blockly.RXP.forBlock['if'];
Blockly.RXP.forBlock['if_IR'] = Blockly.RXP.forBlock['if'];
Blockly.RXP.forBlock['if_variable'] = Blockly.RXP.forBlock['if'];
