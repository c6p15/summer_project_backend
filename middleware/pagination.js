// pagination.js

const paginateResults = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 5; // Number of items per page, default to 10 if not provided

        // Calculate the offset based on the page number and limit
        const offset = (page - 1) * limit;

        // Store pagination info in request object
        req.pagination = {
            offset,
            limit,
            page
        };

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = paginateResults;
