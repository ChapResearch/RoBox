Blockly.Blocks['make_variable'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Variable (number) Name:")
	    .appendField(new Blockly.FieldTextInput("variable1"), "name")
	    .appendField("=");
	this.appendValueInput("values")
	    .setCheck("Number")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "value");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(180);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['make_variable'] = function(block) {
    var out = "";

    out += "V[";
    out += block.getFieldValue('name');
    out += "]";

    out += "[";
    out += block.getFieldValue('value');
    out += "]";
    
    return(out);
};
