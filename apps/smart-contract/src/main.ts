import { configDotenv } from 'dotenv';
import { mnemonicToWalletKey } from '@ton/crypto';
import {
  fromNano,
  TonClient,
  WalletContractV3R2,
  WalletContractV4,
} from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import * as path from 'path';

const envs = configDotenv({
  path: path.resolve(__dirname, '../.env.env'),
  debug: true,
}).parsed;

const connectToWallet = async (isReal = true) => {
  const mnemonic = isReal ? envs.REAL_MNEMONIC_PHRASE : envs.MNEMONIC_PHRASE;
  const key = await mnemonicToWalletKey(mnemonic.split(' '));

  console.log(mnemonic.split(' '));

  const wallet = (isReal ? WalletContractV4 : WalletContractV3R2).create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  const endpoint = await getHttpEndpoint({
    network: 'mainnet',
  });

  const client = new TonClient({ endpoint });

  // const seqNo = await wallet.getSeqno();

  console.log(wallet.address);

  const isContractDeployed = await client.isContractDeployed(wallet.address);

  if (!isContractDeployed) {
    console.log('contract is not deployed');
  } else {
    console.log('contract deployed');
  }

  const balance = await client.getBalance(wallet.address);

  console.log({ balance: fromNano(balance) });
};

const main = async () => {
  await connectToWallet();
};

main();
