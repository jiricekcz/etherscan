export interface AccountBalanceResponse {
    status: string;
    message: string;
    result: string;
}
export interface AccountsBalanceResponse {
    status: string;
    message: string;
    result: { account: string; balance: string }[];
}
export interface NormalTransactionsRespose {
    status: string;
    message: string;
    result: Transaction[];
}
export interface Transaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
}