# nearcore's VMlogic compiled to WebAssembly

Near smart contracts have access to a runtime API to interact with the host.  Nearcore is written in Rust, which means it can be compiled into WebAsssembly.  By compiling the core VM logic, a mock version of the runtime can be used to test smart contracts without the overhead of running a local node or using the testnet.

Currently rust smart contracts are unit tested by compiling the contract alongside the runtime since they are both in the same language.  This solution shares the same memory at runtime, where as in the actual VM there is a separation between the host memory and the contract's memory.  

This project uses `wasm-bindgen`, to create javascript bindings for the generated WebAssembly, which then can used along side the [`as-pect`](https://github.com/jtenner/as-pect) to write unit tests in AssemblyScript.

# Setup

## Node Version 
Since the runtime uses `u64`, it requires the use of the node flag ` --experimental-wasm-bigint`, which is included by default in `imports.js` of this project, however, this still requires a version of node >= v12.0.0.

## Installation 

In a blank Near AssemblyScript project you need to install the following dependencies:

```
npm install --save-dev wasm-mock-vm @as-pect/cli

```

Next set up `as-pect` with its init command.

```
npx asc --init
```

This creates a `__tests__` folder and a `as-pect.config.js` file in the root of your project. Replace the contents of the `as-pect.config.js` with

```
module.exports = require("wasm-mock-vm/imports");
```
This will configure mock Near VM and `as-pect`.

## Setting up Types
To ensure that the types added by the runtime library are detected by your IDE include a type declaration file in your root `assembly` folder, e.g. `assembly/types.d.ts` with the following line:
```
/// <reference types="near-runtime-ts/assembly/as_types" />
```

# Example Usage

In `assembly/contract.ts`:
```ts
//@nearfile

export class Contract {
  constructor(public name: string) {}
}

```

and `assembly/__tests__/contract.spec.ts`

```ts
import { storage } from "near-runtime-ts";
import { Contract } from "../contract";

describe("Contract", () => {
  it("should be able to be stored and retrieved", () => {
    const contract = new Contract("unique name!");
    storage.set("contract", contract);
    const otherContract = storage.get<Contract>("contract");
    expect(otherContract.name).toBe(contract.name, "contracts should have the same name");
    expect(otherContract.name).not.toBe("", "retrieved contract's name should not be the empty string");
  });
});

```

# API

By default the context used by the VM is a local `context.json` file.  It first looks in the project's `assembly/__test__` folder, then the project's root folder, and finally will read the default file in this project's root.

Each runtime API call by default updates the state of the VM.  So in the example above any tests run after it will have "contract" in the storage.  To prevent this there is an API to save and restore the state.  `as-pect` has special functions to run before and after tests, e.g. `beforeAll/beforeEach`.

```ts
import { storage } from "near-runtime-ts";
import { Contract } from "../contract";
import { VM } from "wasm-mock-vm";

describe("Contract", () => {

  beforeEach(() => {
    VM.saveState();
  });

  afterEach(() => {
    VM.restoreState();
  });
  
  it("should be able to be stored and retrieved", () => {
    const contract = new Contract("unique name!");
    storage.set("contract", contract);
    const otherContract = storage.get<Contract>("contract");
    expect(contract.name).toBe(otherContract.name, "contracts should have the same name");
    expect(contract.name).toBe("", "contracts should have the same name");
  });

  it("state should not contain updates of previous test", () => {
    expect(storage.contain("contract")).toBe(false, "contract shouldn't exist is original storage");
  });
});
```

The state also includes the registers that the runtime uses to store values in the host memory.



