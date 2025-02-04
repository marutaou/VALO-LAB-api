const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/findUser", async (req, res) => {
	const { username, email } = req.body;

	if (email) {
		const userInfo = await prisma.user.findUnique({
			where: {
				userEmail: email,
			},
		});
		if (!userInfo) {
			const response = await prisma.user.create({
				data: {
					username: username,
					userEmail: email,
				},
			});
			res.json(response);
		} else {
			res.json(userInfo);
		}
	}
});

module.exports = router;
