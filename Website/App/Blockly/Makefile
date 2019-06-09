#
# Blockly Makefile
#
#   Assembles/updates all of the blockly-related stuff for
#   appropriate deployment by the above levels. A single file is
#   generated an dropped into the js/ directory.  This file has
#   all of the blockly source (compressed) and the robox blocks
#   (either compressed or not).
#

JSDIR = js

BLOCKLYFILES = blockly_compressed.js msg/js/en.js

$(JSDIR): $(BLOCKLYFILES)
	[ -d $@ ] || mkdir $@
	cp $^ $@
	touch $@

clean:
	rm -fr $(JSDIR)
