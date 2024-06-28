const apiResponse = (data, error = null) => {
	if (error === null) {
		return {
			success: true,
			data,
		};
	}
	return { success: false, error };
};

module.exports = apiResponse;
