const BookmarkService = {
  getBookmarks(knex) {
    return knex.select('*').from('items');
  },
  getBookmarkById(knex, id) {
    return knex.from('items').select('*').where('id', id).first();
  }
};

module.exports = BookmarkService;