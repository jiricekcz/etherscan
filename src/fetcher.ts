/* eslint-disable import/no-unresolved */
import axios from "axios";

import { IAPI } from "./interfaces/Iapi";
import { IFetcher, Module, Param, Tag } from "./interfaces/Ifetcher";
import { AccountBalanceResponse, AccountsBalanceResponse } from "./types/endpoints";

export class Fetcher implements IFetcher {
    private readonly api: IAPI;
    constructor(api: IAPI) {
        this.api = api;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchEtherscanMethod(module: Module, action: string, params: Param[]): Promise<any> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return await this.fetchEtherscanMethodOnce(module, action, params);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e?.response?.status === 429) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return await this.fetchEtherscanMethod(module, action, params);
                }
            } else {
                throw e;
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchEtherscanMethodOnce(module: Module, action: string, params: Param[]): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestParams: any = {
            module,
            action,
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
        return response.data;
    }

    async getAccountBalance(address: string, tag: Tag = "latest"): Promise<BigInt> {
        const response: AccountBalanceResponse = (await this.fetchEtherscanMethod("account", "balance", [
            { name: "address", value: address },
            { name: "tag", value: tag },
        ])) as AccountBalanceResponse;
        return BigInt(response.result);
    }

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
}
