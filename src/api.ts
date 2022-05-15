/* eslint-disable import/no-unresolved */
import {
    ApiConstructorConfig,
    KeyConfig,
    KeyPlan,
    defaultKeyLimits as defaultLimits,
    Network,
    networkUrls,
} from "./types/configs";
import { IAPI } from "./interfaces/Iapi";
import { isKeyConfig } from "./utils";
import { Fetcher } from "./fetcher";
export class API implements IAPI {
    private readonly keyManager: APIKeyManager;
    private readonly network: Network;
    public readonly fetcher: Fetcher;
    constructor(config: ApiConstructorConfig) {
        if (isKeyConfig(config.key)) {
            this.keyManager = new APIKeyManager([config.key]);
        } else if (Array.isArray(config.key)) {
            this.keyManager = new APIKeyManager(config.key);
        } else {
            throw new Error("Invalid key config");
        }

        this.fetcher = new Fetcher(this);
        this.network = config.network;
    }

    get key() {
        return this.keyManager.key;
    }

    get url() {
        return networkUrls[this.network];
    }
}

export class APIKeyManager {
    readonly keys: Array<KeyObject> = [];
    private keyIndex = 0;
    constructor(keys: Array<KeyConfig>) {
        keys.forEach((key) => {
            this.keys.push(new KeyObject(key));
        });
    }
    get keyObject(): KeyObject {
        this.keyIndex++;
        if (this.keyIndex == this.keys.length) this.keyIndex = 0;
        const k = this.keys[this.keyIndex];
        if (!k) throw new Error("No keys available");
        return k;
    }
    get key(): string {
        return this.keyObject.key;
    }
}
class KeyObject {
    readonly plan: KeyPlan;
    readonly limit: number;
    readonly key: string;
    constructor(config: KeyConfig) {
        this.plan = config.plan;
        if (!config.limit) config.limit = defaultLimits[config.plan];
        this.limit = config.limit;
        this.key = config.key;
    }
}
