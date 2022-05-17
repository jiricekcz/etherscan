/* eslint-disable import/no-unresolved */
/**
 * Fetcher is a class that provides basic JavaScript interface to the API.
 * Fetcher methods map 1 to 1 to API methods.
 * This (standard) fetcher implements the main methods of the Etherscan API. Other methods are implemented in other fetchers.
 * Other fetchers are: ProFetcher for [Pro API methods](https://docs.etherscan.io/api-pro/api-pro) and ProxyFetcher for [Geth/Parity proxy methods](https://docs.etherscan.io/api-endpoints/geth-parity-proxy).
 */
export interface IFetcher {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchEtherscanMethod(module: Module, action: string, params: Array<Param>): Promise<any>;

    /**
     * Returns the Ether balance of a given address.
     * @param address Address of the account
     * @returns Balance of the account as a BigInt
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-a-single-address)
     */
    getAccountBalance(address: string, tag?: Tag): Promise<BigInt>;

    /**
     * Returns the balance of the accounts from a list of addresses.
     * @param addresses Array of addresses
     * @returns Adresses and their balances
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-ether-balance-for-multiple-addresses-in-a-single-call)
     */
    getAccountsBalance(addresses: Array<string>, tag?: Tag): Promise<Array<{ account: string; balance: BigInt }>>;

    /**
     * Returns the list of transactions performed by an address, with optional pagination.
     * @param address Address of the account
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transactions
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-normal-transactions-by-address)
     */
    getAccountNormalTransactions(
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<Transaction>>;

    /**
     * Returns the list of internal transactions performed by an address, with optional pagination.
     * @param address Address of the account
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transactions
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-internal-transactions-by-address)
     */
    getAccountInternalTransactions(
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<InternalTransaction>>;

    /**
     * Returns the list of internal transactions performed within a transaction.
     * @param txHash Hash of the transaction
     * @returns Array of internal transactions perfromed within the transaction
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-internal-transactions-by-address)
     */
    getInternalTransactionsFromTransaction(txHash: string): Promise<Array<InternalTransaction>>;

    /**
     * Returns the list of internal transactions performed within a block range, with optional pagination.
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transactions
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-internal-transactions-by-block-range)
     */
    getInternalTransactionsFromBlockRange(
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<InternalTransaction>>;

    /**
     * Returns the list of ERC-20 tokens transferred by an address, with optional filtering by token contract.
     * @param contractAddress Adress of the ERC20 contract
     * @param address Account address
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transfer events
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc20-token-transfer-events-by-address)
     */
    getAccountERC20Transfers(
        contractAddress: string,
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<ERC20TransferEvent>>;

    /**
     * Returns the list of ERC-721 tokens transferred by an address, with optional filtering by token contract.
     * @param contractAddress Adress of the ERC721 contract
     * @param address Account address
     * @param startBlock Block at which to start the search. Defaults to 0
     * @param endblock Block at which to end the search. Defaults to 1e7
     * @param page If you want to retrieve a specific page of transactions, set this to the page number.
     * @param offset Page size
     * @param sort Sorting preference
     * @returns Array of transfer events
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc721-token-transfer-events-by-address)
     */
    getAccountERC721Transfers(
        contractAddress: string,
        address: string,
        startBlock?: number,
        endblock?: number,
        page?: number,
        offset?: number,
        sort?: SortOption
    ): Promise<Array<ERC721TransferEvent>>;

    /**
     * Returns the list of blocks mined by an address.
     * @param address Address of the miner
     * @param blocktype Type of the blocks to return
     * @param page If you want to retrieve a specific page of blocks, set this to the page number.
     * @param offset Page size
     * @returns Array of blocks mined by the miner
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/accounts#get-list-of-blocks-mined-by-address)
     */
    getAccountMinedBlocks(
        address: string,
        blocktype?: BlockType,
        page?: number,
        offset?: number
    ): Promise<Array<BlockMineResult>>;

    /**
     * Returns the Contract Application Binary Interface ( ABI ) of a verified smart contract.
     * @param address Address of the contract
     * @returns String abi of the contract
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/contracts#get-contract-abi-for-verified-contract-source-codes)
     */
    getContractABI(address: string): Promise<string>;

    /**
     * Returns the Solidity source code of a verified smart contract.
     * @param address Address of the contract
     * @returns String source code of the contract
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes)
     */
    getContractSource(address: string): Promise<ContractSource>;

    //TODO: source code verification (not main focus of this library, so development postponed)

    /**
     * Returns the status code of a contract execution.
     * @param txHash Hash of the transaction
     * @returns Status code of the transaction
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/stats#check-contract-execution-status)
     */
    getTransactionExecutionStatus(txHash: string): Promise<TransactionExecutionStatus>;

    /**
     * Returns the status code of a transaction execution.
     * @param txHash Hash of the transaction
     * @return Transaction receipt status
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/stats#check-transaction-receipt-status)
     */
    getTransactionReceiptStatus(txHash: string): Promise<boolean>;

    /**
     * Returns the block reward and 'Uncle' block rewards.
     * @param blockNumber The block number
     * @returns Block reward and uncle block rewards
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/blocks#get-block-and-uncle-rewards-by-blockno)
     */
    getBlockAndUncleReward(blockNumber: number): Promise<BlockAndUncleReward>;

    /**
     * Returns the estimated time remaining, in milliseconds, until a certain block is mined.
     * @param blockNumber The block number
     * @returns Estimated time remaining until a block is mined
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/blocks#get-estimated-block-countdown-time-by-blockno)
     */
    getEstimatedBlockCountdownTime(blockNumber: number): Promise<EstimatedBlockCountdownTime>;

    /**
     * Returns the block number that was mined at a certain timestamp.
     * @param timestamp Timestamp of the block
     * @returns Block number that was mined at a certain timestamp
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/blocks#get-block-number-by-timestamp)
     */
    getBlockNumberByTimestamp(timestamp: Date): Promise<number>;

    //TODO: logs

    /**
     * Returns the current amount of an ERC-20 token in circulation.
     * @param contractAddress Address of the ERC20 contract
     * @returns Amount of the ERC-20 token in circulation
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/tokens#get-erc20-token-totalsupply-by-contractaddress)
     */
    getTokenERC20TotalSupply(contractAddress: string): Promise<BigInt>;

    /**
     * Returns the current balance of an ERC-20 token of an address.
     * @param contractAddress Address of the ERC20 contract
     * @param address Adress of the account
     * @returns Balance of the ERC-20 token of an address
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/tokens#get-erc20-token-account-balance-for-tokencontractaddress)
     */
    getTokenERC20AccountBalance(contractAddress: string, address: string, tag?: Tag): Promise<BigInt>;

    /**
     * Returns the estimated time, in milliseconds, for a transaction to be confirmed on the blockchain.
     * @param gasprice The gas price to calculate the estimates for
     * @returns Estimated time, in milliseconds, for a transaction to be confirmed on the blockchain
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/gas-tracker#get-estimation-of-confirmation-time)
     */
    getGasConfirmationTimeEstimation(gasprice: BigInt): Promise<GasConfirmationTimeEstimation>;

    /**
     * Returns the current Safe, Proposed and Fast gas prices.
     * @returns Current Safe, Proposed and Fast gas prices
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/gas-tracker#get-gas-oracle)
     */
    getGasOracle(): Promise<GasOracle>;

    /**
     * Returns the current amount of Ether in circulation excluding ETH2 Staking rewards and EIP1559 burnt fees.
     * @returns Amount of Ether in circulation excluding ETH2 Staking rewards and EIP1559 burnt fees
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/stats-1#get-total-supply-of-ether)
     */
    getTotalETHSupply(): Promise<BigInt>;

    /**
     * Returns the current amount of Ether in circulation, ETH2 Staking rewards and EIP1559 burnt fees statistics.
     * @returns Amount of Ether in circulation, ETH2 Staking rewards and EIP1559 burnt fees statistics
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/stats-1#get-total-supply-of-ether-2)
     */
    getTotalETH2Supply(): Promise<ETH2Supply>;

    /**
     * Returns the latest price of 1 ETH.
     * @returns Latest price of 1 ETH
     * @link [Etherscan Docs](https://docs.etherscan.io/api-endpoints/stats-1#get-ether-last-price)
     */
    getETHPrice(): Promise<ETHPrice>;
    // TODO: Ethereum Nodes Size
}

// TODO: Docs for properties
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
export interface BlockMineResult {
    blockNumber: number;
    timeStamp: Date;
    blockReward: BigInt;
}
export interface TransactionExecutionStatusSuccess {
    isError: false;
}
export interface TransactionExecutionStatusFailure {
    isError: true;
    errorMessage: string;
}
export type TransactionExecutionStatus = TransactionExecutionStatusSuccess | TransactionExecutionStatusFailure;
export interface EstimatedBlockCountdownTime {
    currentBlock: number;
    countdownBlock: number;
    remainingBlocks: number;
    /**
     * The time in milliseconds until the countdown block is mined
     */
    estimatedTimeInMilliseconds: number;
    estimatedMineTimestamp: Date;
}
export interface GasConfirmationTimeEstimation {
    estimatedTimeInMilliseconds: number;
    estimatedMineTimestamp: Date;
}
export interface GasOracle {
    lastBlock: number;
    safeGasPrice: BigInt;
    proposeGasPrice: BigInt;
    fastGasPrice: BigInt;
    suggestBaseFee: number;
    gasUsedRatio: string;
}
export interface ETHPrice {
    usdPerEth: number;
    btcPerEth: number;
    usdTimestamp: Date;
    btcTimestamp: Date;
}
export interface ETH2Supply {
    ethSupply: BigInt;
    eth2Staking: BigInt;
    burntFees: BigInt;
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
export interface ERC20TransferEvent {
    blockNumber: number;
    timeStamp: Date;
    hash: string;
    noonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: BigInt;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    transactionIndex: number;
    gas: number;
    gasPrice: BigInt;
    gasUsed: number;
    cumulativeGasUsed: number;
    input: string;
    confirmations: number;
}

export interface ERC721TransferEvent {
    blockNumber: number;
    timeStamp: Date;
    hash: string;
    noonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    tokenID: number;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    transactionIndex: number;
    gas: number;
    gasPrice: BigInt;
    gasUsed: number;
    cumulativeGasUsed: number;
    input: string;
    confirmations: number;
}
export interface ContractSource {
    sourceCode: string;
    ABI: string;
    contractName: string;
    compilerVersion: string;
    optimizationUsed: boolean;
    runs: number;
    constructorArguments: string;
    EVMVersion: string;
    library: string;
    licenseType: string;
    proxy: number;
    implementation: string;
    swarmSource: string;
}
export interface BlockAndUncleReward {
    blockNumber: number;
    blockReward: BigInt;
    miner: string;
    timeStamp: Date;
    uncles: Array<UncleBlockReward>;
    uncleInlusionReward: BigInt;
}
export interface UncleBlockReward {
    miner: string;
    unclePosition: number;
    blockReward: BigInt;
}
export type Module = "account" | "contract" | "transaction" | "proxy" | "stats" | "gastracker" | "block";
export type Tag = "earliest" | "latest" | "pending";
export type SortOption = "asc" | "desc";
export type BlockType = "blocks" | "uncles";
