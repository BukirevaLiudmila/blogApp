const mongodb = require('mongodb');
const routes = require('express').Router();


module.exports = (db) => {
	routes.post('/', async (req, res) => {
		const key = req.query.key;
		const values = {...req.body};
		console.log('req.body ', req.body);
		console.log('values ', values);
		if (!key) {
			res.send({error: 'Required parameter key did not sent'});
			return;
		}
		if (Object.keys(values).length === 0) {
			res.send({error: 'Data did not sent'});
			return;
		}
		try {
			await db.collection(`posts-list-${key}`)
				.insertOne(values);
			console.log(`Inserted a document into the posts-list-${key} collection.`);
			res.send({result: 'Success'});
		} catch (err) {
			console.error(err);
			res.send({error: err});
		}
	});

	routes.get('/:id*?', async (req, res) => {
		const key = req.query.key;
		const id = req.params.id;
		if (!key) {
			res.send({
				error: 'Required parameter key did not sent'
			});
			return;
		}
		const objectForFind = {};
		if (id) {
			objectForFind._id = new mongodb.ObjectID(id);
		}
		try {
			const result = await db.collection(`posts-list-${key}`)
				.find(objectForFind)
				.toArray();
			console.log(id ? `Found the document on id ${id}`
				: `Found all documents in posts-list-${key} collection`);
			console.log(result);
			res.send({
				result: 'Success',
				data: result
			});
		} catch (err) {
			console.error(err);
			res.send({error: err});
		}
	});

	routes.delete('/:id', async (req, res) => {
		const key = req.query.key;
		const id = req.params.id;
		const objectId = new mongodb.ObjectID(id);
		try {
			const result = await db.collection(`posts-list-${key}`)
				.deleteOne({_id: new mongodb.ObjectID(objectId)});
			console.log(`Document with ${id} id is deleted`);
			res.send({
				result: 'Success',
				deleted: result.deletedCount > 0
			});
		} catch (err) {
			console.error(err);
			res.send({
				error: err
			});
		}
	});

	return routes;
};
