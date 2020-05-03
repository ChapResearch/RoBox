#
# RoBoxServoTest Makefile
#
# this file counts on arduino-mk being installed - see
#    https://github.com/sudar/Arduino-Makefile
#

export ARDUINO_DIR=/usr/share/arduino
export ARDMK_DIR=/usr/share/arduino
export AVR_TOOLS_DIR=/usr

ARCHITECTURE  = avr
BOARD_TAG     = uno
BOARD_SUB     = atmega368

MONITOR_PORT  = /dev/ttyACM0

USER_LIB_PATH = ../..

# change the next line to set the version of the RoBox
# library you want to link to

ARDUINO_LIBS := RoBoxBLENanoV11

ARDUINO_LIBS := $(ARDUINO_LIBS) Servo

include $(ARDMK_DIR)/Arduino.mk
