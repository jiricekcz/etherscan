/* eslint-disable import/no-unresolved */
import { API } from "./api";

const api = new API({
    key: {
        key: "HFMUJQ51AW369SNAD7BYBDQSYTQXJYQI9S",
        plan: "free",
        limit: 5,
    },
    network: "mainnet",
});

async function main(): Promise<void> {
    console.log(await api.fetcher.getAccountBalance("0x936a3fe6b12d292a57f9dcdb94eaafd4a16a2277"))
}
void main();