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
    ERC20TransferEvent as FetcherERC20TransferEvent,
    ERC721TransferEvent as FetcherERC721TransferEvent,
    BlockMineResult,
    BlockType,
    ContractSource as FetcherContractSource,
    TransactionExecutionStatus as FetcherTransactionExecutionStatus,
    BlockAndUncleReward as FetcherBlockAndUncleReward,
    EstimatedBlockCountdownTime as FetcherEstimatedBlockCountdownTime,
    GasConfirmationTimeEstimation,
    GasOracle,
    ETH2Supply,
    ETHPrice,
} from "./interfaces/Ifetcher";
import {
    AccountBalanceResponse,
    AccountsBalanceResponse,
    ERC20TransferEventsResponse,
    InternalTransaction,
    InternalTransactionsRespose,
    NormalTransactionsRespose,
    Transaction,
    ERC20TransferEvent,
    ERC721TransferEvent,
    ERC721TransferEventsResponse,
    BlocksMinedResponse,
    ContractSource,
    ABIResponse,
    ContractSourceResponse,
    TransactionExecutionStatusResponse,
    TransactionReceiptStatusResponse,
    BlockAndUncleRewardResponse,
    EstimatedBlockCountdownTimeResponse,
    BlockNumberResponse,
    ERC20VolumeResponse,
    GasConfirmationTimeEstimationResponse,
    GasOracleResponse,
    TotalETHSupplyResponse,
    ETH2SupplyResponse,
    ETHPriceResponse,
} from "./types/endpoints";

export class Fetcher implements IFetcher {
    private readonly api: IAPI;
    constructor(api: IAPI) {
        this.api = api;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchEtherscanMethod(module: Module, action: string, params?: Param[]): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.fetchEtherscanMethodOnce(module, action, params);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchEtherscanMethodOnce(module: Module, action: string, params: Param[] = []): Promise<EtherscanResponse> {
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

    async getAccountNormalTransactions(
        address: string,
        startBlock = 0,
        endblock = 1e17,
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

    async getAccountInternalTransactions(
        address: string,
        startBlock = 0,
        endblock = 1e17,
        page?: number | undefined,
        offset?: number | undefined,
        sort: SortOption = "desc"
    ): Promise<Array<FetcherInternalTransaction>> {
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
    async getInternalTransactionsFromTransaction(txHash: string): Promise<FetcherInternalTransaction[]> {
        const response: InternalTransactionsRespose = (await this.fetchEtherscanMethod("account", "txlistinternal", [
            { name: "txhash", value: txHash },
        ])) as InternalTransactionsRespose;
        return response.result.map(parseInternalTransaction);
    }

    async getInternalTransactionsFromBlockRange(
        startBlock = 0,
        endblock = 1e17,
        page?: number | undefined,
        offset?: number | undefined,
        sort: SortOption = "desc"
    ): Promise<FetcherInternalTransaction[]> {
        const response: InternalTransactionsRespose = (await this.fetchEtherscanMethod("account", "txlistinternal", [
            { name: "startblock", value: startBlock.toString() },
            { name: "endblock", value: endblock.toString() },
            { name: "page", value: page?.toString() },
            { name: "offset", value: offset?.toString() },
            { name: "sort", value: sort },
        ])) as InternalTransactionsRespose;
        return response.result.map(parseInternalTransaction);
    }

    async getAccountERC20Transfers(
        contractAddress: string,
        address: string,
        startBlock = 0,
        endblock = 1e17,
        page?: number | undefined,
        offset?: number | undefined,
        sort: SortOption = "desc"
    ): Promise<FetcherERC20TransferEvent[]> {
        const response: ERC20TransferEventsResponse = (await this.fetchEtherscanMethod("account", "tokentx", [
            { name: "contractaddress", value: contractAddress },
            { name: "address", value: address },
            { name: "startblock", value: startBlock?.toString() },
            { name: "endblock", value: endblock?.toString() },
            { name: "page", value: page?.toString() },
            { name: "offset", value: offset?.toString() },
            { name: "sort", value: sort },
        ])) as ERC20TransferEventsResponse;
        return response.result.map(parseERC20Transfer);
    }

    async getAccountERC721Transfers(
        contractAddress: string,
        address: string,
        startBlock?: number | undefined,
        endblock?: number | undefined,
        page?: number | undefined,
        offset?: number | undefined,
        sort?: SortOption | undefined
    ): Promise<FetcherERC721TransferEvent[]> {
        const response: ERC721TransferEventsResponse = (await this.fetchEtherscanMethod("account", "tokennfttx", [
            { name: "contractaddress", value: contractAddress },
            { name: "address", value: address },
            { name: "startblock", value: startBlock?.toString() },
            { name: "endblock", value: endblock?.toString() },
            { name: "page", value: page?.toString() },
            { name: "offset", value: offset?.toString() },
            { name: "sort", value: sort },
        ])) as ERC721TransferEventsResponse;
        return response.result.map(parseERC721Transfer);
    }

    async getAccountMinedBlocks(
        address: string,
        blocktype: BlockType = "blocks",
        page?: number | undefined,
        offset?: number | undefined
    ): Promise<BlockMineResult[]> {
        const response: BlocksMinedResponse = (await this.fetchEtherscanMethod("account", "getminedblocks", [
            { name: "address", value: address },
            { name: "blocktype", value: blocktype },
            { name: "page", value: page?.toString() },
            { name: "offset", value: offset?.toString() },
        ])) as BlocksMinedResponse;
        return response.result.map((r) => {
            return {
                blockNumber: Number(r.blockNumber),
                timeStamp: new Date(Number(r.timeStamp) * 1000),
                blockReward: BigInt(r.blockReward),
            };
        });
    }

    async getContractABI(address: string): Promise<string> {
        const response: ABIResponse = (await this.fetchEtherscanMethod("contract", "getabi", [
            { name: "address", value: address },
        ])) as ABIResponse;
        return response.result;
    }

    async getContractSource(address: string): Promise<FetcherContractSource> {
        const response: ContractSourceResponse = (await this.fetchEtherscanMethod("contract", "getsourcecode", [
            { name: "address", value: address },
        ])) as ContractSourceResponse;
        return parseContractSource(response.result);
    }

    async getTransactionExecutionStatus(txHash: string): Promise<FetcherTransactionExecutionStatus> {
        const response: TransactionExecutionStatusResponse = (await this.fetchEtherscanMethod(
            "transaction",
            "getstatus",
            [{ name: "txhash", value: txHash }]
        )) as TransactionExecutionStatusResponse;
        return parseTransactionExecutionStatus(response.result);
    }

    async getTransactionReceiptStatus(txHash: string): Promise<boolean> {
        const response: TransactionReceiptStatusResponse = (await this.fetchEtherscanMethod(
            "transaction",
            "getstatus",
            [{ name: "txhash", value: txHash }]
        )) as TransactionReceiptStatusResponse;
        return response.result === "1";
    }

    async getBlockAndUncleReward(blockNumber: number): Promise<FetcherBlockAndUncleReward> {
        const response: BlockAndUncleRewardResponse = (await this.fetchEtherscanMethod("block", "getblockreward", [
            { name: "blockno", value: blockNumber.toString() },
        ])) as BlockAndUncleRewardResponse;
        return parseBlockAndUncleReward(response.result);
    }

    async getEstimatedBlockCountdownTime(blockNumber: number): Promise<FetcherEstimatedBlockCountdownTime> {
        const response: EstimatedBlockCountdownTimeResponse = (await this.fetchEtherscanMethod(
            "block",
            "getblockcountdown",
            [{ name: "blockno", value: blockNumber.toString() }]
        )) as EstimatedBlockCountdownTimeResponse;
        return parseEstimatedBlockCountdownTime(response.result);
    }

    async getBlockNumberByTimestamp(timestamp: Date): Promise<number> {
        const response: BlockNumberResponse = (await this.fetchEtherscanMethod("block", "getblocknobytime", [
            { name: "timestamp", value: Math.round(timestamp.getTime() / 1000).toString() },
        ])) as BlockNumberResponse;
        return Number(response.result);
    }

    async getTokenERC20TotalSupply(contractAddress: string): Promise<BigInt> {
        const response: ERC20VolumeResponse = (await this.fetchEtherscanMethod("stats", "tokensupply", [
            { name: "contractaddress", value: contractAddress },
        ])) as ERC20VolumeResponse;
        return BigInt(response.result);
    }

    async getTokenERC20AccountBalance(contractAddress: string, address: string, tag: Tag = "latest"): Promise<BigInt> {
        const response: ERC20VolumeResponse = (await this.fetchEtherscanMethod("account", "tokenbalance", [
            { name: "contractaddress", value: contractAddress },
            { name: "address", value: address },
            { name: "tag", value: tag?.toString() },
        ])) as ERC20VolumeResponse;
        return BigInt(response.result);
    }

    async getGasConfirmationTimeEstimation(gasprice: BigInt): Promise<GasConfirmationTimeEstimation> {
        const response: GasConfirmationTimeEstimationResponse = (await this.fetchEtherscanMethod(
            "gastracker",
            "gasestimate",
            [{ name: "gasprice", value: gasprice.toString() }]
        )) as GasConfirmationTimeEstimationResponse;
        return parseGasConfirmationTimeEstimation(response.result);
    }

    async getGasOracle(): Promise<GasOracle> {
        const response: GasOracleResponse = (await this.fetchEtherscanMethod(
            "gastracker",
            "gasoracle"
        )) as GasOracleResponse;
        return parseGasOracle(response.result);
    }

    async getTotalETHSupply(): Promise<BigInt> {
        const response: TotalETHSupplyResponse = (await this.fetchEtherscanMethod(
            "stats",
            "ethsupply"
        )) as TotalETHSupplyResponse;
        return BigInt(response.result);
    }

    async getTotalETH2Supply(): Promise<ETH2Supply> {
        const response: ETH2SupplyResponse = (await this.fetchEtherscanMethod(
            "stats",
            "ethsupply2"
        )) as ETH2SupplyResponse;
        return parseETH2Supply(response.result);
    }

    async getETHPrice(): Promise<ETHPrice> {
        const response: ETHPriceResponse = (await this.fetchEtherscanMethod("stats", "ethprice")) as ETHPriceResponse;
        return parseETHPrice(response.result);
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
export function parseERC20Transfer(result: ERC20TransferEvent): FetcherERC20TransferEvent {
    return {
        ...result,
        timeStamp: new Date(Number(result.timeStamp) * 1000),
        value: BigInt(result.value),
        gas: Number(result.gas),
        gasUsed: Number(result.gasUsed),
        blockNumber: Number(result.blockNumber),
        transactionIndex: Number(result.transactionIndex),
        tokenDecimal: Number(result.tokenDecimal),
        gasPrice: BigInt(result.gasPrice),
        cumulativeGasUsed: Number(result.cumulativeGasUsed),
        confirmations: Number(result.confirmations),
    };
}

export function parseERC721Transfer(result: ERC721TransferEvent): FetcherERC721TransferEvent {
    return {
        ...result,
        timeStamp: new Date(Number(result.timeStamp) * 1000),
        gas: Number(result.gas),
        gasUsed: Number(result.gasUsed),
        blockNumber: Number(result.blockNumber),
        transactionIndex: Number(result.transactionIndex),
        tokenDecimal: Number(result.tokenDecimal),
        gasPrice: BigInt(result.gasPrice),
        cumulativeGasUsed: Number(result.cumulativeGasUsed),
        confirmations: Number(result.confirmations),
        tokenID: Number(result.tokenID),
    };
}
export function parseContractSource(result: ContractSource): FetcherContractSource {
    return {
        ABI: result.ABI,
        sourceCode: result.SourceCode,
        compilerVersion: result.CompilerVersion,
        constructorArguments: result.ConstructorArguments,
        contractName: result.ContractName,
        EVMVersion: result.EVMVersion,
        implementation: result.Implementation,
        library: result.Library,
        licenseType: result.LicenseType,
        optimizationUsed: result.OptimizationUsed == "1",
        proxy: Number(result.Proxy),
        runs: Number(result.Runs),
        swarmSource: result.SwarmSource,
    };
}
export function parseTransactionExecutionStatus(
    result: TransactionExecutionStatusResponse["result"]
): FetcherTransactionExecutionStatus {
    return {
        errorMessage: result.errDescription,
        isError: result.isError === "1",
    };
}
export function parseBlockAndUncleReward(result: BlockAndUncleRewardResponse["result"]): FetcherBlockAndUncleReward {
    return {
        blockReward: BigInt(result.blockReward),
        blockNumber: Number(result.blockNumber),
        uncleInlusionReward: BigInt(result.uncleInclusionReward),
        timeStamp: new Date(Number(result.timeStamp) * 1000),
        miner: result.blockMiner,
        uncles: result.uncles.map((u) => {
            return {
                ...u,
                blockReward: BigInt(u.blockreward),
                unclePosition: Number(u.unclePosition),
            };
        }),
    };
}
export function parseEstimatedBlockCountdownTime(
    result: EstimatedBlockCountdownTimeResponse["result"]
): FetcherEstimatedBlockCountdownTime {
    return {
        countdownBlock: Number(result.CountdownBlock),
        currentBlock: Number(result.CurrentBlock),
        estimatedMineTimestamp: new Date(Number(result.EstimateTimeInSec) * 1000),
        estimatedTimeInMilliseconds: Number(result.EstimateTimeInSec) * 1000,
        remainingBlocks: Number(result.RemainingBlock),
    };
}
export function parseGasConfirmationTimeEstimation(result: string): GasConfirmationTimeEstimation {
    return {
        estimatedMineTimestamp: new Date(Number(result) * 1000),
        estimatedTimeInMilliseconds: Number(result) * 1000,
    };
}
export function parseGasOracle(result: GasOracleResponse["result"]): GasOracle {
    return {
        fastGasPrice: BigInt(result.FastGasPrice),
        gasUsedRatio: result.gasUsedRatio,
        lastBlock: Number(result.LastBlock),
        proposeGasPrice: BigInt(result.ProposeGasPrice),
        safeGasPrice: BigInt(result.SafeGasPrice),
        suggestBaseFee: Number(result.suggestBaseFee),
    };
}
export function parseETH2Supply(result: ETH2SupplyResponse["result"]): ETH2Supply {
    return {
        burntFees: BigInt(result.BurntFees),
        eth2Staking: BigInt(result.Eth2Staking),
        ethSupply: BigInt(result.EthSupply),
    };
}
export function parseETHPrice(result: ETHPriceResponse["result"]): ETHPrice {
    return {
        btcPerEth: Number(result.ethbtc),
        btcTimestamp: new Date(Number(result.ethbtc_timestamp) * 1000),
        usdPerEth: Number(result.ethusd),
        usdTimestamp: new Date(Number(result.ethusd_timestamp) * 1000),
    };
}
