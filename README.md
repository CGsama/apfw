default setup is for misskey

usage: node index.js http://127.0.0.1:3000 3001

first param is the backend, second is listen port



git clone https://github.com/CGsama/apfw.git

cd apfw

npm i

sudo cp ./apfw.service /etc/systemd/system/apfw.service

sudo systemctl daemon-reload

sudo systemctl enable apfw

sudo systemctl start apfw

sudo journalctl -u apfw.service
