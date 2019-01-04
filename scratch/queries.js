'use strict';

const knex = require('../knex');

// let searchTerm = 'gaga';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

//let searchId= 1003;
// knex
// .select('id', 'title', 'content')
// .from('notes')
// .where('id', `${searchId}`)
// .then(results => console.log(results))
// .catch( err => console.log( err ) );

// const updateInfo = {title: 'bob rules'};
// const theId = 1005;
// 
// knex('notes')
// .update(updateInfo)
// .where('id', `${theId}`)
// .then(results => console.log(results))
// .catch( err => console.log( err ) );


// const newNote = {title: "ride sally ride", content: "the man is on your side"};
// knex('notes')
// .insert(newNote)
// .returning('id', 'title', 'content') 
// .debug(true)
// .then(results => console.log(results))
// .catch( err => console.log( err ) );

// const deleteThis = 1007;
// knex('notes')
// .delete()
// .where('id', deleteThis)
// .debug(true)
// .then(results => console.log(results))
// .catch( err => console.log( err ) );

knex
.select('id', 'title')
.from('notes')
.then(results => console.log(results))
.catch( err => console.log( err ) );