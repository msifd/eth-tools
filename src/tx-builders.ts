import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { Transaction } from "ethers";
import { App } from "./app";
import { max, mul } from "./math";

type AppLike = Pick<App, "signer">;

export async function withReplacementGas(
  this: AppLike,
  tx: TransactionRequest,
  reference: Transaction
): Promise<TransactionRequest> {
  // re-estimate transaction gas prices if original was far too cheap
  const popTx = await this.signer.populateTransaction({
    ...tx,
    type: 2,

    // increase gasLimit by 5%
    gasLimit: mul(reference.gasLimit, 1.05),

    // clear to force re-estimate
    gasPrice: undefined,
    maxPriorityFeePerGas: undefined,
    maxFeePerGas: undefined,
  });

  // increase maxPriorityFeePerGas by 30% or greater
  popTx.maxPriorityFeePerGas = max(
    mul(reference.maxPriorityFeePerGas ?? popTx.maxPriorityFeePerGas!, 1.3),
    popTx.maxPriorityFeePerGas ?? 0
  );
  // increase maxFeePerGas by 40% or greater
  popTx.maxFeePerGas = max(
    mul(reference.maxFeePerGas ?? popTx.maxFeePerGas!, 1.4),
    popTx.maxFeePerGas ?? 0
  );

  return popTx;
}

export async function buildCancelTx(
  this: AppLike,
  original: TransactionResponse
): Promise<TransactionRequest> {
  const tx: TransactionRequest = {
    from: original.from,
    to: original.from,
    data: "0x",

    nonce: original.nonce,
  };
  return await withReplacementGas.call(this, tx, original);
}

export async function buildReplacementTx(
  this: AppLike,
  original: TransactionResponse
): Promise<TransactionRequest> {
  const tx: TransactionRequest = {
    from: original.from,
    to: original.to,
    data: original.data,
    value: original.value,

    nonce: original.nonce,
  };
  return await withReplacementGas.call(this, tx, original);
}
