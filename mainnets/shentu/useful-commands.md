---
hide_table_of_contents: false
title: Useful Commands
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div className="h1-with-icon icon-shentu">
# Shentu Useful Commands
</div>
<span className="sub-lines"> 
Chain ID: `shentu-2.2` | Node Version: `v2.14.0`
</span>

:::note
First You Need Set Variabels
:::

```js
MONIKER=<YOUR_MONIKER_NAME>
echo "export MONIKER=$MONIKER" >> $HOME/.bash_profile
echo "export SHENTU_CHAIN_ID="shentu-2.2"" >> $HOME/.bash_profile
source $HOME/.bash_profile
```

<Tabs>
<TabItem value="wallet" label="Wallet" default>

## Wallet

### Create Wallet

```bash
shentud keys add wallet
```

### Recovery Wallet

```bash
shentud keys add wallet --recover
```

### List All Wallet

```bash
shentud keys list
```

### Delete Wallet

```bash
shentud keys delete wallet
```

### Check Wallet Balance

```bash
shentud q bank balances $(shentud keys show wallet -a)
```

</TabItem>
<TabItem value="validator" label="Validator">

## Validator

:::note

Make sure you have adjust YOUR_KEYBASE_ID, YOUR_DETAILS, YOUR_WEBSITE_URL

:::

### Create Validator

```bash
shentud tx staking create-validator \
--amount=1000000uctk \
--pubkey=$(shentud tendermint show-validator) \
--moniker=$MONIKER \
--identity="YOUR_KEYBASE_ID" \
--details="YOUR_DETAILS" \
--website="YOUR_WEBSITE_URL" \
--chain-id=$SHENTU_CHAIN_ID \
--commission-rate=0.10 \
--commission-max-rate=0.20 \
--commission-max-change-rate=0.01 \
--min-self-delegation=1000 \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uctk
```

### Edit Validator

```bash
shentud tx staking edit-validator \
--new-moniker="YOUR MONIKER" \
--identity="IDENTITY KEYBASE" \
--details="DETAILS VALIDATOR" \
--website="LINK WEBSITE" \
--chain-id=$SHENTU_CHAIN_ID \
--from=wallet \
--gas-adjustment=1.5 \
--gas="auto" \
--gas-prices=1uctk
```

### Check Jailed Reason

```bash
shentud query slashing signing-info $(shentud tendermint show-validator)
```

### Unjail Validator

```bash
shentud tx slashing unjail --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

</TabItem>
<TabItem value="token" label="Token">

## Token

### Withdraw Rewards

```bash
shentud tx distribution withdraw-all-rewards --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

### Withdraw Rewards with Comission

```bash
shentud tx distribution withdraw-rewards $(shentud keys show wallet --bech val -a) --commission --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

### Delegate Tokens to Your Validator

```bash
shentud tx staking delegate $(shentud keys show wallet --bech val -a) 100000uctk --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

### Redelegate Tokens to Another Validator

```bash
shentud tx staking redelegate $(shentud keys show wallet --bech val -a) <TO_VALOPER_ADDRESS> 100000uctk --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

### Unbond Tokens from Your Validator

```bash
shentud tx staking unbond $(shentud keys show wallet --bech val -a) 100000uctk --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

### Send Tokens to Any Wallet

```bash
shentud tx bank send wallet <TO_WALLET_ADDRESS> 100000uctk --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

</TabItem>
<TabItem value="service" label="Service">

## Service

### Reload Service

```bash
sudo systemctl daemon-reload
```

### Enable Service

```bash
sudo systemctl enable shentud
```

### Disable Service

```bash
sudo systemctl disable shentud
```

### Start Service

```bash
sudo systemctl start shentud
```

### Stop Service

```bash
sudo systemctl stop shentud
```

### Restart Service

```bash
sudo systemctl restart shentud
```

### Check Service Status

```bash
sudo systemctl status shentud
```

### Check Service Logs

```bash
sudo journalctl -u shentud -f --no-hostname -o cat
```

</TabItem>
<TabItem value="governance" label="Governance">

## Governance

:::tip

For Vote, You can change the value of yes to no, abstain, no_with_veto

:::

### Vote

```bash
shentud tx gov vote 1 yes --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

### List all Proposals

```bash
shentud query gov proposals
```

### Check Vote

```bash
shentud tx gov vote PROPOSAL_NUMBER VOTE_OPTION --from wallet --chain-id $SHENTU_CHAIN_ID --gas-adjustment 1.5 --gas auto --gas-prices 1uctk -y
```

### Create new Proposal

```bash
shentud tx gov submit-proposal \
--title="Title" \
--description="Description" \
--deposit=10000000uctk \
--type="Text" \
--from=wallet \
--gas-adjustment 1.5 \
--gas "auto" \
--gas-prices=1uctk \
-y
```

</TabItem>
<TabItem value="Utility" label="Utility">

## Utility

### Set Indexer null / kv

```bash
sed -i 's|^indexer *=.*|indexer = "null"|' $HOME/.shentud/config/config.toml
```

### Get Validator Info

```bash
shentud status 2>&1 | jq .ValidatorInfo
```

### Get Denom Info

```bash
shentud q bank denom-metadata -oj | jq
```

### Get Sync Status

```bash
shentud status 2>&1 | jq .SyncInfo.catching_up
```

### Get Latest Height

```bash
shentud status 2>&1 | jq .SyncInfo.latest_block_height
```

### Get Node Peer

```bash
echo $(shentud tendermint show-node-id)'@'$(curl -s ifconfig.me)':'$(cat $HOME/.shentud/config/config.toml | sed -n '/Address to listen for incoming connection/{n;p;}' | sed 's/.*://; s/".*//')
```

### Set Minimum Gas Price

```bash
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"0.0025uctk\"/" $HOME/.shentud/config/app.toml
```

### Enable Prometheus

```bash
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.shentud/config/config.toml
```

### Reset Chain Data

```bash
shentud tendermint unsafe-reset-all --home $HOME/.shentud --keep-addr-book
```

</TabItem>
<TabItem value="Delete" label="Delete">

## Delete

:::danger

Please, before you advance to the following step! The entire chain data will be gone! Make sure you have a backup of your priv_validator_key.json!

:::

### Delete Node

```bash
sudo systemctl stop shentud && sudo systemctl disable shentud && sudo rm /etc/systemd/system/shentud.service && sudo systemctl daemon-reload && sudo rm -rf $(which shentud) && rm -rf $HOME/.shentud
```

</TabItem>

</Tabs>
