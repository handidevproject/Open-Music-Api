const autoBind = require("auto-bind");

class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    autoBind(this);
  }

  async postUserHandler(request, h) {
    print(`masuk handler: ${request.payload}`);
    this._validator.validateUserPayload(request.payload);
    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: "success",
      message: "User berhasil ditambahkan",
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    return {
      status: "success",
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
