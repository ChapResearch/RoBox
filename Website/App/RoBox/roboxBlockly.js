var workspace = null;   // put this in the global scope

//
// roboxBlocklyStart() - initializes the blockly workspace
//
function roboxBlocklyStart(divName)
{
    console.log("starting");
    
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

function roboxBlocklySave(location)
{
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

    var url = window.location.href;
    localStorage.setItem(location, xmlText);
}

//
// roboxBlocklyLoad() - loads the given save location.  Returns true if
//                      there is something that was loaded.  Basically
//                      indicating that they've been there before.
//        
function roboxBlocklyLoad(location)
{
    var url = window.location.href;
    var xmlText = localStorage.getItem(location);

    Blockly.mainWorkspace.clear();

    var hasData = false;
    
    if (xmlText) {
	xmlDom = Blockly.Xml.textToDom(xmlText);
	Blockly.Xml.domToWorkspace(xmlDom,Blockly.mainWorkspace);

	// if there are any <blocks> in the xml string, then it is non-blank
	if(xmlText.indexOf('block') != -1) {
	    hasData = true;
	}
    }

    return(hasData);
}
    

document.addEventListener('DOMContentLoaded',
			  function() {
			  });
