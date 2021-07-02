const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Sleep {
	//create sleep data
	static async createSleepData({ sleepData, user }) {
		const requiredFields = ["bed_time", "wake_up_time"];
		requiredFields.forEach((field) => {
			if (!sleepData.hasOwnProperty(field)) {
				throw new BadRequestError(
					`Required field -${field} - missing from request body.`
				);
			}
		});

		if (sleepData.wake_up_time < sleepData.bed_time) {
			throw new BadRequestError(`End time must be after start time.`);
		}

		const results = await db.query(
			`
				INSERT INTO single_sleep_tracker (bed_time, wake_up_time, user_id) VALUES ($1, $2, (SELECT id FROM users WHERE email = $3)) RETURNING bed_time, wake_up_time, user_id;
			`,
			[sleepData.bed_time, sleepData.wake_up_time, user.email]
		);

		return results.rows[0];
	}

	//lists all sleep data
	static async listSleepData() {
		const results = await db.query(
			`
				SELECT s.id,
						s.user_id,
						s.bed_time,
						s.wake_up_time
				FROM single_sleep_tracker as s
				ORDER BY s.id DESC
			`
		);

		return results.rows;
	}

	//list all sleep data for a single user in decending order by when they were created.
	static async listSleepDataSingleUser(user) {
		const userId = await db.query(`SELECT id FROM users WHERE email = $1`, [
			user.email,
		]);

		const results = await db.query(
			`
				SELECT s.id,
						s.user_id,
						s.bed_time,
						s.wake_up_time
				FROM single_sleep_tracker as s
				WHERE s.user_id = $1
				ORDER BY s.bed_time DESC
			`,
			[userId.rows[0].id]
		);

		return results.rows;
	}

	// //list all sleep data for a single user in decending order by when they were created.
	// static async fetchSleepDataByUserId(userId) {
	// 	const results = await db.query(
	// 		`
	// 			SELECT s.id,
	// 					s.user_id,
	// 					s.bed_time,
	// 					s.wake_up_time,
	// 					u.email AS "userEmail"
	// 			FROM single_sleep_tracker as s
	// 				JOIN users AS u ON u.id = s.user_id
	// 			WHERE s.user_id = $1
	// 			ORDER BY s.id DESC
	// 		`,
	// 		[userId]
	// 	);

	// 	return results.rows;
	// }

	//updates a sleep datat for a user
	static async updateSleepData(id) {}

	//deletes a sleep data for a user
	static async deleteSleepData(id) {}
}
module.exports = Sleep;
