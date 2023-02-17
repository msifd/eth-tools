import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { Wallet, providers } from "ethers";
import { buildCancelTx, buildReplacementTx } from "./tx-builders";
import { forTx } from "./waiter";

const requireEnv = (k: string): string => {
  const val = process.env[k];
  if (!val) throw new Error("Missing env: " + k);
  return val;
};

export class App {
  provider: providers.StaticJsonRpcProvider;
  signer: Wallet;

  constructor() {
    this.provider = new providers.StaticJsonRpcProvider(
      requireEnv("NODE_HTTP_URL")
    );
    this.signer = new Wallet(requireEnv("PRIVATE_KEY"), this.provider);
  }

  buildCancelTx = buildCancelTx;
  buildReplacementTx = buildReplacementTx;
  forTx = forTx;

  async getTx(txHash: string): Promise<TransactionResponse> {
    return this.provider.getTransaction(txHash);
  }

  async send(tx: TransactionRequest): Promise<TransactionResponse> {
    const res = await this.signer.sendTransaction(tx);
    console.log(await this.getEtherscanLink("tx/" + res.hash));
    return res;
  }

  async sendAndWait(tx: TransactionRequest): Promise<TransactionResponse> {
    const res = await this.signer.sendTransaction(tx);
    console.log(await this.getEtherscanLink("tx/" + res.hash));
    return await this.forTx(res.hash);
  }

  async printInfo() {
    console.log("Network:", (await this.provider.getNetwork()).name);
    console.log(
      "Signer:",
      await this.getEtherscanLink("address/" + this.signer.address)
    );
  }

  async getEtherscanLink(postfix: string = "") {
    const net = await this.provider.getNetwork();
    const host =
      net.chainId === 1
        ? "https://etherscan.io/"
        : "https://" + net.name + ".etherscan.io/";
    return host + postfix;
  }
}
