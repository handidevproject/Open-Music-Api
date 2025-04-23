// mengimpor dotenv dan menjalankan konfigurasinya
require("dotenv").config();

const Hapi = require("@hapi/hapi");

// TODO HANDY 2024-11-19 : Albums
const albums = require("./api/albums");
const albumsValidator = require("./validator/albums");
const AlbumsService = require("./services/postgres/AlbumsService");

// TODO HANDY 2024-11-19 : Songs
const songs = require("./api/songs");
const SongsValidator = require("./validator/songs");
const SongsService = require("./services/postgres/SongsService");

const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
          service: albumsService,
          songsService: songsService,
          albumsValidator: albumsValidator,
        },
      },
      {
        plugin: songs,
        options: {
          service: songsService,
          validator: SongsValidator,
        },
      },
    ]);

    server.ext("onPreResponse", (request, h) => {
      // mendapatkan konteks response dari request
      const { response } = request;

      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      return h.continue;
    });
  } catch (err) {
    console.error("Error registering plugin:", err);
  }

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
