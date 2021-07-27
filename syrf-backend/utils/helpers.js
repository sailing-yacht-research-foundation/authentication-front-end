module.exports = {
    /**
     * Handle error response
     * @param {*} err error object from axios
     * @param {*} res response
     * @returns 
     */
    handleErrorResponse(err, res) {
        if (err.response)
            return res.json(400, err.response.data);
        return res.status(500);
    }
}