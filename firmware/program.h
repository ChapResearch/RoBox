//
//      ____  _________  ____ __________ _____ ___ 
//     / __ \/ ___/ __ \/ __ `/ ___/ __ `/ __ `__ \
//    / /_/ / /  / /_/ / /_/ / /  / /_/ / / / / / /
//   / .___/_/   \____/\__, /_/   \__,_/_/ /_/ /_/ 
//  /_/               /____/                       
//
// program.h
//

class Program {
private:
	int	ptr;		// a pointer into the program
	int	size;		// size of the program
public:
	unsigned char	*buffer;	// [DEBUG] used to hold program when debugging

	Program(const char *);
	void Dump();
	void Dump(int);
	unsigned char Next();
	int Index();
	void SetIndex(int);
	void Reset();
	bool AtEnd();
};
