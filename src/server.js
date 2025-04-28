// mengimpor dotenv dan menjalankan konfigurasinya
require("dotenv").config();

const Hapi = require("@hapi/hapi");

// TODO HANDY 2024-11-19 : Albums
const albums = require("./api/albums");
const albumsValidator = require("./validator/albums");
const AlbumsService = require("./services/postgres/AlbumsService");

// TODO HANDY 2024-11-19 : Songs
const songs = require("./api/songs");
const songsValidator = require("./validator/songs");
const SongsService = require("./services/postgres/SongsService");

const ClientError = require("./exceptions/ClientError");
const NotFoundError = require("./exceptions/NotFoundError");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    debug: { request: ["error"] }, // Aktifkan debug untuk error
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  try {
    await server.register([
      {
        plugin: albums,
        options: {
          AlbumsService: albumsService,
          SongsService: songsService,
          AlbumsValidator: albumsValidator,
        },
      },
      {
        plugin: songs,
        options: {
          SongsService: songsService,
          SongsValidator: songsValidator,
        },
      },
    ]);

    server.ext("onPreResponse", (request, h) => {
      const { response } = request;

      if (response instanceof Error) {
        // Client error buatan sendiri
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: "fail",
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }

        // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
        if (!response.isServer) {
          return h.continue;
        }

        // penanganan server error sesuai kebutuhan
        const newResponse = h.response({
          status: "error",
          message: "Terjadi kegagalan pada server kami.",
        });
        newResponse.code(500);
        return newResponse;
      }

      // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
      return h.continue;
    });
  } catch (err) {
    console.error("Error registering plugin:", err);
  }

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
