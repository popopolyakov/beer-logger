import { configDotenv } from 'dotenv';
import { mnemonicToWalletKey } from '@ton/crypto';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import * as path from 'path';

console.log(`Hello World ${process.cwd()}`);

const envs = configDotenv({
  path: path.resolve(__dirname, '../.env.env'),
  debug: true,
}).parsed;

console.log(envs);

const connectToWallet = async () => {
  const mnemonic = envs.MNEMONIC_PHRASE;
  const key = await mnemonicToWalletKey(mnemonic.split(' '));

  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({ endpoint });

  // const seqNo = await wallet.getSeqno();

  const isContractDeployed = await client.isContractDeployed(wallet.address);

  if (!isContractDeployed) {
    console.log('Is contract not deployed');
  } else {
    console.log('Is contract deployed');
  }
};

const main = async () => {
  await connectToWallet();
};

main();
