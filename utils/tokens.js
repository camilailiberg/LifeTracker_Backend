const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

//geterate a token
const generateToken = (data) =>
	jwt.sign(data, SECRET_KEY, { expiresIn: "24h" });

// accepts a user object and then cobnvert it into a valid token, soring only the emial and isAdmin value
const createUserJwt = (user) => {
	const payload = {
		email: user.email,
		isAdmin: user.isAdmin || false,
	};

	return generateToken(payload);
};

//validate token
const validateToken = (token) => {
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		return decoded;
	} catch (err) {
		return {};
	}
};

module.exports = {
	generateToken,
	createUserJwt,
	validateToken,
};

// this will provide suer useful when convine with custom authentification middleware
