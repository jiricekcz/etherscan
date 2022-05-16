/* eslint-disable import/no-unresolved */
import { KeyConfig } from "./types/configs";
export function isKeyConfig(config: unknown): config is KeyConfig {
    if (typeof config !== "object" || config == null) return false;
    if (!("key" in config)) return false;
    if (!("plan" in config)) return false;
    return true;
}
export class RotatingArray<T> {
    public readonly store: Array<T> = [];
    public readonly length: number;
    protected index = 0;
    constructor(length: number, filler: () => T) {
        for (let i = 0; i < length; i++) {
            this.store[i] = filler();
        }
        this.length = length;
    }
    at(index: number): T {
        return this.store[this.getIndex(index)] as T;
    }
    push(item: T): void {
        this.store[this.index] = item;
        this.index++;
    }
    protected getIndex(index: number): number {
        return (this.index + index) % this.length;
    }
}

export class RequestTimeTracker {
    private readonly requestTimes: RotatingArray<Date>;
    public readonly queue: Array<() => void> = [];
    public readonly interval: number;
    public readonly maxRequests: number;
    protected readonly safetyInterval: number;
    protected ongoingQueueUpdate = false;
    constructor(maxRequests: number, interval: number, safetyInterval = 20) {
        this.requestTimes = new RotatingArray(maxRequests, () => new Date(0));
        this.interval = interval;
        this.maxRequests = maxRequests;
        this.safetyInterval = safetyInterval;
    }
    callRequest(date: Date = new Date()): void {
        this.requestTimes.push(date);
    }
    canRequest(date: Date = new Date()): boolean {
        const lastRequest = this.requestTimes.at(1);
        const timeSinceLastRequest = date.getTime() - lastRequest.getTime();
        return timeSinceLastRequest > this.interval;
    }
    protected timeToNextRequest(): number {
        const lastRequest = this.requestTimes.at(1);
        const timeSinceLastRequest = new Date().getTime() - lastRequest.getTime();
        return Math.max(this.interval - timeSinceLastRequest + this.safetyInterval, 0);
    }
    protected newUpdateQueue(): void {
        if (this.ongoingQueueUpdate) return;
        void this.updateQueue();
    }
    protected async updateQueue(): Promise<void> {
        this.ongoingQueueUpdate = true;
        while (this.queue.length > 0) {
            if (!this.canRequest()) {
                console.log(`Waiting for ${this.timeToNextRequest()}ms`);
                await delay(this.timeToNextRequest());
            }
            const resolve = this.queue.shift() as () => void;
            resolve();
            this.callRequest();
        }
        this.ongoingQueueUpdate = false;
    }
    waitUntilRequestPossible(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.queue.push(resolve);
            console.log(`Added request to queue. Queue length: ${this.queue.length}`);
            this.newUpdateQueue();
        });
    }
}
export function delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}
