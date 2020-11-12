/**
 * Converts seconds into a time string
 * @param seconds - the amount in seconds
 */
export const secondsToString = (seconds: number): string => {
	let human = '';

	const hours = Math.floor((seconds / 60 / 60) % 24);
	const minutes = Math.floor((seconds / 60) % 60);
	seconds = Math.floor(seconds % 60);

	if (hours > 1) human += `${hours} hours `;
	if (hours == 1) human += `${hours} hour `;

	if (minutes > 1) human += `${minutes} minutes `;
	if (minutes == 1) human += `${minutes} minute `;

	if (seconds > 1) human += `${seconds} seconds`;
	if (seconds == 1) human += `${seconds} second`;

	return human;
};
