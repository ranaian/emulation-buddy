"use strict";
const model = require("../config/userModel");
async function fetchAllUsers(req, res) {
  try {
    const users = await model.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

async function fetchUserById(req, res) {
  const id = req.params.id;
  if (id) {
    try {
      const user = await model.getOneUserById(id);
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    res.status(400).send("Missing required id param!");
  }
}

async function removeUser(req, res) {
  const id = req.params.id;
  if (id) {
    try {
      const deletedCount = await model.deleteUser(id);
      if (deletedCount > 0) {
        res.send(`User with id ${id} deleted successfully.`);
      } else {
        res.status(404).send("User not found.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    res.status(400).send("Missing required id param!");
  }
}

async function createUser(req, res) {
  const { name, email, password } = req.body;
  if (name && email && password) {
    try {
      const newUser = await model.addUser(name, email, password);
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    res.status(400).send("Missing required user fields!");
  }
}

async function isAdmin(req, res) {
  const email = req.query.email;
  if (email) {
    try {
      const adminStatus = await model.isAdmin(email);
      res.json({ isAdmin: !!adminStatus });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(400).send("Missing email param");
  }
}

module.exports = {
  fetchAllUsers,
  fetchUserById,
  removeUser,
  createUser,
  isAdmin,
};
