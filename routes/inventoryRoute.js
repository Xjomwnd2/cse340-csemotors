// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const { buildDeleteView } = require("../controllers/invController");

// Route to get vehicles details comment
router.get("/detail/:invId", invController.buildVehicleDetail);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to delete
router.get("/delete/:inv_id", invController.buildDeleteView);

// Route to post inventory by classification view
router.post("/update/", invController.updateInventory);

// Existing routes would be here...

// Route to display delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(async (req, res, next) => {
  try {
    const inv_id = parseInt(req.params.inv_id);
    
    // Call controller function to handle delete confirmation view
    await invController.buildDeleteView(req, res, next);
  } catch (error) {
    next(error);
  }
}));

// Route to process the delete request
router.post("/delete", utilities.handleErrors(async (req, res, next) => {
  try {
    // Call controller function to handle the actual deletion
    await invController.deleteInventoryItem(req, res, next);
  } catch (error) {
    next(error);
  }
}));

// Route to display delete confirmation view
router.get("/delete/:inv_id", async (req, res, next) => {
  try {
    const inv_id = parseInt(req.params.inv_id);
    
    // Call controller function to handle delete confirmation view
    await invController.buildDeleteView(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Route to process the delete request
router.post("/delete", async (req, res, next) => {
  try {
    // Call controller function to handle the actual deletion
    await invController.deleteInventoryItem(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

