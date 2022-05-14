export interface ApiConstructorConfig {
    key: KeyConfig | Array<KeyConfig>;
}
export type KeyPlan = "free" | "standard" | "advanced" | "professional" | "generic";
export interface GenericKeyConfig {
    key: string;
    limit: number;
    plan: "generic";
}
export interface FreeKeyConfig {
    key: string;
    limit?: 5;
    plan: "free";
}
export interface StandardKeyConfig {
    key: string;
    limit?: 10;
    plan: "standard";
}
export interface AdvancedKeyConfig {
    key: string;
    limit?: 20;
    plan: "advanced";
}
export interface ProfessionalKeyConfig {
    key: string;
    limit?: 30;
    plan: "professional";
}
export type KeyConfig =
    | GenericKeyConfig
    | FreeKeyConfig
    | StandardKeyConfig
    | AdvancedKeyConfig
    | ProfessionalKeyConfig;
export const defaultKeyLimits: { [key in KeyPlan]: number } = {
    free: 5,
    standard: 10,
    advanced: 20,
    professional: 30,
    generic: 5
}