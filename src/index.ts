/* eslint-disable import/no-unresolved */
import { API } from "./api";

async function main(): Promise<void> {
    const api = new API({
        key: [
            {
                key: "",
                plan: "free",
                limit: 5,
            },
            {
                key: "",
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
}
if (require.main === module) {
    void main();
}
export { API };
