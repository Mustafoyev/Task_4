import { getFunctions, httpsCallable } from 'firebase/functions';

export const deleteUserById = async (userId) => {
	const functions = getFunctions();
	const deleteUser = httpsCallable(functions, 'deleteUserById');

	try {
		const result = await deleteUser({ userId });
		console.log(result.data.message);
	} catch (error) {
		console.error("Foydalanuvchini o'chirishda xatolik:", error.message);
	}
};
