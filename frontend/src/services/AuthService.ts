export async function doLogin(email: string, password: string) {
	if (email === "gui.vabi@gmail.com" && password === "123456") {
		return {
			id: 1,
			token: "fake-jwt-token",
		};
	} else {
		throw new Error("Email or password is incorrect");
	}
}

export async function doLogout() {
	return true;
}
