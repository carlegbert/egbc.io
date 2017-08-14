### wwwterm-es6
##### Carl Egbert - egbertcarl@gmail.com

[wwwterm](https://github.com/carlegbert/wwwterm) rewritten in ES6. Transpiled to ES5 via babel/webpack.

#### building the project

* you will need webpack (`npm install -g webpack`)
* `npm install`
* to run the dev server: `npm dev` (page served at localhost:8080)
* for an optimized build: `npm build`

#### running tests

* start the dev server with `npm dev`
* `npm test`

#### current working commands/features

* pwd
* whoami
* clear
* cd
* ls
* touch
* mkdir
* cat
* history navigation with up and down arrows
* echo
* redirect with >, >>
* tab autocompletion

### WIP:
* vi

#### TODO
* refactor vi (use ViBuffer class, remove jq)
* better instantiation for file objects
* line wrapping for vi
* 'localstorage' dir
* autocompletion with >, >>
* unit testing
* more automation
* help
* pipe with |
* results of ls are clickable & other user-friendliness
