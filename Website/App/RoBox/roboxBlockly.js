var workspace = null;   // put this in the global scope

//
// roboxBlocklyStart() - initializes the blockly workspace
//
function roboxBlocklyStart(divName)
{
    workspace = Blockly.inject(divName,{toolbox: roboxBlocklyChallengeToolbox(null),
					scrollbars: true,
					trashcan: true,
					collapse: false});
}

function roboxBlocklyChallengeToolbox(id)
{
    if(!id) {
	return("<xml></xml");    // empty tool box if null
    }
    
    var blocks = challengeBlocks[id];

    var blockXML = '<xml>';
    for(var i=0; i< blocks.length; i++) {
	blockXML += '<block type="' + blocks[i] + '"></block>';
    }
    blockXML += '</xml>';

    return(blockXML);
}
	
    
function roboxBlocklyChallengeLoad(id)
{
    var toolbox = roboxBlocklyChallengeToolbox(id)    
    workspace.updateToolbox(toolbox);
}


document.addEventListener('DOMContentLoaded',
			  function() {
			  });
