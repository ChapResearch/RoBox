#
# RoBox Makefile
#
#   Assembles/updates all of the robox-specific stuff in preparation for the
#   appropriate deployment by the above levels.
#
#   Two important targets:

JSDIR = js
CSSDIR = css

# if you want the uncompressed version
#JSFILES = rxp-min.js roboxBlockly-min.js roboxEvents-min.js robox-min.js rcl-min.js roboxBLE-min.js 
JSFILES = rxp.js roboxBlockly.js roboxEvents.js robox.js rcl.js roboxBLE.js 

CSSFILES = robox.css

#
# marking this as .SECONDARY (just like .INDERMEDIATE but doesn't try to delete it)
#  stops the yui-compressor rule from always running - in essence it causes make
#  to ignore the result of the yui-compressor dependency.

.SECONDARY: yui-compressor

yui-compressor:
	@type $@ > /dev/null 2>&1 || (echo "You need to install the compressor.  \"sudo install yui-compressor\"" && exit 1)


%-min.js: %.js
	yui-compressor --type js < $< > $@


#
# this target creates/fills the "deploy" subdirectory with all of the files
#  that are necessary for the deployment of Blockly. the above Makefile(s)
#  should make sure that all of these files are referenced and deployed.
#
#  Note that the final "touch" in this rule causes the "deploy" directory
#  to participate in the make appropriately. It won't be repopulated unless
#  something changes.

$(JSDIR): $(JSFILES)
	[ -d $@ ] || mkdir $@
	cp $^ $@
	touch $@

$(CSSDIR): $(CSSFILES)
	[ -d $@ ] || mkdir $@
	cp $^ $@
	touch $@

clean:
	rm -fr $(JSDIR)
	rm -fr $(CSSDIR)
