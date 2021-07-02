const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

// create a function to extrac the JWT from the reuquest header
const jwtFrom = ({ headers }) => {
	if (headers?.authorization) {
		//Authorization: "Bearer aalkfncjdhac"
		const [scheme, token] = headers.authorization.split(" ");
		if (scheme.trim() === "Bearer") {
			return token;
		}
	}

	return undefined;
};

//create a function to attch the user to the res object
const extractUserFromJwt = (req, res, next) => {
	try {
		const token = jwtFrom(req);
		// is this a valid token
		if (token) {
			//if it is a valid user, attach it to res.locals.user
			res.locals.user = jwt.verify(token, SECRET_KEY);
		}

		return next();
	} catch (err) {
		return next();
	}
};

// create a function to verify an authentificated user exists. If the user does not exists we want to throw an error
const requireAuthenticatedUser = (req, res, next) => {
	try {
		const { user } = res.locals;
		if (!user?.email) {
			throw new UnauthorizedError();
		}

		return next();
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	extractUserFromJwt,
	requireAuthenticatedUser,
};
