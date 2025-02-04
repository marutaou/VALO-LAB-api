const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

const postsRouter = require("./router/posts");
const authRouter = require("./router/auth");
const usersRouter = require("./router/users");

app.use(cors());
app.use(express.json());

app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () =>
	console.log(`サーバー起動しました http://localhost:${PORT}`)
);
