Blockly.Blocks['variable_setVar'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Variable")
	    .appendField(new Blockly.FieldDropdown([["A","104"], ["B","105"], ["C","106"]]), "var")
	    .appendField("=")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "value");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(180);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.Blocks['variable_math'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Math: Variable")
	    .appendField(new Blockly.FieldDropdown([["A","104"], ["B","105"], ["C","106"]]), "var")
	    .appendField(new Blockly.FieldDropdown([
		["+","+"],
		[{"src":"https://d30y9cdsu7xlg0.cloudfront.net/png/10572-200.png",
		  "width":10,"height":10,"alt":"*"},"-"],
		["x","*"],
		[{"src":"https://pauladkin.files.wordpress.com/2015/04/division_sign-svg.png",
		  "width":10,"height":10,"alt":"*"},"/"]
	    ]), "math")
	    .appendField(new Blockly.FieldNumber(0, -100, 100), "value");
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(180);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};


Blockly.RXP['variable_setVar'] = function(block) {
    var out = "";

    out += "V[";
    out += block.getFieldValue('var');
    out += "]=[";
    out += block.getFieldValue('value');
    out += "]";
      
    return(out);
};

Blockly.RXP['variable_math'] = function(block) {
    var out = "";

    out += "V[";
    out += block.getFieldValue('var');
    out += "]";
    out += block.getFieldValue('math');
    out += "[";
    out += block.getFieldValue('value');
    out += "]";
      
    return(out);
};
