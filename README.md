# Qguard-Overlay-Project
Qguard及時地圖+圖層覆蓋+取得圖片經緯度工具

1. 安裝 NVM-
    https://github.com/creationix/nvm

    (用cURL安裝 nvm):
    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

    (或使用Wget安裝):
    $ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

2.設定環境參數:
    $ export NVM_DIR="$HOME/.nvm"
    
    $ [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

    $command -v nvm


3. 使用 NVM- 安裝Node
    To download, compile, and install the latest release of node, do this:
    $ nvm install node

    And then in any new shell just use the installed version:
    $ nvm use node

    Or you can just run it:
    $ nvm run node --version

4. 進入到 qguard_web_client 資料夾後下此指令
    $ npm install



5. 進入 config 資料夾
  - Edit config.ini with the correct latitude & longitude of the primary sensor. 
  - Set the angle offset from north to the angle between the "front" of the lidar and geographic north in degrees  in the sidebar

6. 到 /bin 資料夾啟動程式
    $ ./server.sh
  (if OS is virtual box in Windows)
    $ sed -i -e 's/\r$//' scriptname.sh

7.打開瀏覽器輸入
   localhost:3000 or <server_ip>:3000
