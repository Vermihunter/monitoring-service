db = db.getSiblingDB("monitordb");

db.createUser({
  user: "appuser",
  pwd: "apppassword",
  roles: [{ role: "readWrite", db: "monitordb" }],
});

db.createCollection("users");

db.users.insertOne({
  name: "Admin",
  createdAt: new Date(),
});
