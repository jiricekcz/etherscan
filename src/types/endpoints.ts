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
export interface InternalTransactionsRespose {
    status: string;
    message: string;
    result: InternalTransaction[];
}
export interface ERC20TransferEventsResponse {
    status: string;
    message: string;
    result: ERC20TransferEvent[];
}
export interface ERC721TransferEventsResponse {
    status: string;
    message: string;
    result: ERC721TransferEvent[];
}
export interface BlocksMinedResponse {
    status: string;
    message: string;
    result: {
        blockNumber: string;
        timeStamp: string;
        blockReward: string;
    }[];
}
export interface ABIResponse {
    status: string;
    message: string;
    result: string;
}
export interface ContractSourceResponse {
    status: string;
    message: string;
    result: ContractSource;
}
export interface TransactionExecutionStatusResponse {
    status: string;
    message: string;
    result: {
        isError: string;
        errDescription: string;
    };
}
export interface TransactionReceiptStatusResponse {
    status: string;
    message: string;
    result: string;
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
export interface InternalTransaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    from: string;
    to: string;
    value: string;
    contractAddress: string;
    input: string;
    type: string;
    gas: string;
    gasUsed: string;
    traceId: string;
    isError: string;
    errCode: string;
}
export interface ERC20TransferEvent {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    noonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    confirmations: string;
    input: string;
}
export interface ERC721TransferEvent {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    noonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    tokenID: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    confirmations: string;
    input: string;
}
export interface ContractSource {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
}
export interface UncleReward {
    miner: string;
    unclePosition: string;
    blockreward: string;
}
export interface BlockAndUncleReward {
    blockNumber: string;
    timeStamp: string;
    blockMiner: string;
    blockReward: string;
    uncles: UncleReward[];
    uncleInclusionReward: string;
}
export interface BlockAndUncleRewardResponse {
    status: string;
    message: string;
    result: BlockAndUncleReward;
}
export interface EstimatedBlockCountdownTime {
    CurrentBlock: string;
    CountdownBlock: string;
    RemainingBlock: string;
    EstimateTimeInSec: string;
}
export interface EstimatedBlockCountdownTimeResponse {
    status: string;
    message: string;
    result: EstimatedBlockCountdownTime;
}
export interface BlockNumberResponse {
    status: string;
    message: string;
    result: string;
}
export interface ERC20VolumeResponse {
    status: string;
    message: string;
    result: string;
}
export interface GasConfirmationTimeEstimationResponse {
    status: string;
    message: string;
    result: string;
}
export interface GasOracle {
    LastBlock: string;
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    suggestBaseFee: string;
    gasUsedRatio: string;
}
export interface GasOracleResponse {
    status: string;
    message: string;
    result: GasOracle;
}
export interface TotalETHSupplyResponse {
    status: string;
    message: string;
    result: string;
}
export interface ETH2Supply {
    EthSupply: string;
    Eth2Staking: string;
    BurntFees: string;
}
export interface ETH2SupplyResponse {
    status: string;
    message: string;
    result: ETH2Supply;
}
export interface ETHPrice {
    ethbtc: string;
    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
}
export interface ETHPriceResponse {
    status: string;
    message: string;
    result: ETHPrice;
}
