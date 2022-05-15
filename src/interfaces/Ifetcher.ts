/* eslint-disable import/no-unresolved */

export interface IFetcher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchEtherscanMethod(module: Module, action: string, params: Array<Param>): Promise<any>;

    getAccountBalance(address: string, tag?: Tag): Promise<BigInt>;
    getAccountsBalance(addresses: Array<string>, tag?: Tag): Promise<Array<{ account: string; balance: BigInt }>>;
}

export interface Param {
    name: string;
    value: string | string[];
}
export type Module = "account" | "contract" | "transaction" | "proxy" | "stats" | "gastracker";
export type Tag = "earliest" | "latest" | "pending";