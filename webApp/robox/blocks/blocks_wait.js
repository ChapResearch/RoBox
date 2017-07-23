Blockly.Blocks['wait'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Wait")
	    .appendField(new Blockly.FieldNumber(.1, .01, 10), "powerR")
	    .appendField("seconds");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(30);
	this.setTooltip('Wait');
	this.setHelpUrl('');
    }
};

Blockly.RXP['wait'] = function(block) {
    var time = block.getFieldValue("powerR");

    return("D[" + time*10 + "]");
}
