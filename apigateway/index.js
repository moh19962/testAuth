require("dotenv").config();
require("./database/mongooseConnection");
const AuthService = require("./authService");

const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const passport = require("passport");
const ConnectRoles = require("connect-roles");
const authservice = new AuthService();
const roles = new ConnectRoles();

app.use(passport.initialize());
app.use(roles.middleware());
app.use(cors());
app.use(express.json());

const authService = new AuthService();

roles.use("grant", (req) => {
  if (req.user && roles.isAuthenticated()) {
    return req.user.isOwner == true;
  }
});

//Een route waar authorisatie op zit
app.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  roles.can("grant"),
  (req, res) => {
    /*inmiddels weten we hier dat de user bekend is in het systeem
     *Nu moet er gekeken worden of deze user deze route mag aanroepen
     *Wanneer dat het geval is mag bijv. de **circuitBreaker.fire()** methode aangeroepen
     *worden die vervolgens het endpoint aanroept van de microservice.
     *Om de enpoint van de postService microservice aan te roepen, kun je bijv. axios gebruiken
     */
    res.send("welkom");
  }
);

//De gebruiker ontvangt hier een register json object omdat de user nog niet bekend is
//in het systeem
app.get("/register", (req, res) => {
  res.json({
    email: "geef hier uw email adres",
    password: "voer hier uw wachtwoord in",
    isOwner:
      "vul hier true in als u eigenaar bent van dit type bericht, anders false",
  });
});

//gebruiker wordt geregistreerd en ontvangt een JWT
//Daarmee is de gebruiker automatisch ingelogd
app.post("/register", (req, res) => {
  /**
   * Wanneer een gebruiker is geregistreerd moet deze een jwt token ontvangen.
   * Geef de juiste status code terug
   */
});

//de login doet praktisch hetzelfde als de 'register' route met dat verschil dat het alleen maar
// een nieuwe JWT geeft wanneer de user al bestaat
app.post("/login", async (req, res) => {
  try {
    const { user, token } = await authservice.login(
      req.body.email,
      req.body.password
    );
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
