/* Contains all gleaner errors */

// When something goes wrong, but we don't know exactly why
exports.ER_UNKNOWN = 'ER_UNKNOWN';
// When tries to add a username that already exists
exports.ER_DUPLICATE_USERNAME = 'ER_DUPLICATE_USERNAME';
// When tries to log with an invalid username/password
exports.ER_INVALID_USERNAME_PASSWORD = 'ER_INVALID_USERNAME_PASSWORD';
// When tries to add an existing tracking key
exports.ER_DUPLICATE_TRACKING_KEY = 'ER_DUPLICATE_TRACKING_KEY';
// When tries to recover an object with a non existing id
exports.ER_ID_NOT_FOUND = 'ER_ID_NOT_FOUND';