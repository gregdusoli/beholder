export interface BeholderProps {
  symbol: string;
  index: string;
  value: any;
  ticker?: any | undefined;
  interval?: string | number | undefined;
  canRunAutomations?: boolean | undefined;
}

export interface ConversionProps {
  baseAsset: string;
  baseQty: string;
  fiat?: string;
}
