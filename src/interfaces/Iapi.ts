/* eslint-disable import/no-unresolved */
import { IFetcher } from "./Ifetcher";

export interface IAPI {
    /**
     * The fetcher is a direct interface to the API. Its methods map directly to the API methods.
     */
    readonly fetcher: IFetcher;
    readonly key: string;
    readonly url: string;
}
