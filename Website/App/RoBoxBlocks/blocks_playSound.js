Blockly.Blocks['play_sound'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Beep at")
	    .appendField(new Blockly.FieldDropdown([["Low","50"], ["Medium","67"],["High","83"]]), "frequency")
	    .appendField("Hz for")
	    .appendField(new Blockly.FieldNumber(0), "time")
	    .appendField("seconds");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(120);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['play_sound'] = function(block) {
    var out = "";
    var time = block.getFieldValue('time')*10;

    out += "B[";
    out += block.getFieldValue('frequency');
    out += "][";
    out += time;
    out += "]";
      
    return(out);
};
