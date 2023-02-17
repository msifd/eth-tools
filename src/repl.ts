require("dotenv").config();

import { BigNumber } from "ethers";
import { start, REPL_MODE_STRICT } from "repl";

import { App } from "./app";

(async () => {
  const app = new App();
  await app.printInfo();

  const server = start({
    replMode: REPL_MODE_STRICT,
    ignoreUndefined: true,
  });

  const context = server.context;
  context.BigNumber = BigNumber;
  context.app = app;
  context.provider = app.provider;
  context.signer = app.signer;
  context.getTx = (s: string) => app.getTx(s);
  context.forTx = (s: string) => app.forTx(s);
  context.send = (tx: any) => app.send(tx);
  context.sendAndWait = (tx: any) => app.sendAndWait(tx);
  context.buildCancelTx = (tx: any) => app.buildCancelTx(tx);
  context.buildReplacementTx = (tx: any) => app.buildReplacementTx(tx);
})().catch((e) => {
  throw e;
});
