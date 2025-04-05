---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="h1-with-icon icon-galactica">
# Galactica Sync
</div>
<span className="sub-lines"> 
Chain ID: `galactica_9302-1` | Node Version: `v0.1.2`
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
sudo systemctl stop galacticad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.galactica/data/priv_validator_state.json $HOME/.galactica/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
galacticad tendermint unsafe-reset-all --home $HOME/.galactica --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot1.shazoe.xyz/testnets/snapshot1-galactica.tar.lz4 && lz4 -c -d snapshot1-galactica.tar.lz4 | tar -x -C $HOME/.galactica && rm snapshot1-galactica.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.galactica/priv_validator_state.json.backup $HOME/.galactica/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart galacticad && sudo journalctl -fu galacticad -o cat
```

  </TabItem>
  <TabItem value="statesync" label="StateSync">

## State Sync

:::info
If you want to use this, make sure RPC is online
:::

### Stop Service

```bash
sudo systemctl stop galacticad
```

### Backup priv_validator_state.json

```bash
cp $HOME/.galactica/data/priv_validator_state.json $HOME/.galactica/priv_validator_state.json.backup
```

### Reset the data

```bash
galacticad tendermint unsafe-reset-all --home $HOME/.galactica
```

### Add Peers

```bash
PEERS="e926f2e20568e61646558a2b8fd4a4e46d77903f@141.95.110.124:26656,a028446e34e3c5bd198a60bf6e799a05e8db16a1@116.202.162.188:15656,8949fb771f2859248bf8b315b6f2934107f1cf5a@168.119.241.1:26656,27fc47bc018e1327eddfe99092cc64b3bc594bf9@144.76.97.251:26756,f3cd6b6ebf8376e17e630266348672517aca006a@46.4.5.45:27456,c722e6dc5f762b0ef19be7f8cc8fd67cdf988946@49.12.96.14:26656,3afb7974589e431293a370d10f4dcdb73fa96e9b@157.90.158.222:26656,f2ea5839ecea55e02a859f60926e94eef73a50a6@103.35.64.107:10656,707af7d29be8d3fff3c4f0cdc0b8986a6a8aff63@95.217.200.98:28656,15c8ce51492b22b13be095aac62cf2c33a1cf44e@65.109.68.87:30656,9990ab130eac92a2ed1c3d668e9a1c6e811e8f35@148.251.177.108:27456"
SNAP_RPC="https://galactica-testnet-rpc.shazoe.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.galactica/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.galactica/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.galactica/priv_validator_state.json.backup $HOME/.galactica/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart galacticad && sudo journalctl -fu galacticad -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.galactica/config/genesis.json https://files.shazoe.xyz/testnets/galactica/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.galactica/config/addrbook.json https://files.shazoe.xyz/testnets/galactica/addrbook.json
```
</TabItem>
<TabItem value="peers" label="Peers">
```bash
PEERS="$(curl -sS https://galactica-testnet-rpc.shazoe.xyz/net_info | jq -r '.result.peers[] | "\(.node_info.id)@\(.remote_ip):\(.node_info.listen_addr)"' | awk -F ':' '{print $1":"$(NF)}')"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.galactica/config/config.toml
```
</TabItem>
</Tabs>
