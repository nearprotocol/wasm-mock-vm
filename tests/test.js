let rust = require("../pkg/wasm_mock_vm");

let vm = rust.VM.new();

debugger;

const memory = new Uint8Array(100);

  // Returns whether the memory interval is completely inside the smart contract memory.
global.fits_memory = (offset, len) => true;

  // Reads the content of the given memory interval.
  //
  // # Panics
  //
  // If memory interval is outside the smart contract memory.
global.read_memory = (offset, buffer) => memory[offset] = buffer[0];

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
global.write_memory = (offset, buffer) => {memory[offset] = buffer[0]}

let map = new Map();
map.set(BigInt(0), new Uint8Array([42]));
debugger;
vm.read_register(BigInt(0), BigInt(0), map);

debugger;
