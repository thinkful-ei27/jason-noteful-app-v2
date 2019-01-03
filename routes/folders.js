'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

//Get All
router.get('/', (req, res, next) => {
    knex.select('id', 'name')
      .from('folders')
      .then(results => {
        res.json(results);
      })
      .catch(err => next(err));
  });

  router.get('/:id', (req, res, next) => {
      const id = req.params.id;
      knex
      .select('id', 'name')
      .from('folders')
      .where('id', `${id}`)
      .then(results => res.json(results[0]))
      .catch( err => next( err ) );

  });

// PUT update
  router.put('/:id', (req, res, next) => {
      const id = req.params.id;

        /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
  .update(updateObj)
  .where('id', `${id}`)
  .then(results => res.json(results))
  .catch( err => next(err));
});

//POST create
router.post('/', (req, res, next) => {
    const { name } = req.body;
    const newItem = {name};
/***** Never trust users - validate input *****/
  if (!newItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
  .insert(newItem, "name")
  .debug(true)
  .returning('*')
  .then(results => res.json(results))
  .catch( err => next( err ) );
});

//DELETE a folder
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    knex('folders')
    .delete()
    .where('id', id)
    .then(results => res.json(results))
    .catch( err => next( err ) );
});

  module.exports = router;
