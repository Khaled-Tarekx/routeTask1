import asyncHandler from 'express-async-handler';

export const validateDates = asyncHandler(async (startDate, endDate) => {
	return (req, res) => {
		if (startDate && isNaN(new Date(startDate).getTime())) {
			return res.status(400).json('invalid date format');
		}
		if (endDate && isNaN(new Date(endDate).getTime())) {
			return res.status(400).json('invalid date format');
		}
	};
});
