Blockly.Blocks['repeat_until'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Repeat Until")
	    .appendField(new Blockly.FieldDropdown([["Ultrasonic","101"], ["Light","102"], ["IR","103"], ["A","104"], ["B","105"], ["C","106"]]), "sensor")
	    .appendField(new Blockly.FieldDropdown([["=","="],
						    ["<","<"],
						    [">",">"],
						    ["<>","!"],
						    [">=","G"],
						    ["<=","L"]]), "comparison")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "value");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(0);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['repeat_until'] = function(block) {
    var out = "";

    out += "RU[";
    out += block.getFieldValue('sensor');
    out += "]";

    out += block.getFieldValue('comparison');

    out += "[";
    out += block.getFieldValue('value');
    out += "](";
    
    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
