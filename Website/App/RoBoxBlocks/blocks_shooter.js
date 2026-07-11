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

Blockly.Blocks['shooter_start'] = {
    init: function() {
        this.appendDummyInput()
	.appendField('Start Shooter');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['shooter_stop'] = {
    init: function() {
        this.appendDummyInput()
	.appendField('Stop Shooter');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.RXP.forBlock['shooter_fire'] = function(block) {
    return('O');
};

Blockly.RXP.forBlock['shooter_load'] = function(block) {
    return('A');
};

Blockly.RXP.forBlock['shooter_start'] = function(block) {
    return('J');
};

Blockly.RXP.forBlock['shooter_stop'] = function(block) {
    return('C');
};
