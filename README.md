### [carlegbert.com](https://egbc.io)

A mock linux terminal written in plain typescript serving as a personal website.

This project has been a learning laboratory of sorts for me. I began it before I began working in the technology industry, and at that time it was a fun and interesting challenge to figure out how to make a web page act kind of like a tty without using any third-party libraries. Today, the challenge lies more in coming back and figuring out how to apply some of the principles and lessons I've learned as a professional to the existing code while still keeping the application working and intact.

#### building

- `npm ci`
- to run the dev server: `npm run start` (page served at localhost:1234)
- for an optimized build: `npm run build`

#### running tests

In order to run the UI tests, you will need Java and Google Chrome installed, and to have the chromedriver binary in your `PATH` variable. You will also need to be running the dev server.

- To run unit tests: `npm run test`
- To run ui tests: `npm run test:ui`
- To run both: `npm run test:all`

#### current working commands/features

- pwd
- whoami
- clear
- cd
- ls
- touch
- mkdir
- cat
- history navigation with up and down arrows
- echo
- redirect with >, >>
- tab autocompletion

### partially working:

- vi

### possible future goals:

- lots refactoring
- pipe operator
