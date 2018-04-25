const { Directory, LinkFile, Path } = require('./FileStructure');

const homeDir = new Directory('~');
const links = homeDir.createChild(new Path('~/links'), Directory);

links.children = [
  new LinkFile('github', links, 'https://github.com/carlegbert'),
  new LinkFile('linkedin', links, 'https://linkedin.com/in/carlegbert'),
  new LinkFile('email', links, 'mailto:egbertcarl@gmail'),
  new LinkFile('gibson - soundings for double bass quartet', links, 'https://www.youtube.com/watch?v=_VYZMzoVeZA'),
];

const about = homeDir.createChild(new Path('~/about.txt'));

about.contents = [
  '<p>Thanks for visiting my personal website. I\'m currently employed as a QA engineer in Portland, OR at a financial services company, where I work on test and build automation, perform manual QA, and contribute to application development. I\'m comfortable with JS and Python and also have some familiarity with C#, and have dabbled with other languages. I am open to employment opportunities as a full-stack or backend developer at this time. I currently work with the Microsoft stack but am especially interested in working with Linux.</p>',
  '<p>Before beginning my career in the tech industry, I was a professional classical double bassist. I\'ve performed with the Oregon and Eugene Symphonies, the Chintimini Chamber Music Festival, the Aspen Festival Orchestra, and many other professional ensembles.</p>',
  '<ul><li><a href="mailto:egbertcarl@gmail.com">egbertcarl@gmail.com</a></li><li><a href="https://www.linkedin.com/in/carlegbert" target="blank">linkedin</a></li><li><a href="https://github.com/carlegbert" target="blank">github</a></li><li><a href="https://github.com/carlegbert/wwwterm-es6" target="blank">this site on gh</a></li></ul>',
];

module.exports = homeDir;
