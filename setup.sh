#!/bin/bash
CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}"
RUST_VERSION=nightly
if [[ -e nearcore ]]; then
    cd nearcore
    git pull
else
    git clone -b mock_vm_helper_methods https://github.com/nearprotocol/nearcore
fi

if [[ ! -e $CARGO_HOME ]]; then
    curl https://sh.rustup.rs -sSf | sh -s -- -y --no-modify-path --default-toolchain $RUST_VERSION
fi