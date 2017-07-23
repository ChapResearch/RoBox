workspace = null;

document.addEventListener('DOMContentLoaded',
  function() {
      workspace = Blockly.inject('blocklyDiv',{toolbox: document.getElementById('toolbox'),
					       scrollbars: true,
					       trashcan: true,
					       collapse: false});
      roboxExplain();
  }
);

