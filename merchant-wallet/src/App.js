import './App.css';
import React, { Component } from 'react';
import { useState, useEffect } from 'react';
 import Web3 from 'web3';
 import Container from './components/Container';
 import { mnemonic } from './mnemonics/Mnemonics';
import Nav from './components/Nav';

 const bip39 = require('bip39');
 const hdkey = require('hdkey');
 const ethUtil = require('ethereumjs-util')

function App() {
  const [acc, setAcc] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [mnemonic, setMnemonic] = useState('');

  const appName = 'Merchant Wallet';
  let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  let pathid = 100;
  setMnemonic(mnemonic);
  const startBlockNumber = 0;

  const getAccountTransactions = async (accAddress) => {
    const endBlockNumber = await web3.eth.getBlockNumber();

    console.log("Searching for transactions to/from account \"" + accAddress + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
    
    for ( let i = endBlockNumber; i > 0; i--) {
      const block = await web3.eth.getBlock(i, true);
      //check if its not null
      if (block != null && block.transactions != null) {
        console.log(i + "loop");
        block.transactions.forEach(function(e) {
          if (accAddress === "*" || accAddress === e.to) {

            console.log(
              "  tx hash          : " + e.hash + "\n" +
              "   nonce           : " + e.nonce + "\n" +
              "   blockHash       : " + e.blockHash + "\n" +
              "   blockNumber     : " + e.blockNumber + "\n" +
              "   transactionIndex: " + e.transactionIndex + "\n" +
              "   from            : " + e.from + "\n" +
              "   to              : " + e.to + "\n" +
              "   value           : " + e.value + "\n" +
              "   gasPrice        : " + e.gasPrice + "\n" +
              "   gas             : " + e.gas + "\n" +
              "   input           : " + e.input
            );

            
            const hash = e.hash;
            const blockNumber = e.blockNumber;
            const transactionIndex = e.transactionIndex;
            const from = e.from;
            const value = e.value / 1000000000000000000;
            let confirmations;
            let cflag;

            if (i > e.blockNumber) {
              confirmations = endBlockNumber - e.blockNumber;

            };

            if (confirmations > 40) {
              cflag = "confirmed";
            } else {
              cflag = "unconfirmed";
            }

            const newTransaction = {
              transactionIndex,
              hash,
              blockNumber,
              from,
              value,
              confirmations,
              cflag
            };

            setTransactions(transactions=> [...transactions, newTransaction]);

          }
        });
      }
    }
    setAcc(accAddress);

  };

  useEffect(() => {
    async function componentDidMount() {
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = hdkey.fromMasterSeed(seed);
      let AccountsArr = [];

      for(let i = 0; i < pathid; i++) {
        const path =`m/44'/60'/0'/0/${i}`;
        const addrNode = root.derive(path);
        const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
        const addr = ethUtil.publicToAddress(pubKey).toString("hex");
        const address = ethUtil.toChecksumAddress(addr);

        const blnc = web3.eth.getBalance(address);
        let balance = blnc / 1000000000000000000;
        if (balance > 0) {
          AccountsArr.push({address, balance: balance});

        }
      }
      setAccounts(AccountsArr);
    }
    componentDidMount();
  }, [mnemonic, pathid, web3]);


  return (
    <div className="App">
      <Nav appName={appName}/>
      <Container 
        acc={acc}
        accounts={accounts}
        transactions={transactions}
        getAccountTransactions={getAccountTransactions}
      />
    </div>
  );
}

export default App;
