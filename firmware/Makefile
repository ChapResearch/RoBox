OBJS = actions.o debug.o tester.o program.o RXL.o robox.o EEPROM.o

CPPFLAGS = -Wwrite-strings -DSIMULATION

tester: $(OBJS)
	$(CC) -o tester $(OBJS)

clean:
	rm -f $(OBJS) tester


