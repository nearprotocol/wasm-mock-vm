/// <reference no-default-lib="true"/>
/// <reference types="./__tests__/as-pect" />

import { u128 } from "bignum";

/**
 * Methods on the current VM
 */
export namespace VM {
  //@ts-ignore
  @external("vm", "saveState")
  /** 
   * Saves the internal state of the VM. 
   * */
  export declare function saveState(): void;

  //@ts-ignore
  @external("vm", "restoreState")
  /** 
   * Restores the internal state of the VM. 
   * 
   */
  export declare function restoreState(): void;
}

//@ts-ignore
@external("vm", "setCurrent_account_id")
declare function _setCurrent_account_id(id: usize): void;

//@ts-ignore
@external("vm", "setInput")
declare function _setInput(input: usize): void;

//@ts-ignore
@external("vm", "setSigner_account_id")
declare function _setSigner_account_id(s: usize): void;
/// The public key that was used to sign the original transaction that led to
/// this execution.
//@ts-ignore
@external("vm", "setSigner_account_pk")
declare function _setSigner_account_pk(s: usize): void;
//@ts-ignore
@external("vm", "setPredecessor_account_id")
declare function _setPredecessor_account_id(s: usize): void;
//@ts-ignore
@external("vm", "setRandom_seed")
declare function _setRandom_seed(s: usize): void;

//@ts-ignore
@external("vm", "setAttached_deposit")
declare function _setAttached_deposit(lo: u64, hi: u64): void;

//@ts-ignore
@external("vm", "setAccount_balance")
declare function _setAccount_balance(lo: u64, hi: u64): void;

//@ts-ignore
@external("vm", "setAccount_locked_balance")
declare function _setAccount_locked_balance(lo: u64, hi: u64): void;

/**
 * Functions to edit the current VM's context
 */
export namespace Context {

  //@ts-ignore
  @external("vm", "saveContext")
  export declare function saveContext(): void;

  //@ts-ignore
  @external("vm", "restoreContext")
  export declare function restoreContext(): void;

  export function setCurrent_account_id(id: string): void {
    _setCurrent_account_id(changetype<usize>(String.UTF8.encode(id)));
  }

  export function setInput(input: string): void {
    _setInput(changetype<usize>(String.UTF8.encode(input)));
  }

  export function setSigner_account_id(s: string): void {
    _setSigner_account_id(changetype<usize>(String.UTF8.encode(s)));
  }
  /// The public key that was used to sign the original transaction that led to
  /// this execution.
  export function setSigner_account_pk(s: string): void {
    _setSigner_account_pk(changetype<usize>(String.UTF8.encode(s)));
  }
  export function setPredecessor_account_id(s: string): void {
    _setPredecessor_account_id(changetype<usize>(String.UTF8.encode(s)));
  }
  //@ts-ignore
  @external("vm", "setBlock_index")
  export declare function setBlock_index(block_height: u64): void;
  //@ts-ignore
  @external("vm", "setBlock_timestamp")
  export declare function setBlock_timestamp(stmp: u64): void;

  export function setAccount_balance(_u128: u128): void {
    _setAccount_balance(_u128.lo, _u128.hi);
  }

  export function setAccount_locked_balance(_u128: u128): void {
    _setAccount_locked_balance(_u128.lo, _u128.hi);
  }
  //@ts-ignore
  @external("vm", "setStorage_usage")
  export declare function setStorage_usage(amt: u64): void;

  export function setAttached_deposit(_u128: u128): void {
    _setAttached_deposit(_u128.lo, _u128.hi);
  }

  //@ts-ignore
  @external("vm", "setPrepaid_gas")
  export declare function setPrepaid_gas(_u64: u64): void;

  export function setRandom_seed(s: string): void {
    _setRandom_seed(changetype<usize>(String.UTF8.encode(s)));
  }
  //@ts-ignore
  @external("vm", "setIs_view")
  export declare function setIs_view(b: bool): void;
  //@ts-ignore
  @external("vm", "setOutput_data_receivers")
  export declare function setOutput_data_receivers(arrA: Array<string>): void;
}