// TODO: onload function should retrieve the data needed to populate the UI

// to display user friendly messages for Error handling
const statusErrorMsg = {
  400: "The request was invalid. Please check your data and try again.",
  404: "Request Resource not found, Please check and try again",
  500: "Error occurred on server, please try again",
};

// processes the server's response to a request
function handleResponse(response) {
  if (!response.ok) {
    //response.status gives us status code, we check our object for the appropriate msg
    //if the response is unsuccessful, find and throw the correct error
    const errorMsg = statusErrorMsg[response.status] || "An Error has occurred";
    throw new Error(errorMsg);
  }
  // if response is successful, convert response to JSON and return
  return response.json();
}

//update UI to notify user about the specific error
function showError(errorMSg) {
  var errorElement = document.getElementById("error-msg");
  errorElement.innerHTML = errorMSg;

  // show class displays the error message to the user
  errorElement.classList.add("show");
}

/* ============================================
    Helper functions for Fetching (Get & Post)
===============================================*/

const baseUrl = "http://localhost:8080/spamDetector-1.0/api/";

// perform GET request
function getFetchMe(endpoint, updateFunc) {
  const url = `${baseUrl}${endpoint}`;

  fetch(url, {
    method: "GET",
  })
    //handle the response, includes check for errors
    .then(handleResponse)
    .then((data) => {
      // uses the received  data to update the user interface {this includes functions that update the Accuracy  and Precision  along with table values}
      updateFunc(data);
    })
    .catch((err) => {
      console.error("Problem with fetch operation, ", err);
    });
}

// perform POST request
function postFetchMe(endpoint, data, sendFunc) {
  const url = `${baseUrl}${endpoint}`;

  //Initialize configuration for the fetch request
  let config = {
    method: "POST",
    headers: {},
    body: data,
  };

  // check if file is formData to handle file uploads
  if (data instanceof FormData) {
    config.body = data;
  } else {
    //for JSON data set header and stringify body
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(data);
  }

  fetch(url, config)
    //check and process the server response
    .then(handleResponse)
    .then((data) => {
      // this includes functions that deal with sending to server
      sendFunc(data);
    })

    .catch((err) => {
      //Display a specific error message to user interface
      showError(err);
      console.error("Problem with fetch operation, ", err);
    });
}

/* =======================================
  Fetching Get Functions
==========================================*/

function updateTable() {
  getFetchMe(`${baseUrl}spam`, (data) => {
    const table = document.querySelector("#spam-analysis-table tbody");

    //create HTML template

    const newRowHTML = `
      <tr class="table-body-row">
        <td class="file-col">
          <p class="file-text">${data.file}</p>
        </td>
        <td class="spam-prob-col">
          <p class="prob-text">${data.spamProbability.toFixed(5)}</p>
        </td>
        <td class="class-col">
          <p class="class-text">${data.actualClass}</p>
        </td>
      </tr>
    `;

    // add the new row to our table body
    table.innerHTML = table.innerHTML + newRowHTML;
  });
}
function updateAccuracy() {
  getFetchMe(`${baseUrl}accuracy`, (data) => {
    const accuracyField = document.getElementById("accuracy-output");
    accuracyField.textContent = `${(data.val * 100).toFixed(2)}%`;
  });
}
function updatePrecision() {
  getFetchMe(`${baseUrl}precision`, (data) => {
    const precisionField = document.getElementById("precision-output");
    precisionField.textContent = `${(data.val * 100).toFixed(2)}%`;
  });
}

/* =====================================
    Drop Box Feature (work in progress)
========================================*/

// doc: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

/* event handlers

  - 'dragenter': fired when a dragged item enters a valid drop target
  - 'dragover' : fired continuously  as a dragged item is being dragged
  - 'dragleave': fired when a dragged item leaves a valid drop target
  - 'drop'     : fired when an item is dropped on a valid drop target

*/

/*let dropArea = document
  .getElementById("drop-area")
  .addEventListener("drop", handleDrop);

// handle file drop event
function handleDrop(e) {
  //prevent default behavior of file being opened
  e.preventDefault();
  e.stopPropagation();

  var data = e.dataTransfer;

  if (data.items) {
    //access each dragged item
    [...data.items].forEach((item, i) => {
      //check to see if dropped items are files
      if (item.kind === "file") {
        // if the item is a file, retrieve it
        const file = item.getAsFile();
      }
    });
  }
}

// The submitFile button onclick calls the uploadFiles function
document.getElementById("submit-files-btn").addEventListener("click", () => {
  uploadFiles(files);
});

// uploads files to server
function uploadFiles(files) {
  //files is an array that holds individual files

  let url = "/upload";
  // Form Data is used for file uploads
  let formData = new FormData();

  //loop through files array
  for (let i = 0; i < files.length; i++) {
    formData.append("file", files[i]); // appends key: "file" along with the file name
  }

  //send file to server
  postFetchMe(url, formData, (response) => {
    // to fill in
  }).catch((err) => {
    // Handle any error that occured when sending file to server
    showError(`Error when sending files to server: ${err}`);
  });
}*/
