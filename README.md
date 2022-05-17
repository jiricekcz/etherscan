# Etherscan.js

Etherscan.js is a JavaScript library for interacting with the [Etherscan API](https://docs.etherscan.io/).

## Requirements
This library uses [Axios](https://www.npmjs.com/package/axios) for making HTTP requests. This means it is able to run in the browser and in Node.js.  
When running in the browser, be aware, that API keys are exposed to the client.


## Example 
```typescript
// Loads the library
import { API as Etherscan } from 'etherscan.js';

// Creates an instance of the API class with your key and network
const es = new Etherscan({
    key: {
        key: "YOUR_KEY_HERE",
        plan: "free"
        limit: 5
    },
    network: "mainnet"
});

// Retrieves account balance for an address using promises
console.log(await es.fetcher.getAccountBalance("0x2A20380DcA5bC24D052acfbf79ba23e988ad0050"))
```