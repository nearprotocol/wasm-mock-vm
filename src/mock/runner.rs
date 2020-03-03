
use js_sys::{Function, Object, Reflect, WebAssembly};
use wasm_bindgen::prelude::*;
// use wasm_bindgen::JsCast;
// use near-vm-runner::*;

// use wasm_bindgen_futures::, JsFuture};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);

    #[wasm_bindgen]
    fn run_binary(bin: &[u8], method: &str) -> u64;
}


macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

const WASM: &[u8] = include_bytes!("add.wasm");

fn run_wasm(wasm: &[u8]) -> Result<(), JsValue> {
    console_log!("instantiating a new wasm module directly");
    
    console_log!("1 + 2 = {}", run_binary(wasm, &"add"));

    // let b: WebAssembly::Instance = WebAssembly::Instance::new(&module, &Object::new()).unwrap();

    // let c = b.exports();

    // let add = Reflect::get(c.as_ref(), &"add".into())?
    //     .dyn_into::<Function>()
    //     .expect("add export wasn't a function");

    // let three = add.call2(&JsValue::undefined(), &1.into(), &2.into())?;
    // console_log!("1 + 2 = {:?}", three);
    // let mem = Reflect::get(c.as_ref(), &"memory".into())?
    //     .dyn_into::<WebAssembly::Memory>()
    //     .expect("memory export wasn't a `WebAssembly.Memory`");
    // console_log!("created module has {} pages of memory", mem.grow(0));
    // console_log!("giving the module 4 more pages of memory");
    // mem.grow(4);
    // console_log!("now the module has {} pages of memory", mem.grow(0));
    Ok(())
}

#[wasm_bindgen]
pub fn run(wasm_bin: JsValue) {
  let arr: Vec<u8> = serde_wasm_bindgen::from_value(wasm_bin).unwrap();
  run_wasm(&arr).unwrap_throw();
}