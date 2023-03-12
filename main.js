const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transaction, previousHash = "") {
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transaction) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    let x = 0;
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
      x++;
    }
    console.log("Block mined: " + this.hash);
    console.log("Loops: " + x);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransaction = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("12/3/2023", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //   addBlock(newBlock) {
  //     newBlock.previousHash = this.getLatestBlock().hash;
  //     newBlock.mineBlock(this.difficulty);
  //     this.chain.push(newBlock);
  //   }
  minePendingTransaction(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransaction);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransaction = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }
  createTransaction(transaction) {
    this.pendingTransaction.push(transaction);
  }
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transaction) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
}

let testCoin = new Blockchain();

testCoin.createTransaction(new Transaction("address1", "address2", 100));
testCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\nStarting the miner...");
testCoin.minePendingTransaction("Address-1");

console.log(
  "\nBalance of Address-1 is: ",
  testCoin.getBalanceOfAddress("Address-1")
);

//2

console.log("\nStarting the miner...");
testCoin.minePendingTransaction("Address-1");

console.log(
  "\nBalance of Address-1 is: ",
  testCoin.getBalanceOfAddress("Address-1")
);

// console.log("Mining block 1...");
// testCoin.addBlock(new Block("13/04/2023", { amount: 5 }));

// console.log("Mining block 2...");
// testCoin.addBlock(new Block("14/04/2023", { amount: 10 }));

// console.log(JSON.stringify(testCoin, null, 4));
