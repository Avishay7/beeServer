
const indexR = require("./index");
const usersR = require("./users");
const emailR = require("./email");

exports.corsAccessControl = (app) => {
  app.all("*", function (req, res, next) {
    if (!req.get("Origin")) return next();
    res.set("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type,auth-token,x-api-key"
    );
    next();
  });
};

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/email", emailR);
  app.use((req, res) => {
    res.status(404).json({ msg_error: "Url not found , 404!" });
  });
};

