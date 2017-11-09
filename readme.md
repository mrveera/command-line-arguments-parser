
# command-line-arguments-parser

[![CircleCI](https://circleci.com/bb/veera83372/command-line-argumnets-parser/tree/master.svg?style=shield&circle-token=a723bccdc76d4581bf70d5a59b590244067fa307)](https://circleci.com/bb/veera83372/command-line-argumnets-parser/tree/master)[![Join the chat at https://gitter.im/command-line-arguments-parser/Lobby](https://badges.gitter.im/command-line-arguments-parser/Lobby.svg)](https://gitter.im/command-line-arguments-parser/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is a command line arguments parser written in Javascript that helps parse command line arguments and it will return object with boolean flags ,value flags, arguments, optionSetBy and default option.
You should define rules to parse.
I am providing different methods to specify rules

## Motivation

I am implementing head (shell command) functionality using node js i found that it's difficult write individual parser for each command
So by installing this module you can build any command easily
even if you are building your own command.
[My Mentor ](https://github.com/craftybones) key-val parser motivated me a lot.
## Installation

`npm install command-line-arguments-parser`

## Usage

```javascript
let Parser=require('command-line-arguments-parser').Parser;

let parserName=new Parser();

//the following are methods to specify rules

//to set default option for your command
parserName.setDefaultOption(option);
//to add options which are valid you need to pass value validator callback to validate value given to your option in this your should start with hyphen
parserName.addLegalOption(option1 ,value1ValidatorCallback);

//if your options doing same work you need to add replaces
parserName.addReplacer(key ,value); //example  ('-h','--help')

//if your option don't need value you need to add into verboses
//it should start with double hyphen to make valid verbose
parserName.addLegalVerbose('--'+yourVerboseName);


//to enable combined flags
parserName.enableCombinedFlags(); // example -abc 20 30 40 it will parse as -a20,-b30,-c40

//It helps to specify how many maximum options you can parse at a time
parserName.setMaximumOptions(number);
/* parser.setMaximumOptions(1);
your arguments -n  10 -c 20
 it will throw error maximum options reached
 */

 //pass an array of  things to parse method to get parsedArguments
 parserName.parse(args); //example let args =['-n','10','files'] for head

```


#### Examples

##### Head command Parser
```javascript
  let Parser=require('command-line-arguments-parser').Parser;

  let headParser = new Parser();
  //default option 'n'
  headParser.setDefaultOption('n');
  //two c and n options which take only number
  headParser.addLegalOption('-n',isItNumber);
  headParser.addLegalOption('-c',isItNumber);

  // -- and -n10 functionality are same
  headParser.addReplacer('--','-n10');

  // --help which don't need any input
  headParser.addLegalVerbose('--help');

  //by default combined flags are false
  headParser.enableCombinedFlags();

  //maximum options set to 1
  headParser.setMaximumOptions(1);

  let isItNumber = function (value) {
    return (+value>0);
  };
```

## Different cases output for above parser rules

``` javascript
  let args=['--help'];
  //output
  { arguments: [],
  verboses: [ '--help' ],
  optionSetBy: 'default',
  flags: {},
  defaultOption: 'n' }

  args=['-n10','-c12'];
  //output
  Error:Maximum options reached

  args=['-n10',"toDo.txt"];
  //output
  {
    arguments:['toDo.txt'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:10},
    defaultOption:'n'
  }

  args=['-n12',"toDo.txt",'--help'];//once it see argument remaining everything is argument
  //output
  {
    arguments:['toDo.txt','--help'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:12},
    defaultOption:'n'
  }

  args=[];
  //output
  {
    arguments:[],
    verboses:[],
    optionSetBy:'default',
    flags:{},
    defaultOption:'n'
  }

  args =['-10'];
  //output
  {
    arguments:[],
    verboses:[],
    optionSetBy:'n',
    flags:{n:10},
    defaultOption:'n'
  }

```
#### Unsupported Cases

```javascript
//when args as below
args=['-n10','-20'];
//it will replace n value with 20 because default option is n
{
  arguments:[],
  verboses:[],
  optionSetBy:'n',
  flags:{n:20},
  defaultOption:'n'
}
```
