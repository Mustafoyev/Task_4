/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteUserById = functions.https.onCall(async (data, context) => {
	// Faqat autentifikatsiyalangan foydalanuvchilar
	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated');
	}

	const userId = data.userId;

	try {
		await admin.auth().deleteUser(userId);
		return { message: `Foydalanuvchi ${userId} muvaffaqiyatli o'chirildi` };
	} catch (error) {
		throw new functions.https.HttpsError(
			'internal',
			`Foydalanuvchini o'chirishda xatolik: ${error.message}`,
		);
	}
});
