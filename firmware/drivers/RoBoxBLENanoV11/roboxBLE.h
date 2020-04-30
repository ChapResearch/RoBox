
#ifndef ROBOXBLE_H
#define ROBOXBLE_H

class BLE {

private:
	char myName[14];		// up to 13 char name and ending '\0'
	void _getname();		// internal routine for getting name of BLE device
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
