const https = require("https");

const HYPER_KEY = process.env.HYPER_KEY || "pk_23yd73h7dh233h";

const authenticate = async (socket) => {
  // Get token from handshake
  const token = socket.handshake.auth.token;

  if (token) {
    return new Promise((resolve) => {
      https
        .get(
          `https://api.metalabs.io/v4/licenses/${token}`,
          {
            headers: { Authorization: `Bearer ${HYPER_KEY}` },
          },
          (response) => {
            if (response.statusCode !== 200) {
              // Invalid license key
              socket.send({ status: 401, message: "Invalid license key" });
              socket.disconnect();
              resolve();
            }
            // Valid key
            socket.send({ status: 200, message: "Connected to server" });
            resolve();
          }
        )
        .on("error", () => {
          // Invalid license key
          socket.send({ status: 401, message: "Invalid license key" });
          socket.disconnect();
          resolve();
        });
    });
  } else {
    // Missing license key
    socket.send({ status: 401, message: "Missing license key" });
    socket.disconnect();
  }
};

module.exports = authenticate;
