const express = require("express");
const router = express.Router();
const { DocumentStore } = require("ravendb");
const fs = require("fs");
const cert = fs.readFileSync("./contact_certificate/contact.pfx");

const store = new DocumentStore(
  "https://a.contact.ravendb.community:8080",
  "Contacts",
  {
    certificate: cert,
    type: "pfx",
  }
);
store.initialize();

// Create
router.post("/contacts", async (req, res) => {
  const session = store.openSession();
  await session.store(req.body, "Contacts/${req.body.id}");
  await session.saveChanges();
  res.send(req.body);
});

// Read one
router.get("/contacts/:id", async (req, res) => {
  const session = store.openSession();
  const contact = await session.load(`contacts/${req.params.id}`);
  res.send(contact);
});

// Read all
router.get("/contacts", async (req, res) => {
  const session = store.openSession();
  const contact = await session.query({ collection: "Contacts" }).all();
  res.send(contact);
});

// Update
router.put("/contacts/:id", async (req, res) => {
  const session = store.openSession();
  const contact = await session.load(`contacts/${req.params.id}`);
  Object.assign(contact, req.body);
  await session.saveChanges();
  res.send(contact);
});

// Delete
router.delete("/contacts/:id", async (req, res) => {
  const session = store.openSession();
  await session.delete(`contacts/${req.params.id}`);
  await session.saveChanges();
  res.send({ message: "Contact deleted" });
});

module.exports = router;
