const express = require("express");
const router = express.Router();
const Sleep = require("../models/sleep_tracker");
const security = require("../middleware/security");
const permissions = require("../middleware/permissions");

// create a sleep data
router.post(
	"/create",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const new_sleep_data = await Sleep.createSleepData({
				user,
				sleepData: req.body,
			});
			return res.status(201).json({ new_sleep_data });
		} catch (err) {
			next(err);
		}
	}
);

// get all sleep data
router.get("/", async (req, res, next) => {
	try {
		const allSleepData = await Sleep.listSleepData();
		return res.status(200).json({ allSleepData });
	} catch (err) {
		next(err);
	}
});

// geta all sleep data for a single user.
router.get(
	"/my-sleep-data",
	security.requireAuthenticatedUser,
	async (req, res, next) => {
		try {
			const { user } = res.locals;
			const sleepDataForUser = await Sleep.listSleepDataSingleUser(user);
			return res.status(200).json({ sleepDataForUser });
		} catch (err) {
			next(err);
		}
	}
);

// geta all sleep data for a single user.
router.get(
	"/:userId",
	security.requireAuthenticatedUser,
	permissions.authedUserOwnSleepData,
	async (req, res, next) => {
		try {
			const { userId } = req.params;
			const sleepDataForUser = await Sleep.fetchSleepDataByUserId(userId);
			return res.status(200).json({ sleepDataForUser });
		} catch (err) {
			next(err);
		}
	}
);

//get single sleep data
// router.get("/:id", async (req, res, next) => {
// 	try {
// 	} catch (err) {
// 		next(err);
// 	}
// });

// get a single sleep data for a specific user
// router.get("/:user_id/:id", async (req, res, next) => {
// 	try {
// 	} catch (err) {
// 		next(err);
// 	}
// });

// get average sleep for a single user
router.get("/average", async (req, res, next) => {
	try {
	} catch (err) {
		next(err);
	}
});

// get total sleep for a single user
router.get("/total", async (req, res, next) => {
	try {
	} catch (err) {
		next(err);
	}
});

// update sleep data
router.put("/update", async (req, res, next) => {
	try {
	} catch (err) {
		next(err);
	}
});

// delete sleep data
router.delete("/delete", async (req, res, next) => {
	try {
	} catch (err) {
		next(err);
	}
});

module.exports = router;
