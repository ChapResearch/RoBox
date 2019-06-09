Blockly.Blocks['wheels'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Wheel Right")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "powerR");
	this.appendDummyInput()
	    .appendField("Left")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "powerL");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(315);
	this.setTooltip('Move Both Wheels a specific power. Negative is backwards.');
	this.setHelpUrl('');
    }
};
