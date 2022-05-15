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
