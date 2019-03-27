Blockly.Blocks['run_method_a'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Method A");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(65);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['run_method_a'] = function(block) {
    return("MA");
};
