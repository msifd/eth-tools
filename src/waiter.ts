import { App } from "./app";

type AppLike = Pick<App, "provider">;

const sleep = (msec: number) => new Promise((res) => setTimeout(res, msec));

const formatDuration = (ms: number) => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? "s" : ""}`)
    .join(", ");
};

export async function forTx(this: AppLike, txHash: string) {
  const start = new Date().valueOf();
  for (let i = 0; true; i++) {
    const tx = await this.provider.getTransaction(txHash);
    const progress = "|/-\\".charAt(i % 4);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    if (tx && tx.confirmations > 0) {
      return tx;
    }

    const passedMsec = new Date().valueOf() - start;
    process.stdout.write(progress + " " + formatDuration(passedMsec));

    await sleep(200);
  }
}
