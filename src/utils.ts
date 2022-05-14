/* eslint-disable import/no-unresolved */
import { KeyConfig } from "./configs";
export function isKeyConfig (config: unknown) : config is KeyConfig {
    if (typeof config !== "object" || config == null) return false;
    if (!("key" in config)) return false;
    if(!("plan" in config)) return false;
    return true;
}
