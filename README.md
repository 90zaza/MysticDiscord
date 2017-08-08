# MysticDiscord
![Mystic](public/images/mystic.png)

## Prerequisites

### Install Node
Instructions for Mac OS:

In your terminal:
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
nvm install node
nvm use node
```

if you have nvm, but don't have node 8.2.1 execute:

```
nvm install 8.2.1
```

### Linter
Install eslint plugin in your favorite editor.

Atom: linter-eslint
Sublime: SublimeLinter-eslint

## Usage
```
npm start
```

## Contribute
- If you want to contribute you need to fork the repository and commit on your own repo.
- After that you can make a pull request
- We wil review your code
   - do we have comments --> change your code
   - do we accept --> then we going to merge your code into develop
- After merging we pick a moment to deploy the new features or fixes

## Deployment
Deployment is done by contributors. They can merge the develop branch into the master branch.
There is a hook that automagicly deploys to the server.
