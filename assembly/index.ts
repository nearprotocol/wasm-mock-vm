
//@ts-ignore
@external("vm", "saveState")
/** Saves the internal state of the VM. */
export declare function saveState(): void;

//@ts-ignore
@external("vm", "restoreState")
/** Restores the internal state of the VM. */
export declare function restoreState(): void;

//@ts-ignore
@external("vm", "setCurrent_account_id")
export declare function setCurrent_account_id(id: string): void;

//@ts-ignore
@external("vm", "setInput")
export declare function setInput(input: string): void;
