const blogRoutes = require('./blog-routes');

module.exports = (app, db) => {
	app.use('/api/posts', blogRoutes(db));
};
