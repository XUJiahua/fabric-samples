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

note: 当前本地路径 /opt/fabric-samples-develop/first-network-multi-machine

`./byfn.sh generate` 生成必要的文件

1. crypto-config: 生成出来的证书
1. channel-artifacts: 生成出来的创始区块

启动orderer节点

`docker-compose -f docker-compose-orderer.yaml up -d`

同步文件至peer节点

`scp -r . webapp@peer0.org1.example.com:/opt/fabric-samples-develop/first-network-multi-machine`

`scp -r . webapp@peer0.org2.example.com:/opt/fabric-samples-develop/first-network-multi-machine`

（note：配置免密登录）

把当前路径的文件内容同步到peer节点。

#### peer0.org1.example.com

mkdir -p /opt/fabric-samples-develop/first-network-multi-machine

启动peer节点

`docker-compose -f docker-compose-peer0_org1.yaml up -d`

#### peer0.org2.example.com

mkdir -p /opt/fabric-samples-develop/first-network-multi-machine

启动peer节点

`docker-compose -f docker-compose-peer0_org2.yaml up -d`
