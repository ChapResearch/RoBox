Blockly.Blocks['wheel_right'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Wheel")
	    .appendField(new Blockly.FieldDropdown([["Right","right"], ["Left","left"]]), "wheel")
	    .appendField("power")	
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "power");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(315);
	this.setTooltip('Move a wheel a certain power. Negative means backwards.');
	this.setHelpUrl('');
    }
};
Blockly.Blocks['wheel_left'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Wheel")
	    .appendField(new Blockly.FieldDropdown([["Left","left"], ["Right","right"]]), "wheel")
	    .appendField("power")		
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "power");
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(315);
	this.setTooltip('Move a wheel a certain power. Negative means backwards.');
	this.setHelpUrl('');
    }
};

Blockly.RXP['wheel_left'] = function(block) {
    var wheel = block.getFieldValue('wheel');
    var power = block.getFieldValue('power');
    var wi;
    if(wheel == "left")
	wi = "L";
    else
	wi = "R";

    return "W" + wi + "[" + power + "]";
};

Blockly.RXP['wheel_right'] = Blockly.RXP['wheel_left'];
  
