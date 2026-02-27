import { BaseEntity } from "./base-entity.ts";

export interface SymbolEntity extends BaseEntity {
	symbol: string;
	base: string;
	quote: string;
	stepSize: string;
	tickSize: string;
	basePrecision: number;
	quotePrecision: number;
	minNotional: string;
	minLotSize: string;
}
