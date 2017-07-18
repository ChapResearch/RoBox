
#ifndef ROBOXBLE_H
#define ROBOXBLE_H

class BLE {

private:
	void dataDump();
	void dataDump(int);
	void commandMode();
	void commandModeExit();
	void restart();

public:
	BLE();
	void rename(const char *);
	const char *getname();
	int receive();
	void send(byte *,int);
	void init();
};

#endif
