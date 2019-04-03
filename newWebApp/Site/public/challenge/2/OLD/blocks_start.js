Blockly.BlockSvg.START_HAT = true;

Blockly.Blocks['start'] = {
    init: function() {
	this.appendDummyInput()
	    .setAlign(Blockly.ALIGN_CENTRE)
	    .appendField("START");
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['start'] = function(block) {
    return("S");
};
