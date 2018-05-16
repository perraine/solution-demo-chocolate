#!/bin/bash
pushd ../reactor
rm supply-chain-bundle.zip
zip -r supply-chain-bundle.zip *  -x *node_modules/\* *.sh *.zip *test/\
popd
