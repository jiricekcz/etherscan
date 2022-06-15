/* eslint-disable import/no-unresolved */
import { API } from "./api";
import { RequestTimeTracker } from "./utils";
import { IAPI } from "./interfaces/Iapi";
import { IFetcher } from "./interfaces/Ifetcher";
import * as IFetcherInterfaces from "./interfaces/Ifetcher";
import { IProxyFetcher } from "./interfaces/IproxyFetcher";
import * as IproxyFetcherInterfaces from "./interfaces/IproxyFetcher";
async function main(): Promise<void> {
    const api = new API({
        key: [
            {
                key: "IS2FE1QQD3TN5KBQ14B5FVZ3J81AGXF46Q",
                plan: "free",
                limit: 5,
            },
        ],
        network: "mainnet",
    });
    console.log(
        await api.fetcher.getAccountsBalance([
            "0x936a3fe6b12d292a57f9dcdb94eaafd4a16a2277",
            "0x73124518c6a1e9f63D5867a0C06161963501D2Bf",
        ])
    );

    for (let i = 0; i < 9; i++) {
        void api.fetcher.getAccountBalance("0x936a3fe6b12d292a57f9dcdb94eaafd4a16a2277").then(console.log);
    }
    const tracker = new RequestTimeTracker(3, 2000);
    for (let i = 0; i < 9; i++) {
        console.log(`Setting: ${i}`);
        const a = async () => {
            await tracker.waitUntilRequestPossible();
            console.log(i);
        };
        void a();
    }
    await tracker.waitUntilRequestPossible();
}
if (require.main === module) {
    void main();
}
export { API, IAPI, IFetcher, IFetcherInterfaces, IProxyFetcher, IproxyFetcherInterfaces };
