export interface IClient {
	id?: string;
	name: string,
	surname: string,
	email: string,
	phone: string
}

export class Client implements IClient {
	constructor(
		public name: string,
		public surname: string,
		public email: string,
		public phone: string,
		public id?: string,
	) {
		if (id) {
			this.id = id;
		}
	}
}