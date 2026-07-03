const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware"); 


router.post("/comprobante", authMiddleware, uploadController.subirComprobante);

module.exports = router;