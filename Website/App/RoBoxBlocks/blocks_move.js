Blockly.Blocks['move_backward'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("move")
	    .appendField(new Blockly.FieldDropdown([["backward","dir_backward"],
						    ["forward","dir_forward"]]), "direction")
	    .appendField(new Blockly.FieldNumber(2, .1, 10, .1), "seconds")
	    .appendField("second(s)");
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
	    .appendField(new Blockly.FieldNumber(1, .1, 10,.1), "seconds")
	    .appendField("second(s)");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['move_backward'] = function(block) {
    var dir = block.getFieldValue('direction');
    var time = block.getFieldValue('seconds');

    var out = "";
    var power = 50;

    if(dir == "dir_backward") {
	power = -power;
    }

    out += "WL[" + power + "]";
    out += "WR[" + power + "]";
    out += "D[" + (time*10) + "]";

    return(out);
};

Blockly.RXP['move_forward'] = Blockly.RXP['move_backward'];
