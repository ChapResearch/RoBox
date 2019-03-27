Blockly.Blocks['run_method_b'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Method B");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(65);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['run_method_b'] = function(block) {
    return("MB");
};
