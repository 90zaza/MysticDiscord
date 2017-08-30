/* eslint-disable import/no-extraneous-dependencies, global-require */
module.exports = (shipit) => {
  require('./node_modules/shipit-deploy')(shipit);
  require('./node_modules/shipit-pm2')(shipit);
  require('./node_modules/shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      workspace: 'tmp',
      repositoryUrl: 'git@github.com:gvlekke/MysticDiscord.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 4,
      shallowClone: true,
      dirToCopy: '',
      npm: {
        remote: true,
        installFlags: ['--only=production'],
      },
      shared: {
        overwrite: true,
        files: [
          '.env',
        ],
      },
      pm2: {
        json: '/home/pi/app/shared/ecosystem.json',
      },
    },
    production: {
      branch: 'master',
      deployTo: '/home/pi/app',
      servers: 'pi@83.84.3.165',
    }
  });
};
