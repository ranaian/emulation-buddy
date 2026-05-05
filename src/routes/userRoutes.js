"use strict";
const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();
router.get("/", userController.fetchAllUsers);
router.get("/is-admin", userController.isAdmin);
router.get("/:id", userController.fetchUserById);
router.delete("/:id", userController.removeUser);
router.post("/", userController.createUser);

module.exports = router;
