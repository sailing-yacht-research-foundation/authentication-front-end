const { models } = require('../config/db.config');

module.exports = {

    /**
     * Create a new versioning log for a specific user
     * @param {*} req 
     * @param {*} res 
     */
    async create(req, res) {
        let version = await models.versioning.findOne({
            where: {
                email: req.body.email,
                type: req.body.type,
                version: req.body.version
            },
        });

        if (version) res.status(200).json(version); // this email already read this version, ignore

        version = await models.versioning.create({
            email: req.body.email,
            type: req.body.type,
            version: req.body.version
        });

        res.status(200).json(version.toJSON());
    },
}