Blockly.Blocks['play_sound_variable'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Beep at")
	    .appendField(new Blockly.FieldDropdown([["A","104"], ["B","105"],["C","106"]]), "frequency")
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

Blockly.RXP['play_sound_variable'] = function(block) {
    var out = "";
    var time = block.getFieldValue('time')*10;

    out += "B[";
    out += block.getFieldValue('frequency');
    out += "][";
    out += time;
    out += "]";

    return(out);
};
