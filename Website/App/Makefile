#
# RoBox App Makefile
#
#   This makefile composes the application for control RoBox robots.
#   The directory structure was set-up to make adding new challenges
#   "relatively" easy. So all of the files aren't jumbled together
#   in one spot.
#

//DEPLOYDIR := public
DEPLOYDIR := /media/sf_Virtual_Machine_Shares/deployment/RoBox

all:
	make -C Blockly js
	make -C Challenges js
	make -C RoBox js
	make -C RoBox css
	make -C RoBox media
	make -C RoBoxBlocks js
	make -C Testing
	make -C Competition

copy-files: 
	[ -d $(DEPLOYDIR) ] || mkdir $(DEPLOYDIR)
	[ -d $(DEPLOYDIR)/js ] || mkdir $(DEPLOYDIR)/js
	[ -d $(DEPLOYDIR)/css ] || mkdir $(DEPLOYDIR)/css
	[ -d $(DEPLOYDIR)/media ] || mkdir $(DEPLOYDIR)/media
	cp Blockly/js/* $(DEPLOYDIR)/js
	cp Challenges/js/* $(DEPLOYDIR)/js
	cp Challenges/media/* $(DEPLOYDIR)/media
	cp RoBoxBlocks/js/* $(DEPLOYDIR)/js
	cp RoBox/js/* $(DEPLOYDIR)/js
	cp RoBox/css/* $(DEPLOYDIR)/css
	cp RoBox/media/* $(DEPLOYDIR)/media
	cp RoBox/index.html $(DEPLOYDIR)
	cp RoBox/favicon.ico $(DEPLOYDIR)

deploy: all copy-files

test-deploy: deploy
	cd $(DEPLOYDIR); python -m SimpleHTTPServer

clean:
	make -C Blockly clean
	make -C Challenges clean
	make -C RoBox clean
	make -C RoBoxBlocks clean
	make -C Testing clean
	make -C Competition clean
	rm -fr index.html
	rm -fr $(DEPLOYDIR)

#
# the .gitignore needs to be sure to stop referens to the created directories

.gitignore:
	(echo $(DEPLOYDIR);           \
	) > $@
