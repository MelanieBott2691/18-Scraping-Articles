import push from 'git-push';

const remote = {
  name: 'production',
  url: 'http://github.com/MelanieBott2691/18-Scraping-Articles',
  branch: 'gh-pages'
};

export default async () => {
  await require('/build')();
  await new Promise((resolve) => push('./build', remote, resolve));
};
