export interface IFetcher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchEtherscanMethod(module: Module, action: string, params: Array<Param>): Promise<any>;
    
}

export interface Param {
    name: string;
    value: string | string[];
}
export type Module = "account" | "contract" | "transaction" | "proxy" | "stats" | "gastracker";