Blockly.Blocks['else'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("else");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, "if");
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['else'] = function(block) {
    var out = "";

    out += "E";
    out += "(";

    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
