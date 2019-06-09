Blockly.Blocks['elseIf'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("else if")
	    .appendField(new Blockly.FieldDropdown([["Ultrasonic","101"], ["Light","102"], ["IR","103"], ["A","104"], ["B","105"], ["C","106"]]), "variable")
	    .appendField(new Blockly.FieldDropdown([["=","="], [">",">"], ["<","<"], ["!=","!"], ["<=","G"], [">=","L"]]), "comparison")
	    .appendField(new Blockly.FieldNumber(0, -100, 100, 1), "value");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setPreviousStatement(true, "if");
	this.setNextStatement(true, null);
	this.setColour(230);
	this.setTooltip("");
	this.setHelpUrl("");
    }
};

Blockly.RXP['elseIf'] = function(block) {
    
    var out = "";
    var sense = block.getFieldValue('variable');
    var val = block.getFieldValue('value');

    if(sense==101 && val<3)
	val = 3;

    out += "e[";
    out += sense;
    out += "]";

    out += block.getFieldValue('comparison');

    out += "[";
    out += val;
    out += "](";

    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};

