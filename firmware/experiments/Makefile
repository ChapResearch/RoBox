OBJS = debug.o tester.o program.o RXL.o robox.o EEPROM.o

CPPFLAGS = -Wwrite-strings -DSIMULATION -g

tester: $(OBJS)
	$(CC) -o tester $(OBJS)

clean:
	rm -f $(OBJS) tester


