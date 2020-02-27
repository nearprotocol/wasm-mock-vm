import { u128 } from "near-runtime-ts";

export abstract class ReturnData {}

export class Value extends ReturnData {
  constructor(public data: string) { super(); }
}

export class ReceiptIndex extends  ReturnData {
  constructor(public index: u64) { super(); }
}

/// Method hasn't returned any data or promise.
export class None extends ReturnData {}

export const NONE = new None();

//@ts-ignore
@global
export const ValueID = idof<Value>();
//@ts-ignore
@global
export const ReceiptIndexID = idof<ReceiptIndex>();
//@ts-ignore
@global
export const NoneID = idof<None>();

export class Outcome {
  balance: u128;
  constructor(
  balance_lo: u64,
  balance_hi: u64,
  public burnt_gas: u64,
  public used_gas: u64,
  public logs: string[],
  public storage_usage: u64,
  public return_data: ReturnData,
  ){
    this.balance = new u128(balance_lo, balance_hi);
  }
}