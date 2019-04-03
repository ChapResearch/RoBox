Blockly.Blocks['Repeat Until'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Repeat Until")
	    .appendField(new Blockly.FieldDropdown([["Ultrasonic","ultrasonic"], ["Light","light"], ["IR","ir"]]), "NAME")
	    .appendField(new Blockly.FieldDropdown([["=","equals"], ["<","lessthan"], [">","greaterthan"]]), "NAME")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "value");
	this.appendStatementInput("NAME")
	    .setCheck(null);
	this.setColour(0);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};
