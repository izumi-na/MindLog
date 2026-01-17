export class AuthError extends Error {
	shouldLogout: boolean;

	constructor(message: string, shouldLogout: boolean = false) {
		super(message);
		this.shouldLogout = shouldLogout;
		this.name = "AuthError";
	}
}
