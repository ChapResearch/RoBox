#
# Challenges Makefile
#
#   This makefile assembles the files necessary to load the challenges.
#

JSDIR = js
MEDIADIR = media

JSFILES = challenges.js challenges-min.js

all: clean $(JSFILES)

#
# marking this as .SECONDARY (just like .INDERMEDIATE but doesn't try to delete it)
#  stops the yui-compressor rule from always running - in essence it causes make
#  to ignore the result of the yui-compressor dependency.

.SECONDARY: yui-compressor

yui-compressor:
	@type $@ > /dev/null 2>&1 || (echo "You need to install the compressor.  \"sudo install yui-compressor\"" && exit 1)

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

#
# get a list of all of the challenges. Challenges have a "number" which is
#  actually a string - like "1" or "1A". The challenges are presented to the
#  users in ORDER - where that order is established by naming the challenge
#  files appropriately, so that "ls" has them in order. The actually challenge
#  name is the string after the dash.  Note that all of the .js
#  files, the makefiles, and the "js" directory are excluded.
#
# There are two macros: one lists the challenge names, the other the challenge
# directories. The two are in the SAME ORDER.
#  

CHALLENGES =    $(shell ls -d * | grep -vi makefile | grep -vi "js$$" | grep -v media | sed -e 's/[^-]*-//')
CHALLENGEDIRS = $(shell ls -d * | grep -vi makefile | grep -vi "js$$" | grep -v media)

#
# These variables make the composition shell scripts easier to read
#   and stops emacs from getting confused with the quotes
#
#     REPLACE_QUOTE = replace the single quote with HTML escape
#     PUNT_COMMENTS = get rid of comments on single lines
#     COMMA_SPACES = put commas between items separated by spaces
#     COMMA_LINES = put commands between items separated by lines
#     LAST_COMMA = get rid of the trailing comma
#     QUOTE_LINES = put single quotes around each line

REPLACE_QUOTE = -e "s/'/\&apos;/g"
PUNT_COMMENTS = -e "/^\#/d" -e "/^$$/d"
PUNT_BLANKS = -e "/^$$/d"
COMMA_SPACES = -e 's/ /,/g'
COMMA_LINES = -e 's/$$/,/'
LAST_COMMA = -e "s/, ]/ ]/"
QUOTE_LINES = -e "s/^/'/" -e "s/$$/'/"
STRINGIFY = -e "s/[^,]*/'&'/g"
CHALLENGENUMBER = -e "s/[^-]*-//"

challenges.js: challengeArray.js challengeHelp.js challengeName.js challengeType.js challengeBlocks.js
	cat $^ > $@

%-min.js: %.js
	tr -d "\n" < $< | yui-compressor --type js > $@

challengeArray.js:
	@echo "var challenges = [" `echo $(CHALLENGES) | sed $(COMMA_SPACES) | sed $(STRINGIFY)` "];" > $@

challengeHelp.js: $(shell ls */help.html)
	@echo "var challengeHelp = {};" > $@
	@for c in $(CHALLENGEDIRS); \
	    do	NUMBER=`echo $$c | sed $(CHALLENGENUMBER)`; \
	        echo "challengeHelp['$$NUMBER'] = '" "`base64 -w 0 $$c/help.html`" "'.trim();"; \
	    done >> $@

challengeName.js:  $(shell ls */name.txt)
	@echo "var challengeName = {};" > $@
	@for c in $(CHALLENGEDIRS); \
	    do	NUMBER=`echo $$c | sed $(CHALLENGENUMBER)`; \
            echo "challengeName['$$NUMBER'] = '" "`sed $(PUNT_COMMENTS) $(REPLACE_QUOTE) $$c/name.txt`" "'.trim();"; \
            done >> $@

challengeType.js:  $(shell ls */pagetype.txt)
	@echo "var challengeType = {};" > $@
	@for c in $(CHALLENGEDIRS); \
	    do	NUMBER=`echo $$c | sed $(CHALLENGENUMBER)`; \
	    echo "challengeType['$$NUMBER'] = '" "`sed $(PUNT_COMMENTS) $(REPLACE_QUOTE) $$c/pagetype.txt`" "'.trim();"; \
            done >> $@

challengeBlocks.js:  $(shell ls */blocks.txt)
	@echo "var challengeBlocks = {};" > $@
	@for c in $(CHALLENGEDIRS); \
	    do	NUMBER=`echo $$c | sed $(CHALLENGENUMBER)`; \
	    echo "challengeBlocks['$$NUMBER'] = [" `sed $(PUNT_COMMENTS) $(QUOTE_LINES) $(COMMA_LINES) $$c/blocks.txt` "];"; \
            done | sed $(LAST_COMMA) >> $@

clean:
	rm -f challenges.js challenges-compressed.js
	rm -f challengeArray.js challengeHelp.js challengeName.js challengeType.js challengeBlocks.js
	rm -fr $(JSDIR)
