const { nanoid } = require("nanoid");

class NotesService {
  constructor() {
    this._notes = [];
  }

  addNote({ title, body, tags }) {
    /** kode disembunyikan */
  }

  getNotes() {
    /** kode disembunyikan */
  }

  getNoteById(id) {
    /** kode disembunyikan */
  }

  editNoteById(id, { title, body, tags }) {
    /** kode disembunyikan */
  }

  deleteNoteById(id) {
    /** kode disembunyikan */
  }
}

module.exports = NotesService;
