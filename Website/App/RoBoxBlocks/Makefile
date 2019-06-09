#
# Makefile for putting robox blocks together. This simply creates a compressed
# single file for robox blocks that will be deployed along with all of the other code.
#
#    Targets:
#               all - assembles all blocks and puts them together in a single file
#                     and puts that file into the js/ directory (creating it if it
#                     doesn't exist)
#		clean
#

TARGETFILE_MIN = roboxBlocks-min.js
TARGETFILE = roboxBlocks.js

JSDIR = js

ALLBLOCKS = $(shell ls *.js | grep -v $(TARGETFILE) | grep -v $(TARGETFILE_MIN))

all: $(TARGETFILE) $(TARGETFILE_MIN)

#
# marking this as .SECONDARY (just like .INDERMEDIATE but doesn't try to delete it)
#  stops the yui-compressor rule from always running - in essence it causes make
#  to ignore the result of the yui-compressor dependency.

.SECONDARY: yui-compressor

yui-compressor:
	@type $@ > /dev/null 2>&1 || (echo "You need to install the compressor.  \"sudo install yui-compressor\"" && exit 1)

%-min.js: %.js
	yui-compressor --type js < $< > $@

$(TARGETFILE): $(ALLBLOCKS)
	sed -e '$$s/$$/\n/' -s $^ > $(TARGETFILE)

clean:
	rm -f $(TARGETFILE) $(TARGETFILE_MIN)
	rm -fr $(JSDIR)

$(JSDIR): $(TARGETFILE_MIN) $(TARGETFILE)
	[ -d $@ ] || mkdir $@
	cp $^ $@
	touch $@
