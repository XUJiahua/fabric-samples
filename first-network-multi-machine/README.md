### 架构

Fabric网络，目前申请有3台机器，每台用途如下：

1. Orderer: 共用的排序节点，可以先solo。此节点上另外安装zookeeper(*3) kafka(*3)
1. Peer0_org1: 企业1的一个peer节点
1. Peer0_org2: 企业2的一个peer节点


#### hosts

1. 172.16.3.16 orderer.example.com
1. 172.16.3.24 peer0.org1.example.com
1. 172.16.3.28 peer0.org2.example.com

### 部署

#### orderer.example.com

下载本git目录下的文件。

```
cd /opt
wget https://github.com/XUJiahua/fabric-samples/archive/develop.zip
unzip develop.zip
```

生成必要的文件

```
cd /opt/fabric-samples-develop/first-network-multi-machine

./byfn.sh generate 
```

1. crypto-config: 生成出来的证书
1. channel-artifacts: 生成出来的创始区块

同步文件至peer节点（note：配置免密登录）

```
scp -r /opt/fabric-samples-develop/ webapp@peer0.org1.example.com:/opt/fabric-samples-develop
scp -r /opt/fabric-samples-develop/ webapp@peer0.org2.example.com:/opt/fabric-samples-develop
```

启动orderer节点

`docker-compose -f docker-compose-orderer.yaml up -d`


把当前路径的文件内容同步到peer节点。

#### peer0.org1.example.com

启动peer节点

`docker-compose -f docker-compose-peer0_org1.yaml up -d`

跑脚本

```
docker exec -it cli bash
./scripts/script.sh mychannel
```

#### peer0.org2.example.com

启动peer节点

`docker-compose -f docker-compose-peer0_org2.yaml up -d`


### 清理

```
docker rm -f $(docker ps -aq)
docker volume prune

rm /opt/develop.zip
rm -rf /opt/fabric-samples-develop
```

注意 `docker volume prune` 非常重要。volume会复用，导致之前生成的证书也被复用了，这个坑对docker不熟悉很容易踩。
 
参考这个回答中的高票评论。https://stackoverflow.com/questions/45726536/peer-channel-creation-fails-in-hyperledger-fabric/45761571#45761571

### 日志

```
docker-compose -f docker-compose-orderer.yaml logs
docker-compose -f docker-compose-peer0_org1.yaml logs
docker-compose -f docker-compose-peer0_org2.yaml logs
```