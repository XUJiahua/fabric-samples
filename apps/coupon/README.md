
上层应用（调用智能合约），主要关注fabric-network这个包。

参考链接： https://fabric-sdk-node.github.io/release-1.4/module-fabric-network.html

1、创建wallet，这样app才有权限去执行fabric chaincode

`npm run create-wallet`

2、准备 network connection profile 应用程序通过这个了解网络架构

配置的准备，可以参考下balance-transfer/artifacts/network-config.yaml。
（balance-transfer的配置2org4peer1order2ca的，需要精简下）

profile的说明可见：https://hyperledger-fabric.readthedocs.io/en/latest/developapps/connectionprofile.html

测试如下：

`npm run ttest`

3、 封装chaincode的操作，比如封装成API，给终端用户使用。


```
npm install
npm start
```
