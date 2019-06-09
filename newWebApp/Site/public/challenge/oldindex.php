<?php

//
// RoBox index.php
//
//   This index file is intended to be copied to each of the challenges.
//   It uses files in the currently directory to compose the page, along
//   with resources in the robox/html directory.
//
//   Here are the files used in the current directory for challenges:
//
//      help.html - the html that will be shown when a challenge begins
//                  and when "help" is pressed.
//
//      toolbox.xml - a list of the blocks that will be presented in the
//                    blockly toolbox.
//
//      blocks.txt - a list of the js files that need to be included for
//                   those blocks.
//
//      name.txt - the name of the challenge
//
//    number.txt - the number (or otherwise) of the challenge
//
//   The files that are used in the robox/html directory are:


//
// definitions() - creates all of the global variables that are used
//                 throughout this file.  This is a functions so that
//                 easy computation can be done if necessary
//
function definitions()
{
    global $ROOT;
    global $BASIC_HEADER, $BLOCKLY_HEADER, $LOCAL_INCLUDES;
    global $NUMBER, $PAGENAME, $PAGETITLE;
    global $BLOCKS, $BLOCKFILES, $BLOCKDIR;
    global $TITLEBAR;
    global $CONNECTFILE;
    global $HELP, $HELPFILE;
    global $BOTTOMBUTTONFILE;
    global $CHANGENAMEFILE;

    $ROOT = "../..";
    $BASIC_HEADER="$ROOT/robox/html/basicHeader.html";
    $BLOCKLY_HEADER="$ROOT/robox/html/blocklyHeader.html";
    $LOCAL_INCLUDES="$ROOT/robox/html/localIncludes.html";
    $TITLEBAR="$ROOT/robox/html/titleBar.html";
    $CONNECTFILE="$ROOT/robox/html/roboxConnect.html";
    $HELPFILE="$ROOT/robox/html/help.html";
    $BOTTOMBUTTONFILE="$ROOT/robox/html/bottomButtons.html";
    $CHANGENAMEFILE="$ROOT/robox/html/changeName.html";;

    $NUMBER = readConfigFile("number.txt")[0];
    $PAGENAME = readConfigFile("name.txt")[0];
    $PAGETITLE = "Challenge $NUMBER - RoBox";
    $HELP = NULL;
    if(file_exists("help.html")) {
        $HELP = file_get_contents("help.html");
    }

    $BLOCKS = readConfigFile("blocks.txt");
    $BLOCKFILES = readConfigFile("blockfiles.txt");
    $BLOCKDIR = "$ROOT/robox/blocks";
}

//
// main() - the main routine that brings everything else together.
//          It is called after all of the functions are defined.
//
function main()
{
    definitions();      // load up all of the file information
    
    htmlHeader();

    body();
    htmlTrailer();
}

//
// htmlHeader() - generate the header that includes all of the right
//                javascript and such. It is based upon the data contained
//                in this directory. ERROR messages are generated to the
//                web page for easy reading.
//
function htmlHeader()
{
    global $BASIC_HEADER,$BLOCKLY_HEADER, $LOCAL_INCLUDES;
    global $PAGETITLE;

    print(file_get_contents($BASIC_HEADER));
    print("<title>$PAGETITLE</title>\n");
    print(file_get_contents($BLOCKLY_HEADER));
    print(file_get_contents($LOCAL_INCLUDES));

    toolbox();

    print("</head>\n");
}

//
// body() - starts the "body" of the page, including title bar and blockly.
//
function body()
{
    global $CONNECTFILE;
    global $HELP, $HELPFILE;
    global $BOTTOMBUTTONFILE;
    global $CHANGENAMEFILE;

    print("<body style=\"margin:0px\">\n");
    titleBar();
    blocklyBody();
    print(readTemplateFile($CONNECTFILE));
    print(readTemplateFile($CHANGENAMEFILE));
    if($HELP) {
        print(readTemplateFile($HELPFILE,array("HELP"=>$HELP)));
    }

    print(readTemplateFile($BOTTOMBUTTONFILE));
}

//
// blocklyBody() - does the right stuff to have blockly included on the page.
//
function blocklyBody()
{
    print("<div id=\"blocklyDiv\"></div>\n");
}

//
// titleBar() - starts the "body" section of the page.
//              Defines
function titleBar()
{
    global $NUMBER, $PAGENAME, $PAGETITLE;
    global $TITLEBAR;

    $tokens = array(
        "NUMBER" => $NUMBER,
        "NAME" => $PAGENAME);

    print(readTemplateFile($TITLEBAR,$tokens));
}

function toolbox()
{
    global $BLOCKS, $BLOCKFILES, $BLOCKDIR;

    foreach($BLOCKFILES as $file) {
        if(substr($file,-3) != ".js") {
            $file = $file . ".js";          // add .js if not otherwise on there
        }
        print("<script src=\"$BLOCKDIR/$file\"></script>\n");
    }
        
    print("<xml id=\"toolbox\" style=\"display: none\">\n");

    foreach($BLOCKS as $block) {
        print("<block type=\"$block\"></block>\n");
    }

    print('</xml>');
}

function htmlTrailer()
{
    print("</body></html>");
}

//
// readTemplateFile() - reads the given template file, replacing any tokens
//                      found with their replacement text given.
//
function readTemplateFile($file,$tokens = array())
{
    $data = file_get_contents($file);

    foreach($tokens as $token => $replacement) {
        $data = str_replace("%%" . $token . "%%",$replacement,$data);
    }

    return($data);
}

//
// readConfigFile() - reads a local file, accounting for blank
//                    lines and comments, returning an array
//                    of the lines found (without any newlines).
//
function readConfigFile($name)
{
    $retarray = array();
    
    $handle = fopen($name, "r");
    if ($handle) {
        while (($line = fgets($handle)) !== false) {
            $line = trim($line);
            if($line != '' && substr($line,0,1) != "#") {
                $retarray[] = $line;
            }
        }
        fclose($handle);
    }

    return($retarray);
}
// NOW RUN MAIN!

main();

?>