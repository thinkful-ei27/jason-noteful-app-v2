'use strict';

const express = require('express');
const knex = require('../knex');
// Create an router instance (aka "mini-app")
const router = express.Router();
const hydrateNotes = require('../utils/hydrateNotes');

// Get All (and search by query)
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  const tagId = req.query.tagId;

  knex
  .select('notes.id as notesId', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
  .from('notes')
  .leftJoin('folders', 'notes.folder_id', 'folders.id')
  .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
  .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .modify(function (queryBuilder) {
    if (folderId) {
      queryBuilder.where('folder_id', folderId);
    }
  })
  .modify(function (queryBuilder) {
    if (tagId) {
      queryBuilder.where('tags.id', tagId);
    }
  })
  .orderBy('notes.id')
  .then(result => {
    if (result) {
      const hydrated = hydrateNotes(result);
      res.json(hydrated);
    } else {
      next();
    }
  })
  .catch(err => {
    next(err);
  });
});

// Get a single item
router.get('/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex
  .select('notes.id as notesId', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
  .from('notes')
  .leftJoin('folders', 'notes.folder_id', 'folders.id')
  .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
  .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
  .where('notes.id', noteId)
  .then(result => {
    if (result) {
      const hydrated = hydrateNotes(result);
      res.json(hydrated);
    } else {
      next();
    }
  })
  .catch( err => next( err ) );
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content, folderId } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateObj = {
    title: title,
    content: content,
    folder_id: (folderId) ? folderId : null
  };

  knex('notes')
  .update(updateObj)
  .where('id', noteId)
  .returning(['id'])
  .then(() => {
    return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where('notes.id', noteId)
  })
  .then(result => {
    if (result) {
      const hydrated = hydrateNotes(result);
      res.json(hydrated);
    } else {
      next();
    }
  })
  .catch( err => next( err ) );
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body;

  const newItem = { title, content, folder_id: folderId };
  let noteId;
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
  .insert(newItem)
  .returning('id', 'title', 'content') 
  .then(([id]) => {
    noteId = id;
    return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
      .from('notes')
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .where('notes.id', noteId);
  })
  .then(([result]) => {
    res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
  })
  .catch( err => next( err ) );
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex('notes')
  .delete()
  .where('id', noteId)
  .then(() => {
    res.status(204).end();
  })
  .catch( err => {
    next( err ) 
  });
});

module.exports = router;
