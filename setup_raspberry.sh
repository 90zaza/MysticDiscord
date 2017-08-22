sudo apt update
sudo apt full-upgrade

# node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

## node - use nvm in bash without restart
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 8.4.0

git clone https://github.com/gvlekke/MysticDiscord.git
cd MysticDiscord
npm install
