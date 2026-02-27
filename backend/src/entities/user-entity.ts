import { BaseEntity } from "./base-entity.ts";

export interface UserEntity extends BaseEntity {
	id: string;
	name: string;
	email: string;
	password: string;
	isActive: boolean;
	telegramChat: string;
}
