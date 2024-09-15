const now = new Date();

const day = now.getDate();
const monthNameShort = now.toLocaleString('default', { month: 'short' });
const year = now.getFullYear();

const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

const formattedDate = `${day} ${monthNameShort} ${year}`;
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
	.toString()
	.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

export const dateTime = `${formattedTime}, ${formattedDate}`;
