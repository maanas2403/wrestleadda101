document.addEventListener("DOMContentLoaded", function () {
  const wrestlersContainer = document.getElementById('wrestlers-container');
  const wrestlerDetail = document.getElementById('wrestler-detail');
  let audioElement = null; // Keep a reference to the audio element

  // Function to clean up JSON string
  function cleanJSON(jsonString) {
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
    jsonString = jsonString.replace(/[^\x20-\x7E\x0A\x0D]/g, "");
    return jsonString;
  }

  // Function to convert DD/MM/YYYY to a readable date format
  function formatDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(`${month}/${day}/${year}`).toLocaleDateString();
  }

  // Fetch the JSON file
  fetch('WWE_Greatest_Wrestlers_List9.json')
    .then(response => response.text()) // Read as plain text
    .then(data => {
      const cleanData = cleanJSON(data);
      const wrestlers = JSON.parse(cleanData);
      wrestlers.sort((a, b) => a['Name'].localeCompare(b['Name']));
      displayWrestlers(wrestlers);
    })
    .catch(error => console.error('Error loading or cleaning wrestlers data:', error));

  // Function to display wrestlers' names and images
  function displayWrestlers(wrestlers) {
    wrestlersContainer.innerHTML = '';
    wrestlers.forEach(wrestler => {
      const wrestlerBox = document.createElement('div');
      wrestlerBox.classList.add('wrestler-box');
      wrestlerBox.innerHTML = `
        <img src="${wrestler['Image Link']}" alt="${wrestler['Name']}">
        <h3>${wrestler['Name']}</h3>
      `;
      wrestlerBox.onclick = () => showWrestlerDetails(wrestler);
      wrestlersContainer.appendChild(wrestlerBox);
    });
  }

  // Function to show detailed information when a wrestler is clicked
  function showWrestlerDetails(wrestler) {
    wrestlerDetail.style.display = 'block';
    wrestlerDetail.innerHTML = `
      <div class="close-button">X</div>
      <div class="wrestler-info">
        <div class="wrestler-left">
          <img src="${wrestler['Image Link']}" alt="${wrestler['Name']}">
        </div>
        <div class="wrestler-right">
          <h2>${wrestler['Name']}</h2>
          <p><strong>Date of Birth:</strong> ${formatDate(wrestler['Date of Birth'])}</p>
          <p><strong>Style of Wrestling:</strong> ${wrestler['Style of Wrestling']}</p>
          <p><strong>Finisher Move:</strong> ${wrestler['Finisher Move']}</p>
          <p><strong>Era:</strong> ${wrestler['Era']}</p>
          <p><strong>Greatest Match:</strong> ${wrestler['Greatest Match']}</p>
          <p><strong>Greatest Moment:</strong> ${wrestler['Greatest Moment']}</p>
          <p><strong>Greatest Rival:</strong> ${wrestler['Greatest Rival']}</p>
        </div>
      </div>
    `;

    // Add the audio element and start playing the audio
    audioElement = new Audio(wrestler['Audio Link']);
    audioElement.play();

    // Bind the close button after it's been added to the DOM
    const closeButton = wrestlerDetail.querySelector('.close-button');
    closeButton.addEventListener('click', closeWrestlerDetails);
  }

  // Function to close the wrestler details and stop the audio
  function closeWrestlerDetails() {
    wrestlerDetail.style.display = 'none';
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset audio to the start
      audioElement = null; // Clear the reference
    }
  }
});
