# Documentation de RavenDB

Cette documentation fournit un guide étape par étape pour l'installation de RavenDB sur Windows, sa configuration, la création d'une base de données et les opérations CRUD de base.

## Installation

1. Téléchargez la dernière version de RavenDB à partir du site officiel de RavenDB : [https://ravendb.net/downloads](https://ravendb.net/downloads).

2. Décompréssez le fichier.zip vers le dossier de votre choix.

3. Depuis votre PowerShell, rendez-vous vers le dossier que vous avez décompréssé et lancez l'executable ```.\run``` .

## Configuration

1. Accédez à l'interface d'administration de RavenDB à l'aide de l'URL suivante : [http://localhost:8080](http://localhost:8080). 

2. Dans le panneau de configuration, configurez les paramètres de connexion, tels que le port d'écoute et les informations d'identification si nécessaire.

3. Configurez d'autres options selon vos besoins, telles que les options de sécurité, les autorisations d'accès, etc.
**Il est conseillé d'utiliser un certificat pour raison de sécurité mais ne pas oublier de télécharger le certificat client dans ```Manage server/certificates/client certificate/generate certificate``` et le mettre dans votre répertoire avant de l'appeler lors de la demande de connexion à la base de données.** 

4. Enregistrez les modifications de configuration.

## Création d'une base de données

1. Connectez-vous à l'interface d'administration à l'aide des informations d'identification configurées précédemment.

2. Dans l'interface d'administration, cliquez sur "Databases" (Bases de données) dans la barre latérale.

3. Cliquez sur "New Database" (Nouvelle base de données) pour créer une nouvelle base de données.

4. Configurez les paramètres de la base de données, tels que le nom de la base de données et les options de réplication si nécessaire.

5. Enregistrez la configuration et la nouvelle base de données sera créée.

## Utilisation de Git

### Installation de Git

1. Rendez-vous sur le site officiel de Git : https://git-scm.com.

2. Sur la page d'accueil, vous verrez un bouton de téléchargement pour votre système d'exploitation (Windows, macOS, Linux). Cliquez sur le bouton correspondant à votre système.

3. Une fois le téléchargement terminé, exécutez le programme d'installation et suivez les instructions à l'écran.

4. Lors de l'installation, vous pouvez choisir les options personnalisées selon vos besoins. Par défaut, les paramètres recommandés fonctionneront pour la plupart des utilisateurs.

5. Une fois l'installation terminée, ouvrez une nouvelle fenêtre de terminal ou de ligne de commande et exécutez la commande suivante pour vérifier si Git est correctement installé :

```bash
git --version
```
Vous devriez voir s'afficher le numéro de version de Git si l'installation s'est déroulée avec succès.

### Création d'un dépôt Git

1. Accédez au répertoire racine de votre projet à l'aide d'un terminal ou d'une ligne de commande.

2. Exécutez la commande suivante pour initialiser un nouveau dépôt Git :

```bash
git init
```
Cela créera un nouveau dépôt Git dans le répertoire de votre projet.

### Ajout, commit et push du projet

```bash
git add .
```
Cela ajoutera tous les fichiers du répertoire courant au suivi de Git.

Effectuez un commit pour enregistrer les modifications dans le dépôt en exécutant la commande suivante :

```bash
git commit -m "Premier commit"
```
Assurez-vous de fournir un message de commit significatif entre les guillemets.

Créez un dépôt distant (remote) pour votre projet. Par exemple, si vous utilisez une plateforme de gestion de code telle que GitHub, créez un nouveau dépôt vide sur la plateforme.

Associez votre dépôt local à votre dépôt distant en utilisant la commande suivante, en remplaçant <URL_du_dépôt> par l'URL de votre dépôt distant :

```bash
git remote add origin <URL_du_dépôt>
```
Enfin, poussez vos modifications vers le dépôt distant en utilisant la commande suivante :

```bash
git push -u origin master
```
Cela enverra vos modifications vers le dépôt distant et les liera à la branche principale (généralement appelée "master").

## Opérations CRUD avec Node.js et Express.js

Une fois que vous avez créé une base de données, vous pouvez effectuer les opérations CRUD de base :

### Installation de Node.js

1. Rendez-vous sur le site officiel de Node.js : https://nodejs.org.

2. Cliquez sur le bouton de téléchargement correspondant à la version LTS de Node.js adaptée à votre système d'exploitation (Windows, macOS, Linux).

3. Une fois le téléchargement terminé, exécutez le programme d'installation et suivez les instructions à l'écran.

4. Lors de l'installation, vous pouvez choisir les options personnalisées selon vos besoins. Par défaut, les paramètres recommandés fonctionneront pour la plupart des utilisateurs.

5. Après l'installation, ouvrez une nouvelle fenêtre de terminal ou de ligne de commande pour vérifier si Node.js est correctement installé. Exécutez les commandes suivantes :

```bash
node --version
npm --version
```

Vous devriez voir s'afficher les numéros de version de Node.js et de npm (Node Package Manager) si l'installation s'est déroulée avec succès.

### Installation des libraires 

Installez Express.js et la librairie RavenDB de Node.js :

```javascript
npm i express
```
```javascript
npm install --save ravendb
```

### Connexion à la base de données

Il faut au préalable monter un serveur express.js, dont vous pouvez prendre exemple sur le git ci-dessus ou via le tutoriel de [ce lien :](http://www.cril.univ-artois.fr/~boussemart/express/chapter01.html)

```javascript
const express = require("express");
const { DocumentStore } = require("ravendb");
const fs = require("fs");
const cert = fs.readFileSync("./contact_certificate/contact.pfx");
const contactController = require("./controllers/contact");

const app = express();
app.use(express.json());

const store = new DocumentStore(
  "https://a.contact.ravendb.community:8080", //url de la base de donnée
  "Contacts", //nom de la base de donnée
  {
    certificate: cert,
    type: "pfx",
  }
);
store.initialize();

app.use("/api", contactController);
module.exports = app;
```

### CRUD

1. D'abord créer un modèle pour stocker la définition de la donnée à mettre dans la base de donnée. Créez le dossier ```models``` où vous définisez une classe et les différents paramètres de votre donnée.

2. Créez un dossier ```controllers``` pour mettre les opérations CRUD.

3. Etablissez la connexion dans ce controlleur. 

- **Create (Créer) :** Utilisez les API ou les outils disponibles pour insérer de nouveaux documents dans la base de données.
```javascript
router.post("/contacts", async (req, res) => {
  const session = store.openSession();
  await session.store(req.body, "Contacts/${req.body.id}");
  await session.saveChanges();
  res.send(req.body);
});
```

- **Read (Lire) :** Utilisez les requêtes pour récupérer des documents à partir de la base de données en fonction de critères spécifiques.
```javascript
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
```

- **Update (Mettre à jour) :** Utilisez les API ou les outils disponibles pour mettre à jour les documents existants dans la base de données.
```javascript
router.put("/contacts/:id", async (req, res) => {
  const session = store.openSession();
  const contact = await session.load(`contacts/${req.params.id}`);
  Object.assign(contact, req.body);
  await session.saveChanges();
  res.send(contact);
});
```

- **Delete (Supprimer) :** Utilisez les API ou les outils disponibles pour supprimer des documents de la base de données en fonction de critères spécifiques.
```javascript
router.delete("/contacts/:id", async (req, res) => {
  const session = store.openSession();
  await session.delete(`contacts/${req.params.id}`);
  await session.saveChanges();
  res.send({ message: "Contact deleted" });
});
```

N'oubliez pas d'exporter ces fonctions : 
```javascript
module.exports = router;
```

Consultez la documentation officielle de RavenDB pour plus de détails sur les opérations CRUD et les fonctionnalités avancées.

## Ressources supplémentaires

- Site officiel de RavenDB : [https://ravendb.net](https://ravendb.net)
- Documentation officielle de RavenDB : [https://ravendb.net/docs](https://ravendb.net/docs)
- Communauté RavenDB : [https://ravendb.net/community](https://ravendb.net/community)
