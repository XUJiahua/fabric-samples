### 架构

Fabric网络，目前申请有3台机器，每台用途如下：

1. Orderer: 共用的排序节点，可以先solo。此节点上另外安装zookeeper(*3) kafka(*3)
1. Peer0_org1: 企业1的一个peer节点
1. Peer0_org2: 企业2的一个peer节点


#### hosts

1. 172.16.3.16 orderer.example.com
1. 172.16.3.24 peer0.org1.example.com
1. 172.16.3.28 peer0.org2.example.com


crypto-config: 生成出来的证书
channel-artifacts: 生成出来的创始区块


`docker-compose -f docker-compose-orderer.yaml up –d`

`docker-compose -f docker-compose-peer0_org1.yaml up –d`

`docker-compose -f docker-compose-peer0_org2.yaml up –d`
