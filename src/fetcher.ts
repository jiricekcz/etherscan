/* eslint-disable import/no-unresolved */
import axios from "axios";

import { IAPI } from "./interfaces/Iapi";
import {
    EtherscanResponse,
    IFetcher,
    Module,
    Param,
    SortOption,
    Tag,
    Transaction as FetcherTransaction,
    InternalTransaction as FetcherInternalTransaction,
} from "./interfaces/Ifetcher";
import {
    AccountBalanceResponse,
    AccountsBalanceResponse,
    InternalTransaction,
    InternalTransactionsRespose,
    NormalTransactionsRespose,
    Transaction,
} from "./types/endpoints";

export class Fetcher implements IFetcher {
    private readonly api: IAPI;
    constructor(api: IAPI) {
        this.api = api;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchEtherscanMethod(module: Module, action: string, params: Param[]): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.fetchEtherscanMethodOnce(module, action, params);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchEtherscanMethodOnce(module: Module, action: string, params: Param[]): Promise<EtherscanResponse> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestParams: any = {
            module,
            action,
            apiKey: this.api.key,
        };
        for (const param of params) {
            if (Array.isArray(param.value)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestParams[param.name] = param.value.join(",");
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestParams[param.name] = param.value;
            }
        }
        const response = await axios.get(this.api.url, {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            params: requestParams,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const data = response.data as EtherscanResponse;
        if (data.message !== "OK") throw new Error("Etherscan error: " + data.message);
        return data;
    }
    /**
     * Retrieves the balance of an account.
     * @param address Address of the account
     * @returns Balance of the account as a BigInt
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-a-single-address)
     */
    async getAccountBalance(address: string, tag: Tag = "latest"): Promise<BigInt> {
        const response: AccountBalanceResponse = (await this.fetchEtherscanMethod("account", "balance", [
            { name: "address", value: address },
            { name: "tag", value: tag },
        ])) as AccountBalanceResponse;
        return BigInt(response.result);
    }

    /**
     * Retrievs balances of multiple accounts in a single API call.
     * @param addresses Array of addresses
     * @returns Adresses and their balances
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-multiple-addresses-in-a-single-call)
     */
    async getAccountsBalance(
        addresses: string[],
        tag: Tag = "latest"
    ): Promise<{ account: string; balance: BigInt }[]> {
        const response: AccountsBalanceResponse = (await this.fetchEtherscanMethod("account", "balancemulti", [
            { name: "address", value: addresses },
            { name: "tag", value: tag },
        ])) as AccountsBalanceResponse;
        return response.result.map((result: { account: string; balance: string }) => ({
            account: result.account,
            balance: BigInt(result.balance),
        }));
    }

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
    async getAccountNormalTransactions(
        address: string,
        startBlock = 0,
        endblock = 1e7,
        page?: number | undefined,
        offset?: number | undefined,
        sort: SortOption = "desc"
    ): Promise<Array<FetcherTransaction>> {
        const response: NormalTransactionsRespose = (await this.fetchEtherscanMethod("account", "txlist", [
            { name: "address", value: address },
            { name: "startblock", value: startBlock.toString() },
            { name: "endblock", value: endblock.toString() },
            { name: "page", value: page?.toString() },
            { name: "offset", value: offset?.toString() },
            { name: "sort", value: sort },
        ])) as NormalTransactionsRespose;
        return response.result.map(parseNormalTransaction);
    }


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
    async getAccountInternalTransactions(
        address: string,
        startBlock = 0,
        endblock = 1e7,
        page?: number | undefined,
        offset?: number | undefined,
        sort: SortOption = "desc"
    ): Promise<Array<FetcherInternalTransaction>>{
        const response: InternalTransactionsRespose = (await this.fetchEtherscanMethod("account", "txlistinternal", [
            { name: "address", value: address },
            { name: "startblock", value: startBlock.toString() },
            { name: "endblock", value: endblock.toString() },
            { name: "page", value: page?.toString() },
            { name: "offset", value: offset?.toString() },
            { name: "sort", value: sort },
        ])) as InternalTransactionsRespose;
        return response.result.map(parseInternalTransaction);
    }
}
export function parseNormalTransaction(result: Transaction): FetcherTransaction {
    return {
        ...result,
        blockNumber: Number(result.blockNumber),
        timeStamp: new Date(Number(result.timeStamp) * 1000),
        transactionIndex: Number(result.transactionIndex),
        value: BigInt(result.value),
        gas: Number(result.gas),
        gasPrice: BigInt(result.gasPrice),
        cumulativeGasUsed: Number(result.cumulativeGasUsed),
        gasUsed: Number(result.gasUsed),
        confirmations: Number(result.confirmations),
        isError: result.isError === "1",
    };
}
export function parseInternalTransaction(result: InternalTransaction): FetcherInternalTransaction {
    return {
        ...result,
        blockNumber: Number(result.blockNumber),
        timeStamp: new Date(Number(result.timeStamp) * 1000),
        value: BigInt(result.value),
        gas: Number(result.gas),
        gasUsed: Number(result.gasUsed),
        isError: result.isError === "1",
    };
}