const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

const TokenManager = {
  generateAccessToken: (payload) => {
    console.log("Generate Access Token with payload:", payload);
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },

  generateRefreshToken: (payload) => {
    console.log("Generate Refresh Token with payload:", payload);
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      console.log("Incoming Refresh Token:", refreshToken); // log token mentah

      const artifacts = Jwt.token.decode(refreshToken);
      console.log("Decoded artifacts:", artifacts); // log hasil decode

      console.log("Decoded Payload:", artifacts.decoded.payload); // log payload

      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      console.log("Signature verification OK ✅");

      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      console.error("JWT error:", error.message);
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

module.exports = TokenManager;
