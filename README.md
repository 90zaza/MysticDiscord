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

### mysql2
You need to have a mysql server. On OSX you can install it with homebrew.

install homebrew: `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

install mysql: `brew install mysql`

### Linter
Install eslint plugin in your favorite editor.

Atom: linter-eslint
Sublime: SublimeLinter-eslint

### Editorconfig
Editorconfig takes care that all developers have the same settings in there editor.
So install editorconfig for atom or sublime text (or any other editor you have).

## Usage
When you pull something alwasy do this to install new packages:

```
npm install
```
and then start the chatbot:

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
