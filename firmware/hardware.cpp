//
// hardware.cpp
//
//   Definitions of the hardware. Specific to the
//   configuration of the RoBox.
//

#include "Arduino.h"
#include "hardware.h"

#ifdef ROMEO
#include "hwromeo.cpp"
#endif

#ifdef SIMULATION
#include "hwsimulation.cpp"
#endif
