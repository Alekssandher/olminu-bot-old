//Importanto dependencias

const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')

const bip32 = BIP32Factory(ecc)

const network = bitcoin.networks.bitcoin

const path = `m/49'/1'/0'/0`

function gerarCarteira() {
    let mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)

    let root = bip32.fromSeed(seed, network)

    let account = root.derivePath(path)
    let node = account.derive(0).derive(0)

    let btcAddress = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    }).address

    const wallet = {
        address: btcAddress,
        privateKey: node.toWIF(),
        seed: mnemonic
    };
    return wallet
}

module.exports = gerarCarteira