const Sleep = require("../models/sleep_tracker");
const { BadRequestError, ForbiddenError } = require("../utils/errors");

// ensure authenticated user is owner of sleep data
// if they are not throw erre
// otherwise we are good
const authedUserOwnSleepData = async (req, res, next) => {
	try {
		// we are going to assume that the require aythentificatd user muddleware is run before this one
		const { user } = res.locals;
		console.log("USER in permissions.js: ", user); // TODO: Delete comment
		// we will assume that it is making a request to a route where there is a request parameter in the endpoint
		const { userId } = req.params;
		// then we will actually go get that user's sleep data
		const userSleepData = await Sleep.fetchSleepDataByUserId(userId);
		console.log("userSleepData in permissions.js: ", userSleepData); // TODO: Delete comment
		// if the email of the user that created that sleep data is not equel to the authenticated user's email, throuw a forbiden error
		userSleepData.forEach((field) => {
			if (field.userEmail !== user.email) {
				console.log("FILED.USEREMAIL: ", field.userEmail); // TODO: Delete comment
				throw new ForbiddenError(
					"User is not allowed to see other user's sleep data."
				);
			}
		});

		res.locals.userSleepData = userSleepData;

		return next();
	} catch (err) {
		next(err);
	}
};

module.exports = {
	authedUserOwnSleepData,
};
