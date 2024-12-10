document.addEventListener("DOMContentLoaded", function () {
  const wrestlersContainer = document.getElementById('wrestlers-container');
  const wrestlerDetail = document.getElementById('wrestler-detail');
  const searchInput = document.getElementById('search-bar'); // Reference to the search bar
  let allWrestlers = []; // To store the full list of wrestlers
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
  fetch('WWE_Greatest_Wrestlers_List12.json')
    .then(response => response.text()) // Read as plain text
    .then(data => {
      const cleanData = cleanJSON(data);
      allWrestlers = JSON.parse(cleanData); // Store the full list
      allWrestlers.sort((a, b) => a['Name'].localeCompare(b['Name']));
      displayWrestlers(allWrestlers);
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
      
        // Ensure the YouTube links exist and are in the correct format
        const youtubeEmbedURL1 = wrestler['YouTube Link'] && wrestler['YouTube Link'].includes('watch?v=') 
          ? wrestler['YouTube Link'].replace('watch?v=', 'embed/') 
          : null;
        const youtubeEmbedURL2 = wrestler['YouTube Link 2'] && wrestler['YouTube Link 2'].includes('watch?v=') 
          ? wrestler['YouTube Link 2'].replace('watch?v=', 'embed/') 
          : null;
      
        // Build the wrestler detail HTML
        wrestlerDetail.innerHTML = `
          <div class="close-button">X</div>
          <div class="wrestler-info">
            <div class="wrestler-left">
            <h2 class="wrestler-name-left">${wrestler['Name']}</h2>
            <img 
          class="wrestler-image" 
          src="${wrestler['Image Link']}" 
          alt="${wrestler['Name']}" 
        >
       
              <iframe 
                id="video-player"
                width="100%" 
                height="200" 
                src="${youtubeEmbedURL1 || ''}" 
                title="${wrestler['Name']}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
              ${
                `
                   <div class="video-slider">
                     <button id="video1-button" class="slider-button">Video 1</button>
                     <button id="video2-button" class="slider-button">Video 2</button>
                     <div id="slider-indicator" class="slider-indicator"></div>
                   </div>
                 `
                 
             }
            </div>
            <div class="wrestler-right">
            <h2 class="wrestler-name-right">${wrestler['Name']}</h2>
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
      
        // Add event listeners for slider buttons
        const videoPlayer = document.getElementById('video-player');
        const sliderIndicator = document.getElementById('slider-indicator');
        if (youtubeEmbedURL1 && youtubeEmbedURL2) {
          const video1Button = document.getElementById('video1-button');
          const video2Button = document.getElementById('video2-button');
      
          video1Button.addEventListener('click', () => {
            videoPlayer.src = youtubeEmbedURL1;
            sliderIndicator.style.transform = 'translateX(0%)'; // Move indicator to the left
          });
      
          video2Button.addEventListener('click', () => {
            videoPlayer.src = youtubeEmbedURL2;
            sliderIndicator.style.transform = 'translateX(100%)'; // Move indicator to the right
          });
        }
      
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

  // Event listener for the search input
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredWrestlers = allWrestlers.filter(wrestler => 
      wrestler['Name'].toLowerCase().includes(searchTerm)
    );
    displayWrestlers(filteredWrestlers);
  });
});
