const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const app = express();


const PORT_DEFAULT='8181';
var corsOptions = {
  origin: `http://localhost:${PORT_DEFAULT}`
};



app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.mongoose
  .connect(`${dbConfig.DBConnection}`, {
	  
    useNewUrlParser: true,
    useUnifiedTopology: true

  })
  .then(() => {
	  
    console.log("MongoDB db connection created or placed.");
	
  })
  .catch(err => {
	  
    console.error("Connection error", err);
    process.exit();
	
  });

  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to user & blog application test." });
  });

  // routes
  require("./app/routes/auth.routes")(app);
  require("./app/routes/user.routes")(app);
  require("./app/routes/blogs.routes")(app);

  // set port, listen for requests
  const PORT = process.env.PORT || PORT_DEFAULT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
