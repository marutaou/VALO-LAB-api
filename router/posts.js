const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const e = require("express");
const prisma = new PrismaClient();

router.post("/AirstrikePost", async (req, res) => {
	const { userId, map, agent, value, standingUrl, landmarkUrl, pins } =
		req.body;

	console.log(req.body);
	try {
		await prisma.airstrikePost.create({
			data: {
				authorId: userId,
				map,
				agent,
				title: value.title,
				comment: value.comment,
				placename: value.placeName,
				posture: value.posture,
				charge: value.charge,
				bounce: value.bounce,
				throwing: value.throwing,
				standingPositionImage: standingUrl,
				landmarkImage: landmarkUrl,
				firingPinX: value.pins[0].x,
				firingPinY: value.pins[0].y,
				fallingPinX: value.pins[1].x,
				fallingPinY: value.pins[1].y,
			},
		});
		res.status(200).json({ message: "投稿に成功しました。" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "投稿に失敗しました。" });
	}
});

router.get("/AirstrikeListData/:mapName?", async (req, res) => {
	const { mapName } = req.params;
	console.log("Request received with mapName:", mapName); // デバッグ用ログ

	try {
		const latestAirstrikePost = await prisma.airstrikePost.findMany({
			where: { map: mapName },
			include: {
				author: {
					select: {
						userId: true,
						username: true,
					},
				},
			},
		});
		console.log("Query result:", latestAirstrikePost); // クエリ結果のログ
		if (latestAirstrikePost) {
			res.json(latestAirstrikePost);
		} else {
			res.json("現在投稿はありません。");
		}
	} catch (error) {
		console.error("Error fetching data:", error); // エラー詳細をログに出力
		res.status(500).json({ message: "データ取得に失敗しました。" });
	}
});

//
router.get(
	"/AirstrikeGetFavoriteStatus/:userId?/:postId?",
	async (req, res) => {
		const { userId, postId } = req.params;
		try {
			const favoriteStatus = await prisma.airstrikeFavoriteManager.findUnique({
				where: {
					userId_postId: {
						userId: Number(userId), // 文字列を数値に変換
						postId: Number(postId),
					},
				},
			});
			// favoriteStatusが存在する場合はtrue、存在しない場合はfalseを返す
			res.json({ isFavorite: !!favoriteStatus });
		} catch (error) {
			console.error(error);
		}
	}
);

router.post("/favorite_inc", async (req, res) => {
	const { userId, postId } = req.body;

	try {
		const updataFavorite = await prisma.airstrikePost.update({
			where: { id: postId },
			data: {
				favorite: {
					increment: 1,
				},
			},
		});
		await prisma.airstrikeFavoriteManager.create({
			data: {
				userId: userId,
				postId: postId,
			},
		});
	} catch (error) {
		console.error(error);
	}
});

router.post("/favorite_dec", async (req, res) => {
	const { userId, postId } = req.body;

	try {
		const updataPost = await prisma.airstrikePost.update({
			where: { id: postId },
			data: {
				favorite: {
					decrement: 1,
				},
			},
		});
		await prisma.airstrikeFavoriteManager.delete({
			where: {
				userId_postId: {
					userId: userId,
					postId: postId,
				},
			},
		});
	} catch (error) {
		console.error(error);
	}
});

router.get("/favorited_post/:userId?", async (req, res) => {
	const userId = parseInt(req.params.userId);

	if (userId) {
		try {
			const favoritedPosts = await prisma.airstrikeFavoriteManager.findMany({
				where: {
					userId: userId,
				},
				include: {
					post: {
						include: {
							author: true,
						},
					},
				},
			});
			res.json(favoritedPosts);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
});

module.exports = router;
