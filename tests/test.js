let rust = require("../pkg/wasm_mock_vm");
let assert = require("assert");

const memory = new Uint8Array(100);

// Returns whether the memory interval is completely inside the smart contract memory.
global.fits_memory = (offset, len) => true;

// Reads the content of the given memory interval.
//
// # Panics
//
// If memory interval is outside the smart contract memory.
global.read_memory = (offset, buffer) => buffer[0] = memory[offset];

// Reads a single byte from the memory.
//
// # Panics
//
// If pointer is outside the smart contract memory.
global.read_memory_u8 = (offset) => memory[offset];

// Writes the buffer into the smart contract memory.
//
// # Panics
//
// If `offset + buffer.len()` is outside the smart contract memory.
global.write_memory = (offset, buffer) => {
    memory.set(buffer, offset.low);
}

let map = new Array();
map[0] = [0, new Uint8Array([42])];
let vm = new rust.VM({registers: map});


vm.read_register(BigInt(0), BigInt(0));
assert(memory[0] == 42);
memory[1] = 84;
vm.write_register(BigInt(0), BigInt(1), BigInt(1));
vm.read_register(BigInt(0), BigInt(0));
assert(memory[0] == 84);

class VMContext {
    /// The account id of the current contract that we are executing.
    current_account_id; // string
    /// The account id of that signed the original transaction that led to this
    /// execution.
    signer_account_id; // string
    /// The public key that was used to sign the original transaction that led to
    /// this execution.
    signer_account_pk; // Uint8Array
    /// If this execution is the result of cross-contract call or a callback then
    /// predecessor is the account that called it.
    /// If this execution is the result of direct execution of transaction then it
    /// is equal to `signer_account_id`.
    predecessor_account_id; // string
    
    /// The input to the contract call.
    input; //  Uint8Array Vec<u8>
    /// The current block index.
    block_index; // u64 BlockIndex
    /// The current block timestamp.
    block_timestamp; //u64

    /// The balance attached to the given account. Excludes the `attached_deposit` that was
    /// attached to the transaction.
    account_balance; //u128 Balance
    /// The balance of locked tokens on the given account.
    account_locked_balance; //u128 Balance
    /// The account's storage usage before the contract execution
    storage_usage; // u64 StorageUsage
    /// The balance that was attached to the call that will be immediately deposited before the
    /// contract execution starts.
    attached_deposit; // u128 Balance
    /// The gas attached to the call that can be used to pay for the gas fees.
    prepaid_gas; // u64
    /// Initial seed for randomness
    random_seed; // Uint8Array Vec<u8>
    /// Whether the execution should not charge any costs.
    is_view; //bool
    /// How many `DataReceipt`'s should receive this execution result. This should be empty if
    /// this function call is a part of a batch and it is not the last action.
    output_data_receivers; // string[]   Vec<AccountId>
}

// rust.set_context(new VMContext());

debugger;