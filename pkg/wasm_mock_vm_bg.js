
const path = require('path').join(__dirname, 'wasm_mock_vm_bg.wasm');
const bytes = require('fs').readFileSync(path);
let imports = {};
imports['./wasm_mock_vm.js'] = require('./wasm_mock_vm.js');

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
