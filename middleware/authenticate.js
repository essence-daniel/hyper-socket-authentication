const https = require("https");

// List of user ids allowed to GET data
let allowedUsers = ["295628165093654538"];

const HYPER_KEY = process.env.HYPER_KEY || "pk_23yd73h7dh233h";

const authenticate = async (req, res, next) => {
  const token =
    // Allows Hyper license key to be used in headers
    // in the form "Authorization: Bearer LICENSE_KEY"
    req.headers?.authorization?.replace(/(bearer| )/gi, "") ||
    //
    // Allows license key to be passed as a url parameter
    // in the form https://mysite.com/success?key=LICENSE_KEY
    // NOTE: this is only intended as an easy way to authenticate
    // through a browser
    req.query.key ||
    null;

  if (token) {
    https
      .get(
        `https://api.metalabs.io/v4/licenses/${token}`,
        {
          headers: { Authorization: `Bearer ${HYPER_KEY}` },
        },
        (response) => {
          if (response.statusCode !== 200) {
            // Invalid license key
            res.sendStatus(401);
            return;
          }

          response.on("data", (buffer) => {
            if (
              // Allows specified allowed users to GET
              allowedUsers.includes(
                JSON.parse(buffer.toString("utf8")).user.discord.id || null
              )
            ) {
              // Route can now proceed and handle data
              next();
            } else {
              // Forbiden
              res.sendStatus(403);
            }
            return;
          });
        }
      )
      .on("error", () => res.sendStatus(401));
  } else {
    // Missing license key
    res.sendStatus(401);
  }
};

module.exports = authenticate;
