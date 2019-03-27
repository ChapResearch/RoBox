Blockly.Blocks['run_method_c'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Method C");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(65);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['run_method_c'] = function(block) {
    return("MC");
};
