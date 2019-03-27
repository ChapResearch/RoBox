Blockly.Blocks['play_sound_custom'] = {
    init: function() {
	this.appendDummyInput()
	    .appendField("Beep at")
	    .appendField(new Blockly.FieldDropdown(
		[["C1","24"],
		 ["C#1","25"],		 
		 ["D1","26"],
		 ["D#1","27"],
		 ["E1","28"],
		 ["F1","29"],
		 ["F#1","30"],		 
		 ["G1","31"],
		 ["G#1","32"],		 
		 ["A1","33"],
		 ["A#1","34"],		 
		 ["B1","35"],
		 ["C2","36"],
		 ["C#2","37"],		 
		 ["D2","38"],
		 ["D#2","39"],		 
		 ["E2","40"],
		 ["F2","41"],
		 ["F#2","42"],		 
		 ["G2","43"],
		 ["G#2","44"],		 
		 ["A2","45"],
		 ["A#2","46"],		 
		 ["B2","47"],
		 ["C3","48"],
		 ]), "frequency")
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

Blockly.RXP['play_sound_custom'] = function(block) {
    var out = "";
    var time = block.getFieldValue('time')*10;

    out += "B[";
    out += block.getFieldValue('frequency');
    out += "][";
    out += time;
    out += "]";

    return(out);
};
