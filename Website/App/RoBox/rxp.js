
goog.provide('Blockly.RXP');

goog.require('Blockly.Generator');


Blockly.RXP = new Blockly.Generator('RXP');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.RXP.addReservedWords();

Blockly.RXP.init = function(workspace) {
    
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.RXP.finish = function(code) {
//    console.log(code);
    return(code);
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.RXP.scrubNakedValue = function(line) {
    alert("scrubbing");
    return line + '\n';
};

/**
 * Common tasks for generating Lua from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Lua code created for this block.
 * @return {string} Lua code with comments and subsequent blocks added.
 * @private
 */
Blockly.RXP.scrub_ = function(block, code) {
    
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = Blockly.RXP.blockToCode(nextBlock);

    return code + nextCode;
};
