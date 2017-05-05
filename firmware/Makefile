OBJS = actions.o debug.o tester.o program.o RXL.o

CPPFLAGS = -Wwrite-strings

tester: $(OBJS)
	$(CC) -o tester $(OBJS)

clean:
	rm -f $(OBJS) tester


