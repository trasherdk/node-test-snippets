# node-test-snippets
Minimal code snippets to test stuff

# typescript examples

To launch ts code from command line, this seems to be the way:

```sh
node --experimental-specifier-resolution=node --loader ts-node/esm path/to/example/
```

`tsconfij.json` need the `module` and `target` set to something recent.
```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "module": "ESNext",
    "target": "ES2020"
  },
  "include": [
    "./**/*.ts"
  ]
}
```