import { BigNumber, BigNumberish } from "ethers";

export const mul = (val: BigNumberish, ratio: number) =>
  BigNumber.from(val)
    .mul(ratio * 10000)
    .div(10000);
export const max = (a: BigNumber, b: BigNumberish) =>
  a.gt(b) ? a : BigNumber.from(b);
