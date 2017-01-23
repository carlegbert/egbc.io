### wwwterm-es6
##### Carl Egbert - egbertcarl@gmail.com

[wwwterm](https://github.com/carlegbert/wwwterm) rewritten in ES6. Transpiled to ES5 via babel/webpack.

#### Instructions

* you will need nodejs/npm
* you will need webpack (`npm install -g webpack`)
* `npm install`
* to run the dev server: `npm run dev`
* for an optimized build: `npm run build`

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

#### TODO
* autocompletion with >, >>
* QA autocompletion
* unit testing
* refactoring: cache jquery lookups when possible
* help
* vi
* pipe with |
* wire up to api [wwwterm-api](https://github.com/carlegbert/wwwterm-api)
* results of ls are clickable & other user-friendliness
* 'localstorage' dir
