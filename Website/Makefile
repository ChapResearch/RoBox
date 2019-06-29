#
# RoBox Website Makefile
#
#   This makefile is used for the new RoBox Google firebase deployment.
#
#   The directory structure of this directory on down is as follows:
#     Main - the main web site that has the marketing stuff
#     Campers - the web site that has camper information and direct links to challenges
#     App - the RoBox running-the-robot app
#       App/Testing - the testing app
#       App/Competition - the competition app
#

# npm needs to be installed - this can be done with nvm
# sudo npm install -g firebase-tools   (needs sudo because it puts in in /usr/local
# (nothing gets put into the local directory - this just sets up the machine)
# (if an npm update is needed "sudo npm install -g npm")
# FIREBASE LOGIN "firebase login"
#   to logout: firebase logout

#
# testForLogin - this is used in front of most firebase commands to make sure
#                that you are logged in before you try any of the firebase
#                commands.  It slows things down a bit, but is a good thing.
testForLogin:
	@firebase list > /dev/null 2>&1 || (echo "You must login first. Do \"make login\"" && exit 1)

#
# login/logout - simple target to logout to firebase (really just as a reminder what to do)
#
login:
	firebase login

logout:
	firebase logout


#
# actual targets
#

all:
	make -C App
	make -C Main
	make -C Campers

#
# the deployment directory is $(DEPLOYDIR) which needs to be programmed in the
#   firebase.json too.
# Each subdir is called with the target spot for it's deployment that will override
#   any deployment directory internally

# the deploydir must be relative this this directory so that subdirs can be directed appropriately
DEPLOYDIR := public

deploy: testForLogin
	[ -d $(DEPLOYDIR) ] || mkdir $(DEPLOYDIR)
	[ -d $(DEPLOYDIR)/App ] || mkdir $(DEPLOYDIR)/App
	[ -d $(DEPLOYDIR)/Campers ] || mkdir $(DEPLOYDIR)/Campers
	make -C App DEPLOYDIR=../$(DEPLOYDIR)/App $@
	make -C Main DEPLOYDIR=../$(DEPLOYDIR) $@
	firebase deploy

clean:
	rm -rf $(DEPLOYDIR)
	make -C App $@
	make -C Main $@
	make -C Campers $@
