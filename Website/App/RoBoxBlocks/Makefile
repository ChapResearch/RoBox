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

# TARGETS = $(TARGETFILE) $(TARGETFILE_MIN)
TARGETS = $(TARGETFILE)

JSDIR = js

ALLBLOCKS = $(shell ls *.js | grep -v $(TARGETFILE) | grep -v $(TARGETFILE_MIN))

all: $(TARGETS)

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
	for f in $^ ; do cat $$f; echo; done > $(TARGETFILE)

#
# the above command used to look like this:
#
#	sed -e '$$s/$$/\n/' -s $^ > $(TARGETFILE)
#
#     or
#
#	for f in $^ ; do sed -e '$$s/$$/\n/' $$f; done > $(TARGETFILE)
#
# But the sed command on the Mac doesn't have the -s option or the '\n' processing!
# -s means to process each file like a separate file, so that
# the last-line match works on each file. Otherwise they are
# simply concatenated, so there is only one last line.

clean:
	rm -f $(TARGETFILE) $(TARGETFILE_MIN)
	rm -fr $(JSDIR)

$(JSDIR): $(TARGETS)
	[ -d $@ ] || mkdir $@
	cp $^ $@
	touch $@
