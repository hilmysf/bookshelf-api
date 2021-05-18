const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;
  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  const isSuccess = true;
  if (isSuccess) {
    if (name !== undefined) {
      if (readPage <= pageCount) {
        books.push(newBook);
        const res = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        res.header('Access-Control-Allow-Origin', '*');
        res.code(201);
        return res;
      }
      const res = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      res.header('Access-Control-Allow-Origin', '*');
      res.code(400);
      return res;
    }
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.header('Access-Control-Allow-Origin', '*');
    res.code(400);
    return res;
  }
  const res = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.code(500);
  return res;
};

const getAllBooksHandler = (req) => {
  const { name, reading, finished } = req.query;
  const isQueried = name !== undefined || reading !== undefined || finished !== undefined;
  let newData = books;
  if (books.length > 0) {
    if (isQueried) {
      if (name !== undefined) {
        newData = books.filter((book) => book.name.toString().toUpperCase()
          .includes(name.toString().toUpperCase()));
      }
      if (reading === '1') {
        newData = books.filter((book) => book.reading === false);
      } else if (reading === '0') {
        newData = books.filter((book) => book.reading === true);
      }
      if (finished === '1') {
        newData = books.filter((book) => book.finished === true);
      } else if (finished === '0') {
        newData = books.filter((book) => book.finished === false);
      }
      return {
        status: 'success',
        data: {
          books: newData.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
    }
    return {
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  }
  return {
    status: 'success',
    data: {
      books: [],
    },
  };
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.code(404);
  return res;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    if (name !== undefined) {
      if (readPage <= pageCount) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          updatedAt,
        };
        const res = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        res.header('Access-Control-Allow-Origin', '*');
        res.code(200);
        return res;
      }
      const res = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      res.header('Access-Control-Allow-Origin', '*');
      res.code(400);
      return res;
    }
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.header('Access-Control-Allow-Origin', '*');
    res.code(400);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.code(404);
  return res;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    res.header('Access-Control-Allow-Origin', '*');
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.code(404);
  return res;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
