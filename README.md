# eth-tools

1. Clone
2. Fill in values in `.env` file.
3. `yarn repl`
4. Type / copy-paste commands

## Cancel

```js
var tx = await getTx("0xa1045e82ca0fe9946495a229ed627935f052fc983892376d76af0baa526ea735");
var ctx = await buildCancelTx(tx);
ctx = await sendAndWait(ctx);
```

## Replace

```js
var tx = await getTx("0xc8b146359da3aa985ba4b165f93dcb346a1082d5e07fce0a5e84868505204e67");
var ctx = await buildReplacementTx(tx);
ctx = await sendAndWait(ctx);
```