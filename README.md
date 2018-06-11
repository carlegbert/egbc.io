### [wwwterm-es6](https://www.carlegbert.com)
##### Carl Egbert - egbertcarl@gmail.com

A mock linux terminal written in plain javascript serving as a personal website.

#### building the project

* `npm install`
* to run the dev server: `npm dev` (page served at localhost:8080)
* for an optimized build: `npm build`

#### running tests

In order to run the UI tests, you will need Java and Google Chrome installed, and to have the chromedriver binary in your PATH variable. You will also need to be running the dev server.

* To run unit tests: `npm run test`
* To run ui tests: `npm run test:ui`
* To run both: `npm run test:all`

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
* vi
* redirect with >, >>
* tab autocompletion

### WIP:
* unit testing
* vi

#### TODO
* line wrapping for vi
* more automation
* pipe with |
* results of ls are clickable & other user-friendliness
