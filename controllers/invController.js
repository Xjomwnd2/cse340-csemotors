const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { getCommentsByInvId } = require("../models/commentsModel"); // ✅ Comment model
const { getInventoryById } = require("../models/inventory-model");



const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Build Vehicle Detail View (with Comments)
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const invId = parseInt(req.params.invId);

    const vehicle = await invModel.getInventoryById(invId); // existing model method
    const comments = await getCommentsByInvId(invId); // from commentsModel

    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    const nav = await utilities.getNav();

    res.render("./inventory/vehicle-detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
      comments,
      nav,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
async function buildDeleteView(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
}

/* ***************************
 *  buildAddClassification
 *  buildAddInventory
 * ************************** */
async function buildAddClassification(req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    messages: [] // ADD THIS LINE to prevent forEach crash
  });
}

  async function buildByInventoryId(req, res, next) {
  const inv_id = req.params.inv_id;
  let nav = await utilities.getNav();

  try {
    const vehicleData = await invModel.getVehicleById(inv_id);
    if (!vehicleData) {
      throw new Error("Vehicle not found");
    }

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicle: vehicleData
    });
  } catch (error) {
    console.error("Vehicle Detail Error:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      nav,
      message: "Vehicle not found. Please check the ID."
    });
  }
}

/* ***************************
 *  Build Inventory Management View
 * ************************** */
// controllers/invController.js
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
  });
};

async function buildByInventoryId(req, res, next) {
  const inv_id = req.params.inv_id;
  const nav = await utilities.getNav();

  try {
    const vehicle = await invModel.getVehicleById(inv_id);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
    });
  } catch (error) {
    console.error("Error loading vehicle details:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      nav,
      message: "Vehicle not found or a server error occurred.",
    });
  }
}

/* ***************************
 *  Export Controller
 * ************************** */
module.exports = {
  buildByClassificationId: invCont.buildByClassificationId,
  editInventoryView: invCont.editInventoryView,
  getInventoryJSON: invCont.getInventoryJSON,
  updateInventory: invCont.updateInventory,
  buildDeleteView,
  buildByInventoryId,
  buildVehicleDetail: invCont.buildVehicleDetail, 
  buildManagementView: invCont.buildManagementView,
  buildAddClassification,
  buildAddInventory
  // other functions... 
};