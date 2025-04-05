---
hide_table_of_contents: false
title: Sync
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="h1-with-icon icon-dhealth">
# Dhealth Sync
</div>
###### Chain ID: `dhealth` | Current Node Version: `v1.0.0`

<Tabs>
  <TabItem value="snapshot" label="Snapshot" default>

## Snapshot

### Install dependencies

```bash
sudo apt install lz4 && sudo apt install aria2
```

### Stop Service

```bash
sudo systemctl stop dhealthd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.dhealth/data/priv_validator_state.json $HOME/.dhealth/priv_validator_state.json.backup
```

### Reset Chain Data

```bash
dhealthd tendermint unsafe-reset-all --home $HOME/.dhealth --keep-addr-book
```

### Download Snapshot

```bash
aria2c -x 8 -s 8 https://snapshot1.shazoe.xyz/mainnets/snapshot1-dhealth.tar.lz4 && lz4 -c -d snapshot-dhealth.tar.lz4 | tar -x -C $HOME/.dhealth && rm snapshot-dhealth.tar.lz4
```

### Restore Backup

```bash
mv $HOME/.dhealth/priv_validator_state.json.backup $HOME/.dhealth/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart dhealthd && sudo journalctl -fu dhealthd -o cat
```

  </TabItem>
  <TabItem class="tab" value="stateSync" label="State Sync">

## State Sync

:::info
If you want to use this, make sure RPC is online
:::

### Stop Service

```bash
sudo systemctl stop dhealthd
```

### Backup priv_validator_state.json

```bash
cp $HOME/.dhealth/data/priv_validator_state.json $HOME/.dhealth/priv_validator_state.json.backup
```

### Reset the data

```bash
dhealthd tendermint unsafe-reset-all --home $HOME/.dhealth
```

### Add Peers

```bash
PEERS="9ff70edee323ba40445e79e4108ae8c5aa7dd63f@78.46.174.72:28256,07243cc6e34d0f829bdb7450b9d5e7da8ffa7869@162.19.124.59:61656,cc45db56335a918651dfe29a2b70a534b335f0ef@46.101.196.105:26656,46dc3bae5e14bc3d639bdac99b61c4db8bb04b76@153.127.55.183:26656"
SNAP_RPC="https://dhealth-mainnet-rpc.shazoe.xyz:443"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.dhealth/config/config.toml
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
s|^(seeds[[:space:]]+=[[:space:]]+).*$|\1\"\"|" $HOME/.dhealth/config/config.toml
```

### Restore Backup

```bash
mv $HOME/.dhealth/priv_validator_state.json.backup $HOME/.dhealth/data/priv_validator_state.json
```

### Restart Service

```bash
sudo systemctl restart dhealthd && sudo journalctl -fu dhealthd -o cat
```

</TabItem>
<TabItem value="genesis" label="Genesis">
```bash
wget -O $HOME/.dhealth/config/genesis.json https://files.shazoe.xyz/mainnets/dhealth/genesis.json
```
</TabItem>
<TabItem value="Addrbook" label="Addrbook">
```bash
wget -O $HOME/.dhealth/config/addrbook.json https://files.shazoe.xyz/mainnets/dhealth/addrbook.json
```
</TabItem>
<TabItem value="peers" label="Peers">
```bash
PEERS="$(curl -sS https://dhealth-mainnet-rpc.shazoe.xyz/net_info | jq -r '.result.peers[] | "\(.node_info.id)@\(.remote_ip):\(.node_info.listen_addr)"' | awk -F ':' '{print $1":"$(NF)}')"
sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" $HOME/.dhealth/config/config.toml
```
</TabItem>
</Tabs>
