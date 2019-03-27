Blockly.BlockSvg.START_HAT = true;

Blockly.Blocks['def_method_c'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Method C");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setColour(65);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['def_method_c'] = function(block) {
    var out = "";
    
    out += "mC"
    out += "(";
    
    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
