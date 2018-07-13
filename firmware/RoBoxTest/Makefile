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
BOARD_TAG     = pro5v328

#MONITOR_PORT  = /dev/ttyACM0
MONITOR_PORT  = /dev/ttyUSB0

USER_LIB_PATH = ../drivers

# 
# HERE IS WHERE YOU DEFINE THE HARDWARE MODEL!!!!
#
#   Currently there are two "SIMULATION" and "ROMEO". Just uncomment the one you want.
#   To create a new hardware implementation, first implement the new hardware in the
#   "drivers" directory, along with an include file named the same as the new hardware
#   directory (take a look at "drivers/RoBoxRomeo/" directory as an example).  Then use
#   the "hwromeo.cpp" file as an example, and create a new ".cpp" file, implementing
#   the "hw_*****()" functions for the new hardware.
#
#   BIG NOTE - make sure you use a #define in the new ".cpp" to only include the code
#   when its define is used.
#
# CXXFLAGS = -DSIMULATION

CXXFLAGS = -DROMEO

include $(ARDMK_DIR)/Arduino.mk



