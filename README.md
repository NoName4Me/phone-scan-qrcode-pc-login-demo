# phone-scan-qrcode-pc-login-demo

简单模拟移动端扫描PC上的二维码（比如登陆），然后PC端自动跳转的一个DEMO。

## 说明

* 默认端口`3002`
* 请保证手机和PC在同一局域网内，查询机器IP，修改`index.js`中的`hostname`。

`npm start`启动服务器，然后在PC端访问`http://本机IP:端口/`。

直接使用微信扫一扫即可模拟登陆（简单起见，假设已经是登陆状态，访问的是`http://本机IP:端口/login/uuid='xxx'`，这个`xxx`是服务器生成的UUID，这样将用户和这个唯一标识绑定起来，然后激活PC上访问的那个**long polling**，即完成手机扫码，PC上自动跳转。