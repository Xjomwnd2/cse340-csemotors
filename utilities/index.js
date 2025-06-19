const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 *************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid =
      '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* *********************************************
 * Build the vehicle detail view HTML END *ADD*
 ******************************************** */

function buildVehicleDetail(vehicle) {
  const usdPrice = vehicle.inv_price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const mileage = vehicle.inv_miles.toLocaleString("en-US");

  return `
  <div class="vehicle-detail">
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
    </div>
    <div class="vehicle-info">
      <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
      <p><strong>Price:</strong> ${usdPrice}</p>
      <p><strong>Mileage:</strong> ${mileage} miles</p>
      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
    </div>
  </div>
  `;
}

Util.buildVehicleDetailHTML = async function (vehicle) {
  if (vehicle) {
    let detailHTML = '<div class="vehicle-detail">';
    detailHTML += '<div class="vehicle-image">';
    detailHTML +=
      '<img src="' +
      vehicle.inv_image +
      '" alt="' +
      vehicle.inv_make +
      ' ' +
      vehicle.inv_model +
      '">';
    detailHTML += '</div>';
    detailHTML += '<div class="vehicle-info">';
    detailHTML +=
      '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>';
    detailHTML +=
      '<p class="price"><strong>Price: $' +
      new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
      '</strong></p>';
    detailHTML +=
      '<p><strong>Description:</strong> ' +
      vehicle.inv_description +
      '</p>';
    detailHTML +=
      '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>';
    detailHTML +=
      '<p><strong>Miles:</strong> ' +
      new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
      '</p>';
    detailHTML += '</div>';
    detailHTML += '</div>';
    return detailHTML;
  }
};




/* ************************
 * Build classification list for dropdown
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList +=
    "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList +=
      '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors =
  (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
