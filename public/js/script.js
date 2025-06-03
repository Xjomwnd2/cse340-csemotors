function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");

  // Build the header row
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

  // Build each row from the inventory data
  table += "<tbody>";
  data.forEach(function (vehicle) {
    table += `<tr>
      <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
      <td>${vehicle.inv_model}</td>
      <td>${vehicle.inv_year}</td>
      <td>$${vehicle.inv_price.toLocaleString()}</td>
      <td><a href='/inv/edit/${vehicle.inv_id}' title='Click to update'>Modify</a></td>
      <td><a href='/inv/delete/${vehicle.inv_id}' title='Click to delete'>Delete</a></td>
    </tr>`;
  });
  table += "</tbody>";

  // Inject the table into the page
  inventoryDisplay.innerHTML = table;
}


'use strict'

// Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () { 
 let classification_id = classificationList.value 
 console.log(`classification_id is: ${classification_id}`) 
 let classIdURL = "/inv/getInventory/"+classification_id 
 fetch(classIdURL) 
 .then(function (response) { 
  if (response.ok) { 
   return response.json(); 
  } 
  throw Error("Network response was not OK"); 
 }) 
 .then(function (data) { 
  console.log(data); 
  buildInventoryList(data); 
 }) 
 .catch(function (error) { 
  console.log('There was a problem: ', error.message) 
 }) 
})