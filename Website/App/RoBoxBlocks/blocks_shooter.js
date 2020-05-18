Blockly.Blocks['shooter_fire'] = {
    init: function() {
        this.appendDummyInput()
	.appendField('Fire Shooter');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['shooter_load'] = {
    init: function() {
        this.appendDummyInput()
	.appendField('Load Shooter');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.RXP['shooter_fire'] = function(block) {
    return('O');
};

Blockly.RXP['shooter_load'] = function(block) {
    return('A');
};
