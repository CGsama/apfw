git clone https://github.com/CGsama/apfw.git

cd apfw

npm i

sudo cp ./apfw.service /etc/systemd/system/apfw.service

sudo systemctl daemon-reload

sudo systemctl enable apfw

sudo systemctl start apfw

sudo journalctl -u apfw.service
