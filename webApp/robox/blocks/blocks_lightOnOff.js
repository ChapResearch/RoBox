Blockly.Blocks['light_on'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("LEDs ")
	    .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"]]), "set")
	    .appendField(new Blockly.FieldDropdown([
		["On","1"],
		["Off","0"],
		["Toggle","2"],
		["Blink","4"],
	    ]), "onOff");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(120);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};
  
Blockly.Blocks['light_off'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("LEDs ")
	    .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"]]), "set")
	    .appendField(new Blockly.FieldDropdown([
		["Off","0"],
		["On","1"],
		["Toggle","2"],
		["Blink","4"],
	    ]), "onOff");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(120);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['light_on'] = function(block) {
    var out = "";

    out += "L[";
    out += block.getFieldValue('set');
    out += "][";
    out += block.getFieldValue('onOff');
    out += "]";
      
    return(out);
};

Blockly.RXP['light_off'] = Blockly.RXP['light_on'];
