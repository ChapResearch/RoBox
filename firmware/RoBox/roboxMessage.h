//
// roboxMessage
//
//    Implements the robox message protocol from client to robox.
//    It DOESN'T know about the content of the messages, just the
//    format.
//
//    Format of robox messages is:
//
//               6-bits         10 bits
//           ,----------------,----------------,
//           |   cmd      |   payload length   |
//           '----------------'----------------'
//              byte 1             byte 2
//
//    The cmd is an ascii character from A-Z and a-z and the characters
//    next to them in ASCII.  To get the (char) from the byte, get the
//    six bits and add 0x40 in front. ==>   cmd = ((byte1 & 0xfc) >> 2) | 0x40
//

#define MAX_INT_PAYLOAD	5		// max internal payload (non EEPROM)

class RoBoxMessage {

	// these two are set externally, and used by all messages

	static int	(*recvfn)();		// function to receive incoming data
	static void	(*sendfn)(byte *,int);	// function to send data

private:
	const char	*message;		// if non-null, then outgoing string message.
	                                        // NEVER happens on incoming!
	
public:
	static int	EEPROM_ptr;		// pointer to where programs are stored in EEPROM

	char		cmd;
	unsigned int	length;			// actual length of data, not including command or length bytes
	int		arg[MAX_INT_PAYLOAD];	// storage for internal message args

	RoBoxMessage();
	RoBoxMessage(char);
	RoBoxMessage(char,byte);
	RoBoxMessage(char,byte,byte);
	RoBoxMessage(char,byte,byte,byte);
	RoBoxMessage(char,const char *);
	void Transfer();
	bool Receive();
	void Send();
};
