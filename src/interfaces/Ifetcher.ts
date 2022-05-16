/* eslint-disable import/no-unresolved */
/**
 * Fetcher is a class that provides basic JavaScript interface to the API.
 * Fetcher methods map 1 to 1 to API methods.
 */
export interface IFetcher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchEtherscanMethod(module: Module, action: string, params: Array<Param>): Promise<any>;

    /**
     * Returns the Ether balance of a given address.
     * @param address Address of the account
     * @returns Balance of the account as a BigInt
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-a-single-address)
     */
    getAccountBalance(address: string, tag?: Tag): Promise<BigInt>;

    /**
     * Returns the balance of the accounts from a list of addresses.
     * @param addresses Array of addresses
     * @returns Adresses and their balances
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-multiple-addresses-in-a-single-call)
     */
    getAccountsBalance(addresses: Array<string>, tag?: Tag): Promise<Array<{ account: string; balance: BigInt }>>;

    /**
     * Returns the list of transactions performed by an address, with optional pagination.
     * @param address Address of the account
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transactions
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-normal-transactions-by-address)
     */
    getAccountNormalTransactions(
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<Transaction>>;

    /**
     * Returns the list of internal transactions performed by an address, with optional pagination.
     * @param address Address of the account
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transactions
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-internal-transactions-by-address)
     */
    getAccountInternalTransactions(
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<InternalTransaction>>;

    /**
     * Returns the list of internal transactions performed within a transaction.
     * @param txHash Hash of the transaction
     * @returns Array of internal transactions perfromed within the transaction
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-internal-transactions-by-address)
     */
    getInternalTransactionsFromTransaction(txHash: string): Promise<Array<InternalTransaction>>;

    /**
     * Returns the list of internal transactions performed within a block range, with optional pagination.
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transactions
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-internal-transactions-by-block-range)
     */
    getInternalTransactionsFromBlockRange(
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<InternalTransaction>>;

    /**
     * Returns the list of ERC-20 tokens transferred by an address, with optional filtering by token contract.
     * @param contractAddress Adress of the ERC20 contract
     * @param address Account address
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transfer events
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc20-token-transfer-events-by-address)
     */
    getAccountERC20Transfers(
        contractAddress: string,
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<ERC20TransferEvent>>;

    /**
     * Returns the list of ERC-721 tokens transferred by an address, with optional filtering by token contract.
     * @param contractAddress Adress of the ERC721 contract
     * @param address Account address
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transfer events
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc721-token-transfer-events-by-address)
     */
    getAccountERC721Transfers(
        contractAddress: string,
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<ERC721TransferEvent>>;

    /**
     * Returns the list of blocks mined by an address.
     * @param address Address of the miner
     * @param blocktype Type of the blocks to return
     * @param page If you want to retrieve a specific page of blocks, set this to the page number.
     * @param offset Page size
     * @returns Array of blocks mined by the miner
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-list-of-blocks-mined-by-address)
     */
    getAccountMinedBlocks(
        address: string,
        blocktype?: BlockType,
        page?: number,
        offset?: number
    ): Promise<Array<BlockMineResult>>;
}

export interface Param {
    name: string;
    value: string | string[] | undefined;
}
export interface EtherscanResponse {
    status: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any;
}
export interface BlockMineResult {
    blockNumber: number;
    timeStamp: Date;
    blockReward: BigInt;
}
export interface Transaction {
    blockNumber: number;
    timeStamp: Date;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    value: BigInt;
    gas: number;
    gasPrice: BigInt;
    isError: boolean;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    confirmations: number;
}
export interface InternalTransaction {
    blockNumber: number;
    timeStamp: Date;
    hash: string;
    from: string;
    to: string;
    value: BigInt;
    contractAddress: string;
    input: string;
    type: string;
    gas: number;
    gasUsed: number;
    traceId: string;
    isError: boolean;
    errCode: string;
}
export interface ERC20TransferEvent {
    blockNumber: number;
    timeStamp: Date;
    hash: string;
    noonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: BigInt;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    transactionIndex: number;
    gas: number;
    gasPrice: BigInt;
    gasUsed: number;
    cumulativeGasUsed: number;
    input: string;
    confirmations: number;
}

export interface ERC721TransferEvent {
    blockNumber: number;
    timeStamp: Date;
    hash: string;
    noonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    tokenId: number;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    transactionIndex: number;
    gas: number;
    gasPrice: BigInt;
    gasUsed: number;
    cumulativeGasUsed: number;
    input: string;
    confirmations: number;
}
export type Module = "account" | "contract" | "transaction" | "proxy" | "stats" | "gastracker";
export type Tag = "earliest" | "latest" | "pending";
export type SortOption = "asc" | "desc";
export type BlockType = "blocks" | "uncles";
