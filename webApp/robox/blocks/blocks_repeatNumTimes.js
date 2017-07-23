Blockly.Blocks['repeat_number_times'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Repeat")
	    .appendField(new Blockly.FieldNumber(1, 1, 100), "repetitions")
	    .appendField("time(s)");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(0);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['repeat_number_times'] = function(block) {
    var out = "";

    out += "RT[";
    out += block.getFieldValue('repetitions');
    out += "](";
    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
