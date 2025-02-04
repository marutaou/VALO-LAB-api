const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/findUser/:email", async (req, res) => {
	const { email } = req.params;

	if (email) {
		const userInfo = await prisma.user.findUnique({
			where: {
				Email: email,
			},
		});
		if (userInfo) {
			res.json(userInfo);
		}
	}
});

module.exports = router;
