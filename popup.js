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

  ratingCategories.forEach(category => {
    const slider = document.getElementById(category);
    if (slider) {
      total += parseInt(slider.value);
      count++;
    }
  });

  const average = total / count;
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

  // Calculate total score
  const total = Object.values(ratings).reduce((sum, val) => sum + val, 0);
  const average = total / ratingCategories.length;

  // Create rating object
  const rating = {
    id: Date.now(),
    movieTitle,
    ratings,
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

  try {
    const result = await chrome.storage.local.get(['movieRatings']);
    const movieRatings = result.movieRatings || [];

    if (movieRatings.length === 0) {
      ratingsList.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M32 8L38 24L54 26L43 37L46 53L32 46L18 53L21 37L10 26L26 24L32 8Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <p>No ratings saved yet.<br>Start rating your first movie!</p>
        </div>
      `;
      return;
    }

    ratingsList.innerHTML = movieRatings.map(rating => createRatingCard(rating)).join('');

    // Add click event listeners to rating cards
    document.querySelectorAll('.rating-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking delete button
        if (e.target.closest('.delete-btn')) return;

        const ratingId = parseInt(card.dataset.id);
        const rating = movieRatings.find(r => r.id === ratingId);
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
  } catch (error) {
    console.error('Error loading ratings:', error);
    ratingsList.innerHTML = '<div class="empty-state"><p>Error loading ratings</p></div>';
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
function showRatingDetail(rating) {
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
