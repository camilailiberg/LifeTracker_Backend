const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { NotFoundError } = require("./utils/errors");
const authRoutes = require("./routes/auth");
const sleepRoutes = require("./routes/sleep_tracker");
const { PORT } = require("./config");
const security = require("./middleware/security");

const app = express();

//! middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// for eveery request, check if a token exists in the authorization header
// if it does, attach the decoded user to res.locals
app.use(security.extractUserFromJwt);

//! Routes
app.use("/auth", authRoutes); //! this is a middleware too
app.use("/sleep", sleepRoutes); //! this is a middleware too

//! Error handling
// This will handle all 404 Errors that were not matched by a route
app.use((req, res, next) => {
	return next(new NotFoundError());
});

// Generic Error handler - anything that is unhandle will be handled here
app.use((error, req, res, next) => {
	const status = error.status || 500;
	message = error.message;
	return res.status(status).json({
		error: { message: message, status: status },
	});
});

// const PORT = process.env.PORT || 3001; //* I don't need this anymore because I am using the PORT from config.js

app.listen(PORT, () => {
	console.log(`🚀 Server running http://localhost:${PORT}`);
});
