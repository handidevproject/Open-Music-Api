const autoBind = require('auto-bind');

class SongsHandler {
    constructor(SongsService, SongsValidator) {
        this._service = SongsService;
        this._validator = SongsValidator;
        autoBind(this);
    }

    async postSongHandler(request, h) {
        this._validator.validateSongsPayload(request.payload);

        const songId = await this._service.addSong(request.payload);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    async getSongsHandler(request) {
        const { title, performer } = request.query;
        const songs = await this._service.getSongs(title, performer);
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params;

        const song = await this._service.getSongById(id);

        return h.response({
            status: 'success',
            data: {
                song,
            },
        });
    }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongsPayload(request.payload);

        const { id } = request.params;
        await this._service.editSongById(id, request.payload);

        return h.response({
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        });
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params;

        await this._service.deleteSongById(id);

        return h.response({
            status: 'success',
            message: 'Lagu berhasil dihapus',
        });
    }
}

module.exports = SongsHandler;
