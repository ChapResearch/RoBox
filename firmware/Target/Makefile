#
# IR Receive Test
#
# this file counts on arduino-mk being installed - see
#    https://github.com/sudar/Arduino-Makefile
#

export ARDUINO_DIR=/usr/share/arduino
export ARDMK_DIR=/usr/share/arduino
export AVR_TOOLS_DIR=/usr

ARCHITECTURE  = avr
BOARD_TAG     = pro5v328
BOARD_SUB     = atmega328

ISP_PROG     = avrftdi

MONITOR_PORT  = /dev/ttyUSB0

USER_LIB_PATH = ../drivers

include $(ARDMK_DIR)/Arduino.mk
