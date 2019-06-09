#
# Main RoBox Makefile
#
# this file counts on arduino-mk being installed - see
#    https://github.com/sudar/Arduino-Makefile
#

export ARDUINO_DIR=/usr/share/arduino
export ARDMK_DIR=/usr/share/arduino
export AVR_TOOLS_DIR=/usr

ARCHITECTURE  = avr
BOARD_TAG     = uno

MONITOR_PORT  = /dev/ttyACM0

USER_LIB_PATH = ../drivers

# the libraries are defined here to override the automatic loading of
# libraries based upon an #include search. This makes the model
# selection (below) will work right. So all libraries that are not
# automatically found need to be here, EVEN IF they are referenced
# through an #include

ARDUINO_LIBS := EEPROM

# 
# HERE IS WHERE YOU DEFINE THE HARDWARE MODEL!!!!
#
#   Currently there are 3: SIMULATION, ROMEO, and BLENANO. They are implemented as hw<model>.cpp
#   and define a set of functions that are described in hardware.h.  To choose the model, you
#   need to include the appropriate library below, and set the CXXFLAGS to include the name of
#   the model.
#
#   It would be REAL nice if you could just set CXXFLAGS and everything would work
#   with the Makefile. But there is a problem with the current arduino-mk. Even if there is an
#   include in something like hwromeo.h that is wrapped in an #ifdef ROMEO, the make system will
#   see the include and load the library, ignoring that fact that it is wrapped in a false #ifdef.
#   Apparently, a newer version of arduino-mk will fix this.


# Currently define models: (uncomment the one you want)
# CXXFLAGS = -DSIMULATION
# CXXFLAGS = -DROMEO
CXXFLAGS = -DBLENANO

# Currently defined libraries: (uncomment the one you want)
# ARDUINO_LIBS := $(ARDUINO_LIBS) RoBoxRomeo
# ARDUINO_LIBS := $(ARDUINO_LIBS) RoBoxRomeoV20
# ARDUINO_LIBS := $(ARDUINO_LIBS) RoBoxRomeoV21
ARDUINO_LIBS := $(ARDUINO_LIBS) RoBoxBLENanoV10


include $(ARDMK_DIR)/Arduino.mk



