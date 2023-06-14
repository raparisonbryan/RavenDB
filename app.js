/**
 * * Imports
 */
const express = require("express");
const { DocumentStore } = require("ravendb");
const fs = require("fs");
const cert = fs.readFileSync("./contact_certificate/contact.pfx");
const contactController = require("./controllers/contact");

const app = express();
app.use(express.json());

/*
 * * Connexion à la base de données MongoDB
 */
const store = new DocumentStore(
  "https://a.contact.ravendb.community:8080",
  "Contacts",
  {
    certificate: cert,
    type: "pfx",
  }
);
store.initialize();

async function testConnection() {
  const session = store.openSession();
  try {
    await session.load("Contacts/0000000000000021152-A");
    console.log("Connection to RavenDB server successful");
  } catch (err) {
    console.log("Connection to RavenDB server failed", err);
  }
}
testConnection();

app.use("/api", contactController);

/**
 * * Exports
 */
module.exports = app;
