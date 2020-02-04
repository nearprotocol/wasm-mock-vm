
use near_vm_logic::*; 

pub fn new_vm_context() -> VMContext {
    VMContext {
        current_account_id: "alice".to_owned(),
        signer_account_id: "bob".to_owned(),
        signer_account_pk: vec![0, 1, 2, 3, 4],
        predecessor_account_id: "carol".to_owned(),
        input: vec![0, 1, 2, 3, 5],
        block_index: 10,
        block_timestamp: 42,
        account_balance: 2u128,
        account_locked_balance: 1u128,
        storage_usage: 12,
        attached_deposit: 2u128,
        prepaid_gas: 10_u64.pow(14),
        random_seed: vec![0, 1, 2],
        is_view: false,
        output_data_receivers: vec![],
    }
}