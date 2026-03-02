export interface MemCache {
	[key: string]: any;
}

export class Cache {
	MEMORY: MemCache = {} as MemCache;

	constructor(props: MemCache = {} as MemCache) {
		this.MEMORY = props;
	}

	async get<K extends keyof MemCache>(key: K) {
		return this.MEMORY[key];
	}

	async set(info: MemCache): Promise<void> {
		Object.assign(this.MEMORY, info);
	}

	async search(pattern?: string) {
		if (!pattern) return { ...this.MEMORY };
	}
}
