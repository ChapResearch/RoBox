Blockly.BlockSvg.START_HAT = true;

Blockly.Blocks['def_method_a'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Method A");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setColour(65);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['def_method_a'] = function(block) {
    var out = "";
    
    out += "mA"
    out += "(";
    
    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
