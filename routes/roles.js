var express = require("express");
var router = express.Router();
const roleController = require("../controllers/role.controller");

router.get("/", roleController.index);
router.get("/add", roleController.add);
router.post("/add", roleController.handleAdd);
router.get("/edit/:id", roleController.edit);
router.post("/edit/:id", roleController.handleEdit);
router.post("/delete/:id", roleController.delete);
module.exports = router;
