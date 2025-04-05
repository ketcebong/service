---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="h1-with-icon icon-airchain">
# Airchain Sync
</div>
<span className="sub-lines"> 
Chain ID: `varanasi-1` | Node Version: `v0.3.1`
</span>

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

### Install dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop junctiond
```

### Backup priv_validator_state.json

```bash
cp $HOME/.junctiond/data/priv_validator_state.json $HOME/.junctiond/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
junctiond tendermint unsafe-reset-all --home $HOME/.junctiond --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot1.shazoe.xyz/testnets/snapshot1-airchain.tar.lz4 && lz4 -c -d snapshot1-airchain.tar.lz4 | tar -x -C $HOME/.junction && rm snapshot1-airchain.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.junctiond/priv_validator_state.json.backup $HOME/.junctiond/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart junctiond && sudo journalctl -fu junctiond -o cat
```

  </TabItem>
  <TabItem value="state sync" label="State Sync">

## State Sync

:::info
If you want to use this, make sure RPC is online
:::

### Stop Service

```bash
sudo systemctl stop junctiond
```

### Backup priv_validator_state.json

```bash
cp $HOME/.junctiond/data/priv_validator_state.json $HOME/.junctiond/priv_validator_state.json.backup
```

### Reset the data

```bash
junctiond tendermint unsafe-reset-all --home $HOME/.junctiond
```

### Add Peers

```bash
PEERS="79f26210777e84efb600bf776c32615a72675d9f@airchains_v-testnet-peer.itrocket.net:19656,4eff6ecc2323811d18c7e06319b2d8bbf58590d1@65.108.233.73:19656,847ffe6f885e4dd3ea97e5d558ee1bca1cc3fe9d@213.136.91.3:19656,8c229309660496e71b8a9d1edee46a18693b8e70@65.109.111.234:19656,0b4e78189c9148dda5b1b98c6e46b764337558a3@91.227.33.18:19656,4aaa6f76a1009feccffa90e8a00dd6343ca9b01f@152.53.49.146:19656,b57745eecc8c9638a3599c81f82dd69720df0ed8@94.130.164.82:26756,a635451ced8f49cd034c97aee978f176734abf56@100.42.177.205:26656,f84b41b95e828ee915aea19dd656cca7d39cf47b@37.17.244.207:33656,1d7a1809b616ce2437a5978bebbfcefec4bc3aa0@193.34.212.80:60656,ca0a4b67fd6ffd6a70ea8d0e3c8d284de0f8222f@37.27.132.57:19656"
SNAP_RPC="https://airchain-testnet-rpc.shazoe.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.junctiond/config/config.toml
```

### Get Info

```bash
LATEST_HEIGHT=$(curl -s $SNAP_RPC/block | jq -r .result.block.header.height);
BLOCK_HEIGHT=$((LATEST_HEIGHT - 2000));
TRUST_HASH=$(curl -s "$SNAP_RPC/block?height=$BLOCK_HEIGHT" | jq -r .result.block_id.hash)
echo $LATEST_HEIGHT $BLOCK_HEIGHT $TRUST_HASH && sleep 2
```

### Configure the State Sync

```bash
sed -i.bak -E "s|^(enable[[:space:]]+=[[:space:]]+).*$|\1true| ;
s|^(rpc_servers[[:space:]]+=[[:space:]]+).*$|\1\"$SNAP_RPC,$SNAP_RPC\"| ;
s|^(trust_height[[:space:]]+=[[:space:]]+).*$|\1$BLOCK_HEIGHT| ;
s|^(trust_hash[[:space:]]+=[[:space:]]+).*$|\1\"$TRUST_HASH\"| ;
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.junctiond/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.junctiond/priv_validator_state.json.backup $HOME/.junctiond/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart junctiond && sudo journalctl -fu junctiond -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.junctiond/config/genesis.json https://files.shazoe.xyz/testnets/airchain/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.junctiond/config/addrbook.json https://files.shazoe.xyz/testnets/airchain/addrbook.json
```
</TabItem>
<TabItem value="peers" label="Peers">
```bash
PEERS="$(curl -sS https://airchain-testnet-rpc.shazoe.xyz/net_info | jq -r '.result.peers[] | "\(.node_info.id)@\(.remote_ip):\(.node_info.listen_addr)"' | awk -F ':' '{print $1":"$(NF)}')"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.junctiond/config/config.toml
```
</TabItem>
</Tabs>
