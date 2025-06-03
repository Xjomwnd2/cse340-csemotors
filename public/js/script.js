'use strict';

// =========================
// Event Listener for Classification Select
// =========================
const classificationList = document.querySelector("#classificationList");

if (classificationList) {
  classificationList.addEventListener("change", function () {
    const classification_id = classificationList.value;
    console.log(`Selected classification_id: ${classification_id}`);

    const classIdURL = `/inv/getInventory/${classification_id}`;

    fetch(classIdURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not OK");
      })
      .then((data) => {
        console.log("Inventory data received:", data);
        buildInventoryList(data);
      })
      .catch((error) => {
        console.error("There was a problem:", error.message);
      });
  });
} else {
  console.error("Classification select element not found!");
}

// =========================
// Build Inventory Table Function
// =========================
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  if (!inventoryDisplay) {
    console.error("inventoryDisplay element not found.");
    return;
  }

  // Build table headers
  let table = `<thead>
    <tr>
      <th>Vehicle Name</th>
      <th>Model</th>
      <th>Year</th>
      <th>Price</th>
      <th>Modify</th>
      <th>Delete</th>
    </tr>
  </thead>`;

  // Build table rows
  table += "<tbody>";
  data.forEach((vehicle) => {
    table += `<tr>
      <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
      <td>${vehicle.inv_model}</td>
      <td>${vehicle.inv_year}</td>
      <td>$${Number(vehicle.inv_price).toLocaleString("en-US")}</td>
      <td><a href='/inv/edit/${vehicle.inv_id}' title='Click to update'>Modify</a></td>
      <td><a href='/inv/delete/${vehicle.inv_id}' title='Click to delete'>Delete</a></td>
    </tr>`;
  });
  table += "</tbody>";

  // Inject into DOM
  inventoryDisplay.innerHTML = table;
}
