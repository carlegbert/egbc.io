import { DirFile, LinkFile } from './FileStructure';

const homeDir = new DirFile('~');

const links = homeDir.createChild(['~', 'links'], 'dir');

links.children = [
  new LinkFile('github', links, 'https://github.com/carlegbert'),
  new LinkFile('linkedin', links, 'https://linkedin.com/in/carlegbert'),
  new LinkFile('email', links, 'mailto:egbertcarl@gmail'),
  new LinkFile('gibson - soundings for double bass quartet', links, 'https://www.youtube.com/watch?v=_VYZMzoVeZA'),
];

const about = homeDir.createChild(['~', 'about.txt']);

about.contents = [
  '<p>Thanks for visiting my personal website. I\'m currently employed as a QA intern at Incomm in Portland, OR, primarily writing automated UI testing and related tooling, but also undertaking general QA duties. I\'m interested in further opportunities in test automation as well as fullstack and backend web development. I\'m comfortable with JS and Python and also have some familiarity with C#, and am generally unafraid of learning new languages, frameworks, and tools.</p>',
  '<p>Before beginning my career in the tech industry, I was a professional classical double bassist. I\'ve performed with the Oregon and Eugene Symphonies, the Chintimini Chamber Music Festival, the Aspen Festival Orchestra, and many other professional ensembles.</p>',
  '<ul><li><a href="mailto:egbertcarl@gmail.com">egbertcarl@gmail.com</a></li><li><a href="https://www.linkedin.com/in/carlegbert" target="blank">linkedin</a></li><li><a href="https://github.com/carlegbert" target="blank">github</a></li><li><a href="https://github.com/carlegbert/wwwterm-es6" target="blank">this site on gh</a></li></ul>',
  '<p><span class="underline">About this site</span></p>',
  '<p>This site is written with ES6 features and transpiled with Babel/Webpack, without the aid of any framework.</p>',
];

module.exports = homeDir;
