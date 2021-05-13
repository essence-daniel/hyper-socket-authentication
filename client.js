const { Manager } = require("socket.io-client");

const manager = new Manager("ws://localhost:8080" /* ws://mysite.com */);

const login = (licenseKey) => {
  // Define socket
  const socket = manager.socket("/", {
    auth: {
      token: licenseKey,
    },
  });

  // Establish connection
  socket.connect();

  socket.on("connect", () => {
    console.log("Authenticating...");

    socket.on("message", (data) => {
      socket.removeAllListeners("message");

      if (data.status === 401) {
        // Handle failed login
        console.log(data.message);
      } else if (data.status === 409) {
        // Handle logged in on another device
        console.log(data.message);
      } else if (data.status === 200) {
        // Handle successfull login
        console.log(data.message);

        socket.on("disconnect", () => {
          socket.removeAllListeners("disconnect");
          // Handle server disconnect (force logout/quit)
          console.log("Disconnected from server");
        });
      }
    });
  });
};

const logout = () => {
  manager._close();
};

login("ABCD-EFGH-IJKL-MNOP");
//logout()
