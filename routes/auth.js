const express = require("express");
const User = require("../models/users");
const { createUserJwt } = require("../utils/tokens"); //utility function to generate json we tokens
const security = require("../middleware/security"); // middleware
const router = express.Router();

router.post("/login", async (req, res, next) => {
	try {
		const user = await User.login(req.body);
		const token = createUserJwt(user);
		return res.status(200).json({ user, token });
	} catch (err) {
		next(err);
	}
});

router.post("/register", async (req, res, next) => {
	try {
		const user = await User.register({ ...req.body, isAdmin: false });
		const token = createUserJwt(user);
		return res.status(201).json({ user, token });
	} catch (err) {
		next(err);
	}
});

// I wan to take the token that was sent in this request and I want to turn it into a user in our data base, who can be then sent back to the client with all their information
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const user = await User.fetchUserByEmail(email);
		const publicUser = User.makePublicUser(user);
		return res.status(200).json({ user: publicUser });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
