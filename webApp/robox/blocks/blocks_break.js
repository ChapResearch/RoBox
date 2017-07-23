Blockly.Blocks['break'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Break")
	    .appendField(new Blockly.FieldNumber(0, 1, 10, 1), "numLoops");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(0);
	this.setTooltip('');
	this.setHelpUrl('');
    }
}

Blockly.RXP['break'] = function(block) {
    var out = "";

    out += "K[";
    out += block.getFieldValue('numLoops');
    out += "]";
      
    return(out);
};
