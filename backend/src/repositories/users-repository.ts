import userModel from "../models/user-model.ts";

async function getUserByEmail(email: string) {
	return userModel.findOne({ where: { email } });
}

export default { getUserByEmail };
