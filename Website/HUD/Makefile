#
# RoBox HUD Makefile
#
#   Much like the APP Makefile (or just like it) this makefile sets
#   up for deployment of the HUD part of the RoBox application.
#

DEPLOYDIR := public
//DEPLOYDIR := /media/sf_Virtual_Machine_Shares/deployment/RoBox

all:

copy-files: 
	[ -d $(DEPLOYDIR) ] || mkdir $(DEPLOYDIR)
	[ -d $(DEPLOYDIR)/js ] || mkdir $(DEPLOYDIR)/js
	[ -d $(DEPLOYDIR)/css ] || mkdir $(DEPLOYDIR)/css
	[ -d $(DEPLOYDIR)/media ] || mkdir $(DEPLOYDIR)/media
	cp hud.js $(DEPLOYDIR)/js 
	cp hud.css $(DEPLOYDIR)/css
	cp index.html $(DEPLOYDIR)
	cp favicon.ico $(DEPLOYDIR)
	cp media/* $(DEPLOYDIR)/media

deploy: all copy-files

test-deploy: deploy
	cd $(DEPLOYDIR); python -m SimpleHTTPServer

clean:
