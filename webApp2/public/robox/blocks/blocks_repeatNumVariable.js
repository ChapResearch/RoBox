Blockly.Blocks['repeat_number_variable'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Repeat")
	    .appendField(new Blockly.FieldDropdown([["A","104"], ["B","105"], ["C","106"]]), "variable")
	    .appendField("times");
	this.appendStatementInput("statements")
	    .setCheck(null);
	this.setInputsInline(true);
	this.setPreviousStatement(true, null);
	this.setNextStatement(true, null);
	this.setColour(0);
	this.setTooltip('');
	this.setHelpUrl('');
    }
};

Blockly.RXP['repeat_number_variable'] = function(block) {
    var out = "";

    out += "RT[";
    out += block.getFieldValue('variable');
    out += "](";
    // a space gets injected in the "statementToCode"
    var branch = Blockly.RXP.statementToCode(block, 'statements');
    out += branch;

    out += ")";

    return(out);
};
