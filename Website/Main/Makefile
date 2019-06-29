#
# RoBox Website "Main" Makefile
#
#   This makefile composes the front-page (marketing) part of the
#   RoBox website.
#
#   Unlike most of this website, the files in this directory are
#   copies verbatim to the deploy dir when deploying.
#

//DEPLOYDIR := public
DEPLOYDIR := /media/sf_Virtual_Machine_Shares/deployment/RoBox

all:


copy-files: 
	[ -d $(DEPLOYDIR) ] || mkdir $(DEPLOYDIR)
	[ -d $(DEPLOYDIR)/js ] || mkdir $(DEPLOYDIR)/js
	[ -d $(DEPLOYDIR)/css ] || mkdir $(DEPLOYDIR)/css
	[ -d $(DEPLOYDIR)/media ] || mkdir $(DEPLOYDIR)/media
	[ -d $(DEPLOYDIR)/vendor ] || mkdir $(DEPLOYDIR)/vendor
	cp js/* $(DEPLOYDIR)/js
	cp media/* $(DEPLOYDIR)/media
	cp css/* $(DEPLOYDIR)/css
	cp -R vendor/* $(DEPLOYDIR)/vendor
	cp index.html $(DEPLOYDIR)
	cp build.html $(DEPLOYDIR)

deploy: all copy-files

clean:
	rm -fr $(DEPLOYDIR)
