import app from "./app.ts";

const port = process.env.SERVER_PORT;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
