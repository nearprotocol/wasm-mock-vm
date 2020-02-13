let rust = require(".");
function toNum(x) { return parseInt(x.toString());}

// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function UTF8toStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}



function createImports(memory) {

  
  let I8 = () => new Uint8Array(memory.buffer);

    function readUTF8Str(ptr) {
      let buf = I8();
      let arr = [];
      while (b = buf[ptr] != 0) {
        arr.push(b);
        ptr++;
      }
      return UTF8toStr(arr);
    }

    // Returns whether the memory interval is completely inside the smart contract memory.
    global.fits_memory = function (offset, len) {
      return toNum(offset) + toNum(len) < I8().length;
    }

    // Reads the content of the given memory interval.
    //
    // # Panics
    //
    // If memory interval is outside the smart contract memory.
    global.read_memory =  function(offset, buffer) {
        buffer.set(I8().slice(toNum(offset), toNum(offset) + buffer.length), 0)
        
    };

    // Reads a single byte from the memory.
    //
    // # Panics
    //
    // If pointer is outside the smart contract memory.
    global.read_memory_u8 = function (offset) {
      return I8()[toNum(offset)];
    }

    // Writes the buffer into the smart contract memory.
    //
    // # Panics
    //
    // If `offset + buffer.len()` is outside the smart contract memory.
    global.write_memory = function(offset, buffer) {
        I8().set(buffer, toNum(offset));
    }

    const current_account_id = "alice"; 
    const signer_account_id = "bob";
    const signer_account_pk = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkLWK";
    const predecessor_account_id = "carol";
    const input = "{ arg1: 1 }";
    const block_index = 10;
    const block_timestamp = 42;
    const account_balance = 2;
    const account_locked_balance = 1;
    const storage_usage = 12;
    const attached_deposit = 2;
    const prepaid_gas = 10**(14);
    const random_seed = "HuxUynD5GdrcZ5MauxJuu74sGHgS6wLfCqqhQkLWK";
    const is_view = false;
    const output_data_receivers= new Uint8Array([]);


    context =  {
        /// The account id of the current contract that we are executing.
        current_account_id, // string
        /// The account id of that signed the original transaction that led to this
        /// execution.
        signer_account_id, // string
        /// The public key that was used to sign the original transaction that led to
        /// this execution.
        signer_account_pk,
        predecessor_account_id,
        input,
        block_index,
        block_timestamp,
        account_balance,
        account_locked_balance,
        storage_usage,
        attached_deposit,
        prepaid_gas,
        random_seed,
        is_view,
        output_data_receivers,
    }

    let vm = new rust.VM(context);

    return {
      vm: {
          saveState() {
            vm.save_state();
          },
          restoreState() {
              vm.restore_state();
          },
          setCurrent_account_id(s) {
            context.current_account_id = readUTF8Str(s);
            vm.set_context(context);
          },
          setInput(s) {
            context.input = readUTF8Str(s);
            vm.set_context(context);
          }
        },
        env: {
          panic(){},
          write_register(data_len, data_ptr, register_id) {
            return vm.write_register(data_len, data_ptr, register_id);
          },
          read_register(register_id, ptr) {
              return vm.read_register(register_id, ptr);
          },
          register_len(register_id) {
              return vm.register_len(register_id);
          },
          input(register_id) {
            return vm.input(register_id);
          },
          storage_write(key_len, key_ptr, value_len, value_ptr, register_id) {
            return vm.storage_write(key_len, key_ptr, value_len, value_ptr, register_id);
          },
          storage_read(key_len, key_ptr, register_id) {
            return vm.storage_read(key_len, key_ptr, register_id);
          },

  // ###############
  // # Context API #
  // ###############
          current_account_id(register_id) {
            return vm.current_account_id(register_id);
          },
          signer_account_id(register_id) {
            return vm.signer_account_id(register_id);
          },
          signer_account_pk(register_id) {
            return vm.signer_account_pk(register_id);
          },
          predecessor_account_id(register_id) {
            return vm.predecessor_account_id(register_id);
          },
          input(register_id) {
            return vm.input(register_id);
          },
          block_index() {
            return vm.block_index();
          },
          storage_usage() {
            return vm.storage_usage();
          },

  // #################
  // # Economics API #
  // #################
          account_balance(balance_ptr) {
            return vm.account_balance(balance_ptr);
          },
          attached_deposit(balance_ptr) {
            return vm.attached_deposit(balance_ptr);
          },
          prepaid_gas() {
            return vm.prepaid_gas();
          },
          used_gas() {
            return vm.used_gas();
          },

  // ############
  // # Math API #
  // ############
          random_seed(register_id) {
            return vm.random_seed(register_id);
          },
          sha256(value_len, value_ptr, register_id) {
            return vm.sha256(value_len, value_ptr, register_id);
          },
          keccak256(value_len, value_ptr, register_id) {
            return vm.keccak256(value_len, value_ptr, register_id);
          },
          keccak512(value_len, value_ptr, register_id) {
            return vm.keccak512(value_len, value_ptr, register_id);
          },

  // // #####################
  // // # Miscellaneous API #
  // // #####################
          value_return(value_len, value_ptr) {
            return vm.value_return(value_len, value_ptr);
          },
          panic() {
            return vm.panic();
          },
          log_utf8(len, ptr) {
            return vm.log_utf8(len, ptr);
          },
          log_utf16(len, ptr) {
            return vm.log_utf16(len, ptr);
          },

  // // ################
  // // # Promises API #
  // // ################
          promise_create(account_id_len,account_id_ptr,method_name_len,method_name_ptr,arguments_len, arguments_ptr, amount_ptr, gas) {
            return vm.promise_create(account_id_len,account_id_ptr,method_name_len,method_name_ptr,arguments_len, arguments_ptr, amount_ptr, gas);
          },
          promise_then( promise_index, account_id_len, account_id_ptr, method_name_len, method_name_ptr, arguments_len, arguments_ptr, amount_ptr, gas) {
            return vm.promise_then( promise_index, account_id_len, account_id_ptr, method_name_len, method_name_ptr, arguments_len, arguments_ptr, amount_ptr, gas);
          },
          promise_and(promise_idx_ptr, promise_idx_count) {
            return vm.promise_and(promise_idx_ptr, promise_idx_count);
          },
          promise_results_count() {
            return vm.promise_results_count();
          },
          promise_result(result_idx, register_id) {
            return vm.promise_result(result_idx, register_id);
          },
          promise_return(promise_id) {
            return vm.promise_return(promise_id);
          },
          promise_batch_create(account_id_len, account_id_ptr) {
            return vm.promise_batch_create(account_id_len, account_id_ptr);
          },
          promise_batch_then(promise_index, account_id_len, account_id_ptr) {
            return vm.promise_batch_then(promise_index, account_id_len, account_id_ptr);
          },

  // // #######################
  // // # Promise API actions #
  // // #######################
          promise_batch_action_create_account(promise_index) {
            return vm.promise_batch_action_create_account(promise_index);
          },
          promise_batch_action_deploy_contract(promise_index, code_len, code_ptr) {
            return vm.promise_batch_action_deploy_contract(promise_index, code_len, code_ptr);
          },
          promise_batch_action_function_call(promise_index, method_name_len, method_name_ptr, arguments_len, arguments_ptr, amount_ptr, gas) {
            return vm.promise_batch_action_function_call(promise_index, method_name_len, method_name_ptr, arguments_len, arguments_ptr, amount_ptr, gas);
          },
          promise_batch_action_transfer(promise_index, amount_ptr) {
            return vm.promise_batch_action_transfer(promise_index, amount_ptr);
          },
          promise_batch_action_stake(promise_index, amount_ptr, public_key_len, public_key_ptr) {
            return vm.promise_batch_action_stake(promise_index, amount_ptr, public_key_len, public_key_ptr);
          },
          promise_batch_action_add_key_with_full_access(promise_index, public_key_len, public_key_ptr, nonce) {
            return vm.promise_batch_action_add_key_with_full_access(promise_index, public_key_len, public_key_ptr, nonce);
          },
          promise_batch_action_add_key_with_function_call(promise_index, public_key_len, public_key_ptr, nonce, allowance_ptr, receiver_id_len, receiver_id_ptr, method_names_len, method_names_ptr) {
            return vm.promise_batch_action_add_key_with_function_call(promise_index, public_key_len, public_key_ptr, nonce, allowance_ptr, receiver_id_len, receiver_id_ptr, method_names_len, method_names_ptr);
          },
          promise_batch_action_delete_key(promise_index, public_key_len, public_key_ptr) {
            return vm.promise_batch_action_delete_key(promise_index, public_key_len, public_key_ptr);
          },
          promise_batch_action_delete_account(promise_index, beneficiary_id_len, beneficiary_id_ptr) {
            return vm.promise_batch_action_delete_account(promise_index, beneficiary_id_len, beneficiary_id_ptr);
          },

  // // ###############
  // // # Storage API #
  // // ###############
  //         storage_write(key_len, key_ptr, value_len, value_ptr, register_id) {
  //           return vm.storage_write(key_len, key_ptr, value_len, value_ptr, register_id);
  //         },
  //         storage_read(key_len, key_ptr, register_id) {
  //           return vm.storage_read(key_len, key_ptr, register_id);
  //         },
          storage_remove(key_len, key_ptr, register_id) {
            return vm.storage_remove(key_len, key_ptr, register_id);
          },
          storage_has_key(key_len, key_ptr) {
            return vm.storage_has_key(key_len, key_ptr);
          },
          storage_iter_prefix(prefix_len, prefix_ptr) {
            return vm.storage_iter_prefix(prefix_len, prefix_ptr);
          },
          storage_iter_range(start_len, start_ptr, end_len, end_ptr) {
            return vm.storage_iter_range(start_len, start_ptr, end_len, end_ptr);
          },
          storage_iter_next(iterator_id, key_register_id, value_register_id) {
            return vm.storage_iter_next(iterator_id, key_register_id, value_register_id);
          },
  // Function for the injected gas counter. Automatically called by the gas meter.
          gas(gas_amount) {
            return vm.gas(gas_amount);
          }
      }
  };
}
module.exports = {
     /**
   * A set of globs passed to the glob package that qualify typescript files for testing.
   */
  include: ["assembly/__tests__/**/*.spec.ts"],
  /**
   * A set of globs passed to the glob package that quality files to be added to each test.
   */
  add: ["assembly/__tests__/**/*.include.ts"],
  /**
   * All the compiler flags needed for this test suite. Make sure that a binary file is output.
   */
  flags: {
    "--validate": [],
    "--debug": [],
    /** This is required. Do not change this. The filename is ignored, but required by the compiler. */
    "--binaryFile": ["output.wasm"],
    /** To enable wat file output, use the following flag. The filename is ignored, but required by the compiler. */
    // "--textFile": ["output.wat"],
    /** To select an appropriate runtime, use the --runtime compiler flag. */
    "--runtime": ["stub"], // Acceptable values are: full, half, stub (arena), and none,
    "--baseDir": process.cwd(),
    "--runPasses": ["inlining,dce"],
    "--transform": ["near-bindgen-as"]
  },
  /**
   * A set of regexp that will disclude source files from testing.
   */
  disclude: [/node_modules/],
  /**
   * Add your required AssemblyScript imports here.
   */
  imports: createImports,
  /**
   * All performance statistics reporting can be configured here.
   */
  performance: {
    /** Enable performance statistics gathering for every test. */
    enabled: false,
    /** Set the maximum number of samples to run for every test. */
    maxSamples: 10000,
    /** Set the maximum test run time in milliseconds for every test. */
    maxTestRunTime: 2000,
    /** Report the median time in the default reporter for every test. */
    reportMedian: true,
    /** Report the average time in milliseconds for every test. */
    reportAverage: true,
    /** Report the standard deviation for every test. */
    reportStandardDeviation: false,
    /** Report the maximum run time in milliseconds for every test. */
    reportMax: false,
    /** Report the minimum run time in milliseconds for every test. */
    reportMin: false,
  },
  /**
   * Add a custom reporter here if you want one. The following example is in typescript.
   *
   * @example
   * import { TestReporter, TestGroup, TestResult, TestContext } from "as-pect";
   *
   * export class CustomReporter extends TestReporter {
   *   // implement each abstract method here
   *   public abstract onStart(suite: TestContext): void;
   *   public abstract onGroupStart(group: TestGroup): void;
   *   public abstract onGroupFinish(group: TestGroup): void;
   *   public abstract onTestStart(group: TestGroup, result: TestResult): void;
   *   public abstract onTestFinish(group: TestGroup, result: TestResult): void;
   *   public abstract onFinish(suite: TestContext): void;
   * }
   */
  // reporter: new CustomReporter(),
  /**
   * Specify if the binary wasm file should be written to the file system.
   */
  outputBinary: false
};

