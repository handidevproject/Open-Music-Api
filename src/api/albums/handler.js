const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(service, songsService, validator) {
    this._service = service; // Pastikan konsisten menggunakan _service
    this._songsService = songsService; // Pastikan konsisten menggunakan _service
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    console.log("postAlbumHandler payload:", request.payload);

    // Validasi payload
    this._validator.validateAlbumsPayload(request.payload);

    // Tambahkan album menggunakan service
    const albumId = await this._service.addAlbum(request.payload); // Gunakan this._service di sini

    console.log("albumId payload:", albumId);

    // Response berhasil
    const response = h.response({
      status: "success",
      message: "Album berhasil ditambahkan",
      data: {
        albumId,
      },
    });

    response.code(201); // Status HTTP untuk Created
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    album.songs = await this._songsService.getSongByAlbumId(id);
    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;

    this._service.editAlbumById(id, request.payload);

    return h.response({
      status: "success",
      message: "Album berhasil diperbarui",
    });
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: "success",
      message: "Album berhasil dihapus",
    });

    return response;
  }
}

module.exports = AlbumsHandler;
