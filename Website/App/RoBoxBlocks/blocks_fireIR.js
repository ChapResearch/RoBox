Blockly.Blocks['fire_ir'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Fire Lazer");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['fire_ir'] = function(block) {
    var out = "";

    out += "F[2][50]";
      
    return(out);
};
