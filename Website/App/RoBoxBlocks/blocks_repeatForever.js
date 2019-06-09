Blockly.Blocks['repeat_forever'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Repeat Forever");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(15);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['repeat_forever'] = function(block) {
    var out = "";

    out += "RT[0](";
      
    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
