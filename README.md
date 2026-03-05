# @embroider/try

A tiny utility to support matrix testing.

## List

```sh
pnpx @embroider/try list
```

Processes your `.try.mjs` file and emits JSON that can be used in GitHub Actions to create your `strategy.matrix`.

## Apply

```sh
pnpx @embroider/try apply $SCENARIO_NAME
```

Applies a scenario to your project by editing package.json, etc. Run this command before the regular `pnpm install` or `npm install` in order to test differing dependencies.

## Config File: .try.mjs

```ts
export default interface {
  scenarios: Scenario[];
}
interface Scenario {
  name: string;

  // Values that will be merged into package.json:
  //
  //   npm: {
  //     devDependencies: {
  //       'ember-source': '^6.7.8'
  //     }
  //   }
  npm?: {
    devDependencies:  Record<string, string>;
    dependencies:     Record<string, string>;
    peerDependencies: Record<string, string>;
    overrides:        Record<string, string>;
  },

  // Files that will be (over)written with the given contents
  //
  //   files: {
  //     'tsconfig.json': '{ compilerOptions: {} }'
  //   }
  files?: Record<string, string>,
}
```
