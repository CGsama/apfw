WARNING:
current full proxy still buggy, you can try but if site become not accessable please only enable for the /inbox path in your nginx or cloudflare setting

e.g. cloudlflare tunnel setup

![image](https://github.com/CGsama/apfw/assets/15722562/fe05523f-1031-418d-ac01-8c5cb31a9d97)



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


poc:
![image](https://github.com/CGsama/apfw/assets/15722562/1a1013ef-6b8f-45e4-87a9-95897102607d)

![image](https://github.com/CGsama/apfw/assets/15722562/96c9b921-dd30-4d19-9c8f-3f68f1064980)
