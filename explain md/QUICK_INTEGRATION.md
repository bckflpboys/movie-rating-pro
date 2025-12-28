# Quick Integration Checklist

## Settings Feature - 5 Minute Integration

### Files Already Created ✅
- `settings.html` - Settings page UI
- `settings.js` - Settings page logic

### Integration Steps

#### 1. Add Settings Button (popup.html, line ~32)
**Find:**
```html
<button class="view-ratings-btn" id="viewRatingsBtn">
```

**Replace with:**
```html
<div style="display: flex; gap: 8px;">
  <button class="view-ratings-btn" id="settingsBtn" title="Settings">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>
  <button class="view-ratings-btn" id="viewRatingsBtn">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4H17M3 10H17M3 16H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>
</div>
```

#### 2. Add Custom Fields Container (popup.html, line ~68)
**After the "Date Watched" section, add:**
```html
<!-- Custom Fields Container -->
<div id="customFieldsContainer"></div>
```

#### 3. Add Settings Button Handler (popup.js, in setupEventListeners function)
```javascript
// Settings button
document.getElementById('settingsBtn').addEventListener('click', () => {
  window.location.href = 'settings.html';
});
```

#### 4. Add loadCustomFields Function (popup.js, after autoFillMovieTitle)
```javascript
// Load and render custom fields
async function loadCustomFields() {
  try {
    const result = await chrome.storage.local.get(['customFields']);
    const customFields = result.customFields || [];
    
    const container = document.getElementById('customFieldsContainer');
    container.innerHTML = '';
    
    customFields.forEach(field => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'movie-title-section';
      
      const label = document.createElement('label');
      label.className = 'section-label';
      label.textContent = field.label;
      
      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.className = 'movie-title-input';
        input.rows = 3;
      } else if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'movie-title-input';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Select...';
        input.appendChild(defaultOpt);
        (field.options || []).forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          input.appendChild(option);
        });
      } else {
        input = document.createElement('input');
        input.type = field.type;
        input.className = 'movie-title-input';
      }
      
      input.id = field.id;
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      container.appendChild(fieldDiv);
    });
  } catch (error) {
    console.error('Error loading custom fields:', error);
  }
}
```

#### 5. Call loadCustomFields on Init (popup.js, DOMContentLoaded)
```javascript
document.addEventListener('DOMContentLoaded', () => {
  initializeSliders();
  setupEventListeners();
  updateTotalScore();
  autoFillMovieTitle();
  loadCustomFields(); // ADD THIS LINE
});
```

#### 6. Save Custom Fields (popup.js, in saveRating function)
**After collecting ratings, before creating rating object:**
```javascript
// Collect custom field values
const customFieldValues = {};
const customFieldsContainer = document.getElementById('customFieldsContainer');
if (customFieldsContainer) {
  customFieldsContainer.querySelectorAll('input, textarea, select').forEach(input => {
    if (input.value) {
      customFieldValues[input.id] = input.value;
    }
  });
}
```

**Then add to rating object:**
```javascript
const rating = {
  id: Date.now(),
  movieTitle,
  ratings,
  totalScore: parseFloat(average.toFixed(1)),
  date: dateWatched ? new Date(dateWatched).toISOString() : new Date().toISOString(),
  dateWatched: dateWatched || null,
  customFields: customFieldValues, // ADD THIS LINE
  timestamp: Date.now()
};
```

#### 7. Reset Custom Fields (popup.js, in resetForm function)
**Add at the end:**
```javascript
// Reset custom fields
const customFieldsContainer = document.getElementById('customFieldsContainer');
if (customFieldsContainer) {
  customFieldsContainer.querySelectorAll('input, textarea, select').forEach(input => {
    input.value = '';
  });
}
```

### Testing

1. Reload extension in Chrome
2. Open popup - should see settings icon
3. Click settings icon - should open settings page
4. Add a custom field (e.g., "Director", type "Text")
5. Click "Save Settings"
6. Return to popup - should see "Director" field
7. Fill in all fields and save a rating
8. View saved ratings - custom field should be saved

### Done! 🎉

Your extension now has:
- ✅ Auto-fill date watched
- ✅ Customizable fields
- ✅ Settings page
- ✅ Full flexibility

---

**Need help?** Check `SETTINGS_FEATURE.md` for detailed explanations.
