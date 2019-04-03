Blockly.Blocks['wait'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Wait")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "powerR");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(30);
	this.setTooltip('Wait');
	this.setHelpUrl('');
    }
};
