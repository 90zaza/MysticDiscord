/* eslint-disable import/no-extraneous-dependencies, global-require */
module.exports = (shipit) => {
  require('./node_modules/shipit-deploy')(shipit);
  require('./node_modules/shipit-yarn')(shipit);
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
      yarn: {
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
      branch: 'feature/deploy_to_raspberry',
      deployTo: '/home/pi/app',
      servers: 'pi@83.84.3.165',
    }
  });

  shipit.blTask('precompile:assets', () => {
    let cmd = `cd ${shipit.config.workspace} && yarn install`;
    return shipit.local(cmd);
  });

  shipit.blTask('clean-up', () => {
    const command = 'rm -r tmp';
    shipit.local(command);
  });

  shipit.on('deployed', () => {
    shipit.remote('pm2 save');
    shipit.start('clean-up');
  });

  shipit.on('fetched', () => {
    shipit.start('precompile:assets');
  });
};
