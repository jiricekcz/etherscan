/* eslint-disable import/no-unresolved */

import { HexData } from "../hexData";

/**
 * ProxyFetcher is a specialiezed fetcher for Geth/Parity proxy to use with etherscan.
 * ProxyFetcher maps 1 to 1 with the API methods provieded by etherscan.
 * This fetcher implements the Geth/Parity proxy methods. Other methods are implemented in other fetchers.
 * Other fetchers are: ProFetcher for [Pro API methods](https://docs.etherscan.io/api-pro/api-pro) and Fetcher for standard methods.
 */
export interface IProxyFetcher {
    getBlockNumber(): Promise<number>;
    getBlock(blockNumber: number): Promise<Block>;
}

export interface Block {
    baseFeePerGas: BigInt;
    difficulty: BigInt;
    extraData: HexData;
    gasLimit: number;
    gasUsed: number;
    hash: string;
    logsBloom: HexData;
    miner: string;
    mixHash: string;
    nonce: string;
    number: number;
    parentHash: string;
    recieptRoot: string;
    sha3Uncles: string;
    size: number;
    stateRoot: string;
    timestamp: Date;
    totalDifficulty: BigInt;
    transactions: Array<string>;
    transactionsRoot: string;
    uncles: Array<string>;
}
