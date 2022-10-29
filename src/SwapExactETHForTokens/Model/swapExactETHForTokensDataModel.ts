export interface IQty{
    Value?: string;
    CurrencyType?: any;
    
}

export interface ISwapExactETHForTokensDataModel{

    TokenIn?: string;
    TokenOut?: string;
    Fee?: number;
    AmountOut?: IQty;
    Slippage?: number;

}