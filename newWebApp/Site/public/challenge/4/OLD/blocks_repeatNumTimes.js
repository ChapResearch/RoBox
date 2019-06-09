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
