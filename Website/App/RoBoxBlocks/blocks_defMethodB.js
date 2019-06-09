Blockly.BlockSvg.START_HAT = true;

Blockly.Blocks['def_method_b'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Method B ");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setColour(65);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['def_method_b'] = function(block) {
    var out = "";
    
    out += "mB"
    out += "(";
    
    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
