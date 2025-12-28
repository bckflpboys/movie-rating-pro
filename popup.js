// Rating categories and their IDs
const ratingCategories = [
  'first30',
  'middleHour',
  'last30',
  'sound',
  'music',
  'quality',
  'directing',
  'acting',
  'screenplay',
  'cinematography'
];

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  initializeSliders();
  setupEventListeners();
  updateTotalScore();
  autoFillMovieTitle(); // Automatically detect and fill movie title
  loadCustomFields(); // Load and display custom fields
  loadRatingCategorySettings();
  loadTrendingMovies(); // Load and apply rating category settings
});

// Automatically detect and fill the movie title from the active tab
async function autoFillMovieTitle(force = false) {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      console.log('No active tab found');
      return;
    }

    // Send message to content script to get the movie title
    chrome.tabs.sendMessage(tab.id, { action: 'getMovieTitle' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Could not detect movie title:', chrome.runtime.lastError.message);
        return;
      }

      if (response && response.title) {
        const movieTitleInput = document.getElementById('movieTitle');
        const dateWatchedInput = document.getElementById('dateWatched');

        // Only fill if empty or if forced (manual refresh)
        if (movieTitleInput && (!movieTitleInput.value || force)) {
          movieTitleInput.value = response.title;

          // Add a subtle animation to show the title was auto-filled
          movieTitleInput.style.backgroundColor = '#10B98120';
          setTimeout(() => {
            movieTitleInput.style.backgroundColor = '';
          }, 1000);

          console.log('Auto-filled movie title:', response.title);
        }

        // Auto-fill date watched with current date and time
        if (dateWatchedInput && (!dateWatchedInput.value || force)) {
          const now = new Date();
          // Format for datetime-local input: YYYY-MM-DDTHH:MM
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

          dateWatchedInput.value = formattedDateTime;

          // Add a subtle animation to show the date was auto-filled
          dateWatchedInput.style.backgroundColor = '#10B98120';
          setTimeout(() => {
            dateWatchedInput.style.backgroundColor = '';
          }, 1000);

          console.log('Auto-filled date watched:', formattedDateTime);
        }
      } else if (force) {
        showNotification('Could not detect movie title on this page', 'error');
      }
    });
  } catch (error) {
    console.error('Error auto-filling movie title:', error);
    if (force) {
      showNotification('Error detecting movie title', 'error');
    }
  }
}

// Load and display custom fields
async function loadCustomFields() {
  try {
    const result = await chrome.storage.local.get(['customFields']);
    const customFields = result.customFields || [];

    if (customFields.length === 0) {
      return; // No custom fields to display
    }

    // Find the container to insert custom fields (after Date Watched section)
    const dateWatchedSection = document.querySelector('.movie-title-section:nth-child(2)');

    if (!dateWatchedSection) {
      console.error('Could not find date watched section');
      return;
    }

    // Remove any existing custom fields first
    document.querySelectorAll('.custom-field-section').forEach(el => el.remove());

    // Create and insert custom fields
    customFields.forEach(field => {
      const fieldSection = createCustomFieldElement(field);
      dateWatchedSection.insertAdjacentElement('afterend', fieldSection);
    });

    console.log(`Loaded ${customFields.length} custom field(s)`);
  } catch (error) {
    console.error('Error loading custom fields:', error);
  }
}

// Load and apply rating category settings
async function loadRatingCategorySettings() {
  try {
    const result = await chrome.storage.local.get(['ratingCategorySettings']);
    const ratingCategorySettings = result.ratingCategorySettings || {};

    // Hide disabled rating categories
    ratingCategories.forEach(category => {
      const isEnabled = ratingCategorySettings[category] !== false; // Default to enabled
      const ratingItem = document.getElementById(category)?.closest('.rating-item');

      if (ratingItem) {
        if (!isEnabled) {
          ratingItem.style.display = 'none';
        } else {
          ratingItem.style.display = '';
        }
      }
    });

    // Hide sections if all their categories are disabled
    hideSectionsIfEmpty();

    console.log('Rating category settings applied');
  } catch (error) {
    console.error('Error loading rating category settings:', error);
  }
}

// Hide sections if all rating items are hidden
function hideSectionsIfEmpty() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const ratingItems = section.querySelectorAll('.rating-item');
    const visibleItems = Array.from(ratingItems).filter(item => item.style.display !== 'none');

    if (ratingItems.length > 0 && visibleItems.length === 0) {
      section.style.display = 'none';
    } else {
      section.style.display = '';
    }
  });
}

// Create a custom field element
function createCustomFieldElement(field) {
  const section = document.createElement('div');
  section.className = 'movie-title-section custom-field-section';
  section.dataset.fieldId = field.id;

  const label = document.createElement('label');
  label.htmlFor = field.id;
  label.className = 'section-label';
  label.textContent = field.label;

  let input;

  switch (field.type) {
    case 'slider':
      // Create a rating slider similar to default ones
      const sliderContainer = document.createElement('div');
      sliderContainer.className = 'rating-item';

      const sliderHeader = document.createElement('div');
      sliderHeader.className = 'rating-header';

      const sliderLabel = document.createElement('span');
      sliderLabel.className = 'rating-label';
      sliderLabel.textContent = field.label;

      const sliderValue = document.createElement('span');
      sliderValue.className = 'rating-value';
      sliderValue.id = `${field.id}Value`;
      sliderValue.textContent = '5';

      sliderHeader.appendChild(sliderLabel);
      sliderHeader.appendChild(sliderValue);

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '1';
      slider.max = '10';
      slider.value = '5';
      slider.className = 'rating-slider';
      slider.id = field.id;

      // Add input event listener for real-time updates
      slider.addEventListener('input', (e) => {
        sliderValue.textContent = e.target.value;
        animateValueChange(sliderValue);
        updateTotalScore(); // Update total score when custom slider changes
      });

      sliderContainer.appendChild(sliderHeader);
      sliderContainer.appendChild(slider);

      // For slider type, we don't use the standard label/input structure
      // Instead, return the complete slider container wrapped in section
      section.appendChild(sliderContainer);
      return section;

    case 'textarea':
      input = document.createElement('textarea');
      input.className = 'movie-title-input';
      input.rows = 3;
      break;
    case 'select':
      input = document.createElement('select');
      input.className = 'movie-title-input';
      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select an option...';
      input.appendChild(defaultOption);
      // Add custom options
      if (field.options && Array.isArray(field.options)) {
        field.options.forEach(optionText => {
          const option = document.createElement('option');
          option.value = optionText;
          option.textContent = optionText;
          input.appendChild(option);
        });
      }
      break;
    default:
      input = document.createElement('input');
      input.type = field.type;
      input.className = 'movie-title-input';
  }

  input.id = field.id;
  input.placeholder = field.placeholder || `Enter ${field.label.toLowerCase()}...`;

  section.appendChild(label);
  section.appendChild(input);

  return section;
}

// Initialize all rating sliders
function initializeSliders() {
  ratingCategories.forEach(category => {
    const slider = document.getElementById(category);
    const valueDisplay = document.getElementById(`${category}Value`);

    if (slider && valueDisplay) {
      // Set initial value
      valueDisplay.textContent = slider.value;

      // Add input event listener
      slider.addEventListener('input', (e) => {
        valueDisplay.textContent = e.target.value;
        updateTotalScore();
        animateValueChange(valueDisplay);
      });
    }
  });
}

// Setup all event listeners
function setupEventListeners() {
  // Save button
  document.getElementById('saveBtn').addEventListener('click', saveRating);

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetForm);

  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', () => {
    window.location.href = 'settings.html';
  });

  // View ratings button
  document.getElementById('viewRatingsBtn').addEventListener('click', showSavedRatings);

  // Back button
  document.getElementById('backBtn').addEventListener('click', showRatingForm);

  // Back to list button (from detail view)
  document.getElementById('backToListBtn').addEventListener('click', showSavedRatings);

  // Refresh title button
  document.getElementById('refreshTitleBtn').addEventListener('click', () => {
    const btn = document.getElementById('refreshTitleBtn');
    btn.classList.add('spinning');
    autoFillMovieTitle(true); // Force refresh
    setTimeout(() => {
      btn.classList.remove('spinning');
    }, 1000);
  });
}

// Animate value change
function animateValueChange(element) {
  element.style.transform = 'scale(1.2)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 200);
}

// Calculate and update total score
function updateTotalScore() {
  let total = 0;
  let count = 0;

  // Add default rating categories
  ratingCategories.forEach(category => {
    const slider = document.getElementById(category);
    if (slider) {
      total += parseInt(slider.value);
      count++;
    }
  });

  // Add custom slider ratings
  document.querySelectorAll('.custom-field-section input[type="range"]').forEach(slider => {
    total += parseInt(slider.value);
    count++;
  });

  const average = count > 0 ? total / count : 0;
  const scoreElement = document.getElementById('totalScore');
  scoreElement.textContent = average.toFixed(1);

  // Update stars display
  updateStarsDisplay(average);
}

// Update stars based on score
function updateStarsDisplay(score) {
  const stars = document.querySelectorAll('#starsDisplay .star');
  const fullStars = Math.floor(score / 2);
  const hasHalfStar = (score / 2) % 1 >= 0.5;

  stars.forEach((star, index) => {
    star.classList.remove('filled', 'half-filled');

    if (index < fullStars) {
      star.classList.add('filled');
    } else if (index === fullStars && hasHalfStar) {
      star.classList.add('half-filled');
    }
  });
}

// Save rating to Chrome storage
async function saveRating() {
  const movieTitle = document.getElementById('movieTitle').value.trim();
  const dateWatched = document.getElementById('dateWatched').value;

  if (!movieTitle) {
    showNotification('Please enter a movie title', 'error');
    document.getElementById('movieTitle').focus();
    return;
  }

  // Collect all ratings
  const ratings = {};
  ratingCategories.forEach(category => {
    const slider = document.getElementById(category);
    if (slider) {
      ratings[category] = parseInt(slider.value);
    }
  });

  // Collect custom field values
  const customFieldValues = {};
  const result = await chrome.storage.local.get(['customFields']);
  const customFieldDefs = result.customFields || [];

  document.querySelectorAll('.custom-field-section').forEach(section => {
    const fieldId = section.dataset.fieldId;
    const input = section.querySelector('input, textarea, select');
    if (input && fieldId) {
      // Find field definition to check if it's a slider
      const fieldDef = customFieldDefs.find(f => f.id === fieldId);
      if (fieldDef && fieldDef.type === 'slider') {
        // Store slider values as integers
        customFieldValues[fieldId] = parseInt(input.value);
      } else {
        customFieldValues[fieldId] = input.value;
      }
    }
  });

  // Calculate total score including custom sliders
  let total = Object.values(ratings).reduce((sum, val) => sum + val, 0);
  let count = ratingCategories.length;

  // Add custom slider values to the total
  for (const [fieldId, fieldValue] of Object.entries(customFieldValues)) {
    const fieldDef = customFieldDefs.find(f => f.id === fieldId);
    if (fieldDef && fieldDef.type === 'slider' && typeof fieldValue === 'number') {
      total += fieldValue;
      count++;
    }
  }

  const average = count > 0 ? total / count : 0;

  // Create rating object
  const rating = {
    id: Date.now(),
    movieTitle,
    ratings,
    customFields: customFieldValues, // Add custom field values
    totalScore: parseFloat(average.toFixed(1)),
    date: dateWatched ? new Date(dateWatched).toISOString() : new Date().toISOString(),
    dateWatched: dateWatched || null,
    timestamp: Date.now()
  };

  // Save to Chrome storage
  try {
    const result = await chrome.storage.local.get(['movieRatings']);
    const movieRatings = result.movieRatings || [];
    movieRatings.unshift(rating); // Add to beginning of array

    await chrome.storage.local.set({ movieRatings });

    showNotification('Rating saved successfully!', 'success');
    animateSuccess();

    // Reset form after short delay
    setTimeout(() => {
      resetForm();
    }, 1500);
  } catch (error) {
    console.error('Error saving rating:', error);
    showNotification('Error saving rating', 'error');
  }
}

// Reset form to default values
function resetForm() {
  document.getElementById('movieTitle').value = '';
  document.getElementById('dateWatched').value = '';

  // Reset custom fields
  document.querySelectorAll('.custom-field-section').forEach(section => {
    const input = section.querySelector('input, textarea, select');
    if (input) {
      if (input.tagName === 'SELECT') {
        input.selectedIndex = 0;
      } else if (input.type === 'range') {
        // Reset slider to default value of 5
        input.value = '5';
        const valueDisplay = document.getElementById(`${input.id}Value`);
        if (valueDisplay) {
          valueDisplay.textContent = '5';
        }
      } else {
        input.value = '';
      }
    }
  });

  ratingCategories.forEach(category => {
    const slider = document.getElementById(category);
    const valueDisplay = document.getElementById(`${category}Value`);

    if (slider && valueDisplay) {
      slider.value = 5;
      valueDisplay.textContent = '5';
    }
  });

  updateTotalScore();
}

// Show saved ratings view
async function showSavedRatings() {
  document.getElementById('ratingForm').classList.add('hidden');
  document.getElementById('savedRatings').classList.remove('hidden');

  await loadSavedRatings();
}

// Show rating form view
function showRatingForm() {
  document.getElementById('savedRatings').classList.add('hidden');
  document.getElementById('ratingForm').classList.remove('hidden');
}

// Load and display saved ratings
async function loadSavedRatings() {
  const ratingsList = document.getElementById('ratingsList');
  const resultText = document.getElementById('resultText');

  try {
    const result = await chrome.storage.local.get(['movieRatings']);
    const movieRatings = result.movieRatings || [];

    // Store all ratings globally
    allRatings = movieRatings;

    if (movieRatings.length === 0) {
      ratingsList.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M32 8L38 24L54 26L43 37L46 53L32 46L18 53L21 37L10 26L26 24L32 8Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <p>No ratings saved yet.<br>Start rating your first movie!</p>
        </div>
      `;
      if (resultText) {
        resultText.textContent = '0 ratings';
      }
      return;
    }

    // Initialize filters and apply
    initializeSearchAndFilters();
    applyFiltersAndSort();

  } catch (error) {
    console.error('Error loading ratings:', error);
    ratingsList.innerHTML = '<div class="error-state">Error loading ratings</div>';
  }
}

// Create HTML for a rating card
function createRatingCard(rating) {
  const date = new Date(rating.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const stars = generateStarsHTML(rating.totalScore);

  // Get top 4 categories to display
  const topCategories = [
    { label: 'Acting', value: rating.ratings.acting },
    { label: 'Directing', value: rating.ratings.directing },
    { label: 'Music', value: rating.ratings.music },
    { label: 'Quality', value: rating.ratings.quality }
  ];

  return `
    <div class="rating-card" data-id="${rating.id}">
      <div class="rating-card-header">
        <div>
          <div class="rating-card-title">${escapeHtml(rating.movieTitle)}</div>
          <div class="rating-card-date">${formattedDate}</div>
        </div>
        <div class="rating-card-score">
          <div class="rating-card-number">${rating.totalScore}</div>
          <div class="rating-card-stars">${stars}</div>
        </div>
      </div>
      <div class="rating-card-details">
        ${topCategories.map(cat => `
          <div class="rating-detail">
            <span>${cat.label}</span>
            <span class="rating-detail-value">${cat.value}/10</span>
          </div>
        `).join('')}
      </div>
      <button class="delete-btn" data-id="${rating.id}">Delete Rating</button>
    </div>
  `;
}

// Generate stars HTML
function generateStarsHTML(score) {
  const fullStars = Math.floor(score / 2);
  const hasHalfStar = (score / 2) % 1 >= 0.5;
  let starsHTML = '';

  for (let i = 0; i < 5; i++) {
    const fillClass = i < fullStars ? 'filled' : (i === fullStars && hasHalfStar ? 'half-filled' : '');
    starsHTML += `<svg class="star ${fillClass}" viewBox="0 0 24 24"><path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z"/></svg>`;
  }

  return starsHTML;
}

// Delete a rating
async function deleteRating(ratingId) {
  if (!confirm('Are you sure you want to delete this rating?')) {
    return;
  }

  try {
    const result = await chrome.storage.local.get(['movieRatings']);
    const movieRatings = result.movieRatings || [];
    const updatedRatings = movieRatings.filter(r => r.id !== ratingId);

    await chrome.storage.local.set({ movieRatings: updatedRatings });
    await loadSavedRatings();

    showNotification('Rating deleted', 'success');
  } catch (error) {
    console.error('Error deleting rating:', error);
    showNotification('Error deleting rating', 'error');
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#8B5CF6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

// Animate success
function animateSuccess() {
  const scoreCard = document.querySelector('.score-card');
  scoreCard.classList.add('success-animation');
  setTimeout(() => {
    scoreCard.classList.remove('success-animation');
  }, 500);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show detailed rating view
async function showRatingDetail(rating) {
  // Hide saved ratings list
  document.getElementById('savedRatings').classList.add('hidden');

  // Show detail view
  const detailView = document.getElementById('ratingDetailView');
  detailView.classList.remove('hidden');

  // Format date
  const date = new Date(rating.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate stars HTML
  const stars = generateStarsHTML(rating.totalScore);

  // Category labels mapping
  const categoryLabels = {
    first30: 'First 30 Minutes',
    middleHour: 'Middle Hour',
    last30: 'Last 30 Minutes',
    sound: 'Sound Design',
    music: 'Music Score',
    quality: 'Visual Quality',
    directing: 'Directing',
    acting: 'Acting',
    screenplay: 'Screenplay',
    cinematography: 'Cinematography'
  };

  // Group categories
  const timeSegments = ['first30', 'middleHour', 'last30'];
  const productionQuality = ['sound', 'music', 'quality'];
  const creativeAspects = ['directing', 'acting', 'screenplay', 'cinematography'];

  // Load custom fields definitions to get labels
  let customFieldsHTML = '';
  if (rating.customFields && Object.keys(rating.customFields).length > 0) {
    try {
      const result = await chrome.storage.local.get(['customFields']);
      const customFieldDefs = result.customFields || [];

      const customFieldsData = [];
      const customSliderData = [];

      for (const [fieldId, fieldValue] of Object.entries(rating.customFields)) {
        if (fieldValue || fieldValue === 0) { // Show fields with values (including 0)
          const fieldDef = customFieldDefs.find(f => f.id === fieldId);
          const label = fieldDef ? fieldDef.label : fieldId;

          // Separate sliders from other fields
          if (fieldDef && fieldDef.type === 'slider') {
            customSliderData.push({ label, value: fieldValue });
          } else if (fieldValue) { // Only show non-slider fields if they have non-empty values
            customFieldsData.push({ label, value: fieldValue });
          }
        }
      }

      // Build HTML for custom sliders (if any)
      let customSlidersHTML = '';
      if (customSliderData.length > 0) {
        customSlidersHTML = `
          <div class="detail-section">
            <h3 class="detail-section-title">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              </svg>
              Custom Ratings
            </h3>
            <div class="detail-ratings">
              ${customSliderData.map(field => `
                <div class="detail-rating-item">
                  <div class="detail-rating-label">${escapeHtml(field.label)}</div>
                  <div class="detail-rating-bar-container">
                    <div class="detail-rating-bar" style="width: ${field.value * 10}%"></div>
                  </div>
                  <div class="detail-rating-value">${field.value}/10</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Build HTML for other custom fields (if any)
      let customFieldsTextHTML = '';
      if (customFieldsData.length > 0) {
        customFieldsTextHTML = `
          <div class="detail-section">
            <h3 class="detail-section-title">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Additional Information
            </h3>
            <div class="detail-custom-fields">
              ${customFieldsData.map(field => `
                <div class="detail-custom-field">
                  <div class="detail-rating-label">${escapeHtml(field.label)}</div>
                  <div class="detail-custom-field-value">${escapeHtml(field.value)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Combine both sections
      customFieldsHTML = customSlidersHTML + customFieldsTextHTML;
    } catch (error) {
      console.error('Error loading custom fields for detail view:', error);
    }
  }

  // Create detail HTML
  const detailContent = document.getElementById('ratingDetailContent');
  detailContent.innerHTML = `
    <div class="detail-header">
      <h2 class="detail-title">${escapeHtml(rating.movieTitle)}</h2>
      <p class="detail-date">${formattedDate}</p>
    </div>
    
    <div class="detail-score-card">
      <div class="detail-stars">${stars}</div>
      <div class="detail-score-number">${rating.totalScore}</div>
      <div class="detail-score-label">out of 10</div>
    </div>
    
    <div class="detail-section">
      <h3 class="detail-section-title">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" />
          <path d="M10 6V10L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Time Segments
      </h3>
      <div class="detail-ratings">
        ${timeSegments.map(cat => `
          <div class="detail-rating-item">
            <div class="detail-rating-label">${categoryLabels[cat]}</div>
            <div class="detail-rating-bar-container">
              <div class="detail-rating-bar" style="width: ${rating.ratings[cat] * 10}%"></div>
            </div>
            <div class="detail-rating-value">${rating.ratings[cat]}/10</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="detail-section">
      <h3 class="detail-section-title">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M18 8L20 6V14L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Production Quality
      </h3>
      <div class="detail-ratings">
        ${productionQuality.map(cat => `
          <div class="detail-rating-item">
            <div class="detail-rating-label">${categoryLabels[cat]}</div>
            <div class="detail-rating-bar-container">
              <div class="detail-rating-bar" style="width: ${rating.ratings[cat] * 10}%"></div>
            </div>
            <div class="detail-rating-value">${rating.ratings[cat]}/10</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="detail-section">
      <h3 class="detail-section-title">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        </svg>
        Creative Aspects
      </h3>
      <div class="detail-ratings">
        ${creativeAspects.map(cat => `
          <div class="detail-rating-item">
            <div class="detail-rating-label">${categoryLabels[cat]}</div>
            <div class="detail-rating-bar-container">
              <div class="detail-rating-bar" style="width: ${rating.ratings[cat] * 10}%"></div>
            </div>
            <div class="detail-rating-value">${rating.ratings[cat]}/10</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    ${customFieldsHTML}
    
    <div class="detail-actions">
      <button class="btn btn-secondary detail-delete-btn" data-id="${rating.id}">Delete Rating</button>
    </div>
  `;

  // Add delete button event listener
  const deleteBtn = detailContent.querySelector('.detail-delete-btn');
  deleteBtn.addEventListener('click', () => {
    if (confirm(`Are you sure you want to delete the rating for "${rating.movieTitle}"?`)) {
      deleteRating(rating.id);
      showSavedRatings(); // Go back to list after deleting
    }
  });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .rating-value {
    transition: transform 0.2s ease;
  }
`;
document.head.appendChild(style);

// Global variables for filtering and sorting
let allRatings = [];
let filteredRatings = [];
let currentFilters = {
  search: '',
  scoreRange: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date-desc'
};

// Initialize search and filter controls
function initializeSearchAndFilters() {
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const sortSelect = document.getElementById('sortSelect');
  const scoreFilter = document.getElementById('scoreFilter');
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const advancedFilters = document.getElementById('advancedFilters');
  const clearFilters = document.getElementById('clearFilters');
  const applyFilters = document.getElementById('applyFilters');

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      clearSearch.style.display = e.target.value ? 'block' : 'none';
      applyFiltersAndSort();
    });
  }

  // Clear search
  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      currentFilters.search = '';
      clearSearch.style.display = 'none';
      applyFiltersAndSort();
    });
  }

  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      applyFiltersAndSort();
    });
  }

  // Score filter
  if (scoreFilter) {
    scoreFilter.addEventListener('change', (e) => {
      currentFilters.scoreRange = e.target.value;
      applyFiltersAndSort();
    });
  }

  // Filter toggle
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      advancedFilters.classList.toggle('hidden');
      filterToggleBtn.classList.toggle('active');
    });
  }

  // Clear filters
  if (clearFilters) {
    clearFilters.addEventListener('click', () => {
      document.getElementById('dateFrom').value = '';
      document.getElementById('dateTo').value = '';
      currentFilters.dateFrom = '';
      currentFilters.dateTo = '';
      applyFiltersAndSort();
    });
  }

  // Apply filters
  if (applyFilters) {
    applyFilters.addEventListener('click', () => {
      currentFilters.dateFrom = document.getElementById('dateFrom').value;
      currentFilters.dateTo = document.getElementById('dateTo').value;
      applyFiltersAndSort();
    });
  }
}

// Apply filters and sort
function applyFiltersAndSort() {
  // Start with all ratings
  filteredRatings = [...allRatings];

  // Apply search filter
  if (currentFilters.search) {
    const searchLower = currentFilters.search.toLowerCase();
    filteredRatings = filteredRatings.filter(rating =>
      rating.movieTitle.toLowerCase().includes(searchLower)
    );
  }

  // Apply score filter
  if (currentFilters.scoreRange !== 'all') {
    const [min, max] = currentFilters.scoreRange.split('-').map(Number);
    filteredRatings = filteredRatings.filter(rating =>
      rating.totalScore >= min && rating.totalScore <= max
    );
  }

  // Apply date range filter
  if (currentFilters.dateFrom) {
    const fromDate = new Date(currentFilters.dateFrom);
    filteredRatings = filteredRatings.filter(rating =>
      new Date(rating.date) >= fromDate
    );
  }

  if (currentFilters.dateTo) {
    const toDate = new Date(currentFilters.dateTo);
    toDate.setHours(23, 59, 59, 999); // End of day
    filteredRatings = filteredRatings.filter(rating =>
      new Date(rating.date) <= toDate
    );
  }

  // Apply sorting
  filteredRatings.sort((a, b) => {
    switch (currentFilters.sortBy) {
      case 'date-desc':
        return b.id - a.id;
      case 'date-asc':
        return a.id - b.id;
      case 'score-desc':
        return b.totalScore - a.totalScore;
      case 'score-asc':
        return a.totalScore - b.totalScore;
      case 'title-asc':
        return a.movieTitle.localeCompare(b.movieTitle);
      case 'title-desc':
        return b.movieTitle.localeCompare(a.movieTitle);
      default:
        return 0;
    }
  });

  // Update display
  displayFilteredRatings();
}

// Display filtered ratings
function displayFilteredRatings() {
  const ratingsList = document.getElementById('ratingsList');
  const resultText = document.getElementById('resultText');

  // Update results count
  const total = allRatings.length;
  const shown = filteredRatings.length;
  if (shown === total) {
    resultText.textContent = `${total} rating${total !== 1 ? 's' : ''}`;
  } else {
    resultText.textContent = `Showing ${shown} of ${total} ratings`;
  }

  // Display ratings
  if (filteredRatings.length === 0) {
    ratingsList.innerHTML = '<div class="no-ratings">No ratings found</div>';
    return;
  }

  ratingsList.innerHTML = filteredRatings.map(rating => createRatingCard(rating)).join('');

  // Add click event listeners
  document.querySelectorAll('.rating-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.delete-btn')) return;
      const ratingId = parseInt(card.dataset.id);
      const rating = allRatings.find(r => r.id === ratingId);
      if (rating) {
        showRatingDetail(rating);
      }
    });
  });

  // Add delete button event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ratingId = parseInt(btn.dataset.id);
      deleteRating(ratingId);
    });
  });
}

// TMDB API Configuration (Free API - no key needed for trending)
const TMDB_API_KEY = 'YOUR_API_KEY_HERE'; // Users can get free key from themoviedb.org
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Load trending movies
async function loadTrendingMovies() {
  const carousel = document.getElementById('trendingCarousel');
  if (!carousel) return;

  try {
    // Using a demo API key - users should get their own from themoviedb.org
    const apiKey = '8265bd1679663a7ea12ac168da84d2e8'; // Demo key
    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }

    const data = await response.json();
    const movies = data.results.slice(0, 10); // Get top 10

    if (movies.length === 0) {
      carousel.innerHTML = '<div class="trending-error">No trending movies available</div>';
      return;
    }

    carousel.innerHTML = movies.map(movie => `
      <div class="trending-movie" data-movie-title="${escapeHtml(movie.title)}">
        <div class="trending-poster">
          ${movie.vote_average ? `
            <div class="trending-rating">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1l2.5 6.5L19 8.5l-5 5 1.5 6.5L10 17l-5.5 3.5L6 14l-5-5 6.5-1L10 1z"/>
              </svg>
              ${movie.vote_average.toFixed(1)}
            </div>
          ` : ''}
          <img src="${movie.poster_path ? TMDB_IMAGE_BASE + movie.poster_path : 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'180\'%3E%3Crect fill=\'%23333\' width=\'120\' height=\'180\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23666\' font-size=\'14\'%3ENo Image%3C/text%3E%3C/svg%3E'}" 
               alt="${escapeHtml(movie.title)}"
               loading="lazy">
        </div>
        <div class="trending-movie-title">${escapeHtml(movie.title)}</div>
      </div>
    `).join('');

    // Start auto-scrolling
    startAutoScroll();

    // Add click handlers to auto-fill movie title
    carousel.querySelectorAll('.trending-movie').forEach(movieEl => {
      movieEl.addEventListener('click', () => {
        const title = movieEl.dataset.movieTitle;
        const titleInput = document.getElementById('movieTitle');
        if (titleInput) {
          titleInput.value = title;
          // Trigger animation
          titleInput.style.transform = 'scale(1.02)';
          setTimeout(() => {
            titleInput.style.transform = 'scale(1)';
          }, 200);
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

  } catch (error) {
    console.error('Error loading trending movies:', error);
    carousel.innerHTML = '<div class="trending-error">Unable to load trending movies</div>';
  }
}

// Call loadTrendingMovies when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...
  loadTrendingMovies();
});

// Auto-scroll functionality for trending carousel
let autoScrollInterval = null;
let isScrolling = false;

function startAutoScroll() {
  const carousel = document.getElementById('trendingCarousel');
  if (!carousel) return;

  // Clear any existing interval
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }

  // Auto-scroll every 30ms for smooth animation
  autoScrollInterval = setInterval(() => {
    if (!isScrolling && carousel) {
      carousel.scrollLeft += 1; // Scroll 1px at a time for smoothness
      
      // Reset to beginning when reaching the end
      if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        carousel.scrollLeft = 0;
      }
    }
  }, 30);

  // Pause on hover
  carousel.addEventListener('mouseenter', () => {
    isScrolling = true;
  });

  // Resume on mouse leave
  carousel.addEventListener('mouseleave', () => {
    isScrolling = false;
  });

  // Pause on touch (mobile)
  carousel.addEventListener('touchstart', () => {
    isScrolling = true;
  });

  carousel.addEventListener('touchend', () => {
    setTimeout(() => {
      isScrolling = false;
    }, 2000); // Resume after 2 seconds
  });
}

// Stop auto-scroll (cleanup)
function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}
