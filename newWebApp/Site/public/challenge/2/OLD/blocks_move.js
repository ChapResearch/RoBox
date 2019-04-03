Blockly.Blocks['move_backward'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("move")
	    .appendField(new Blockly.FieldDropdown([["backward","dir_backward"],
						    ["forward","dir_forward"]]), "direction")
	    .appendField(new Blockly.FieldNumber(2, .1, 100, .1), "second(s)")
	    .appendField("seconds");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};
Blockly.Blocks['move_forward'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("move")
	    .appendField(new Blockly.FieldDropdown([["forward","dir_forward"],
						    ["backward","dir_backward"]]), "direction")
	    .appendField(new Blockly.FieldNumber(1, .1, 100,.1), "second(s)")
	    .appendField("seconds");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};
