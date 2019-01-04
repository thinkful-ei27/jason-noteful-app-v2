'use strict';
const express = require('express');
const knex = require('../knex');
const router = express.Router();


//GET ALL
router.get('/', (req, res, next) => {
    knex.select('id as tagId', 'name as tagName')
        .from('tags')
        .then(results => {
            res.json(results);
        })
        .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
    const tagId = req.params.id;
    knex.select('id', 'name')
        .from('tags')
        .where('id', tagId)
        .then(results => res.json(results[0]))
        .catch( err => next(err));
});

/* ========== POST/CREATE ITEM ========== */
router.post('/tags', (req, res, next) => {
    const { name } = req.body;
/***** Never trust users. Validate input *****/
    if (!name) {
        const err = new Error('Missing `name` in request body');
        err.status = 400;
        return next (err);
    }

    const newItem = { name };

    knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
        const result = results[0];
        res.json(result);
    })
    .catch(err => next(err));
});




module.exports=router;