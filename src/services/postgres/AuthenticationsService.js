const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    console.log("masuk ke addRefreshToken");
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    console.log("result: ", result);

    if (!result.rowCount) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}
module.exports = AuthenticationsService;
