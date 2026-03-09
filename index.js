const express = require("express");
const fs = require("fs");
const app = express();
const usersData = require("./users.json");

app.use(express.json());

app.get("/users", (req, res) => {
  res.json(usersData.users);
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "fha5HpDXSXSjKU0QCbdXiz1a") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const tokenMiddleware = (req, res, next) => {
  if (req.method !== "GET") {
    const token = req.headers.token;

    if (!token || token !== "HIZe4D32twWOUP9h0I1IVTlr") {
      return res.status(403).json({ message: "Invalid token" });
    }
  }

  next();
};

app.use(authMiddleware);
app.use(tokenMiddleware);

app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = usersData.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const newUser = req.body;

  usersData.users.push(newUser);

  fs.writeFile("./users.json", JSON.stringify(usersData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving user" });
    }
    res.status(201).json(newUser);
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = usersData.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  usersData.users = usersData.users.filter((u) => u.id !== userId);
  fs.writeFile("./users.json", JSON.stringify(usersData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting user" });
    }
    res.json(user);
  });
});

app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = usersData.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = { ...user, ...req.body };
  usersData.users = usersData.users.map((u) =>
    u.id === userId ? updatedUser : u,
  );

  fs.writeFile("./users.json", JSON.stringify(usersData, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error updating user" });
    }
    res.json(updatedUser);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
