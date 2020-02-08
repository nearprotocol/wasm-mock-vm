#! /usr/bin/sh
wasm-pack --verbose build --target nodejs --debug && node tests/test.js 