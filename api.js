const url = " ";

async function fetchData(address) {
  const endpoint = url + address;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      // Custom error messaging
      const errorMessage = handleClientErrors(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("JavaScript Object:", data);
    return data; // Return data for use outside of function

  } catch (error) {
    // Handles Error
    console.error(error);
    document.getElementById("user-error").innerHTML = `
      <div class="error-message">
        <h3>Oops! ${error.message}</h3>
      </div>`;
  }
}

function handleClientErrors(response) {
  switch (response.status) {
    case 400: 
      return "Bad Request - Check your data format";
    case 401: 
      return "Unauthorized - You need to log in first";
    case 403: 
      return "Forbidden - You don't have permission for this";
    case 404: 
      return "Not Found - This item doesn't exist";
    case 422: 
      return "Invalid Data - Check your input fields";
    default: 
      return `Client Error ${response.status} - Check your request`;
  }
}