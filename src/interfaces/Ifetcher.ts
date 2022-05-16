/* eslint-disable import/no-unresolved */
export interface IFetcher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchEtherscanMethod(module: Module, action: string, params: Array<Param>): Promise<any>;

    getAccountBalance(address: string, tag?: Tag): Promise<BigInt>;
    getAccountsBalance(addresses: Array<string>, tag?: Tag): Promise<Array<{ account: string; balance: BigInt }>>;

    getAccountNormalTransactions(
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<Transaction>>;
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
