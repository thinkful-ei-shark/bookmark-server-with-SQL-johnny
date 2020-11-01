const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe.only('Bookmark Endpoints', function() {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());

  beforeEach('clean the table', () => db('items').truncate());

  context('Given there are items in the database', () => {

    const testItems = makeBookmarksArray();

    beforeEach('insert items', () => {
      return db
        .into('items')
        .insert(testItems);
    });

    it('GET /bookmarks responds with 200 and all of the articles', () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, testItems);
    });

    it('GET /articles/:article_id responds with 200 and the specificied article', () => {
      const itemId = 2;
      const expectedItem = testItems[itemId - 1];
      return supertest(app)
        .get(`/bookmarks/${itemId}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, expectedItem);
    });
  });

  context('Given no items', () => {
    it('responds with 200 and an empty list', () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, []);
    });

    it('responds with 404 when GET /bookmarks/id', () => {
      return supertest(app)
        .get('/bookmarks/123')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400);
    });
  });

  describe('POST /bookmarks', () => {
    it('responds with 400 missing \'title\' if not supplied', () => {
      const newBookmarkMissingTitle = {
        id: 4,
        // title: 'test-title'
        url: 'https://test.com',
        rating: 1
      };
      return supertest(app)
        .post('/bookmarks')
        .send(newBookmarkMissingTitle)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400);
    });
  });

});