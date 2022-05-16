/* eslint-disable import/no-unresolved */
export interface IFetcher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchEtherscanMethod(module: Module, action: string, params: Array<Param>): Promise<any>;

    /**
     * Retrieves the balance of an account.
     * @param address Address of the account
     * @returns Balance of the account as a BigInt
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-a-single-address)
     */
    getAccountBalance(address: string, tag?: Tag): Promise<BigInt>;

    /**
     * Retrievs balances of multiple accounts in a single API call.
     * @param addresses Array of addresses
     * @returns Adresses and their balances
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-multiple-addresses-in-a-single-call)
     */
    getAccountsBalance(addresses: Array<string>, tag?: Tag): Promise<Array<{ account: string; balance: BigInt }>>;

    /**
     * Retrieves all "normal" transactions of an account. Limit is 10 000 transactions.
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
     * Retrieves all "internal" transactions of an account. Limit is 10 000 transactions.
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
export type Module = "account" | "contract" | "transaction" | "proxy" | "stats" | "gastracker";
export type Tag = "earliest" | "latest" | "pending";
export type SortOption = "asc" | "desc";
