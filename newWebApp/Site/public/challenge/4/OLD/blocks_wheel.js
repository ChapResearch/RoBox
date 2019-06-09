Blockly.Blocks['wheel_left'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Wheel")
	    .appendField(new Blockly.FieldDropdown([["Left","Left"], ["Right","Right"]]), "wlr");
	this.appendDummyInput()
	    .appendField("Time (ds)")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "Power");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(315);
	this.setTooltip('Move a wheel');
	this.setHelpUrl('');
    }
};
Blockly.Blocks['wheel_right'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Wheel")
	    .appendField(new Blockly.FieldDropdown([["Right","Right"], ["Left","Left"]]), "wlr");
	this.appendDummyInput()
	    .appendField("Time (ds)")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "Power");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(315);
	this.setTooltip('Move a wheel');
	this.setHelpUrl('');
    }
};
