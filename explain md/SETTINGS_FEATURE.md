# Settings Page Feature - Implementation Guide

## Overview
I've created a comprehensive settings page for the Movie Rating Pro extension that allows users to:
1. Enable/disable default fields (Movie Title, Date Watched)
2. Add custom fields with various input types
3. Customize their rating experience

## Files Created

### 1. settings.html
A beautiful, modern settings interface with:
- **Default Fields Section**: Toggle switches to enable/disable built-in fields
- **Custom Fields Section**: Add unlimited custom fields with different types
- **Field Types Supported**:
  - Text (short text input)
  - Long Text (textarea)
  - Number
  - Date
  - Date & Time
  - Dropdown (with custom options)

### 2. settings.js
JavaScript logic that handles:
- Loading saved settings from Chrome storage
- Managing custom fields (add, edit, delete)
- Saving settings back to storage
- Field type validation
- Dynamic UI updates

## How It Works

### Adding Custom Fields
1. Click "Add Custom Field" button
2. Enter a label (e.g., "Director", "Genre", "My Rating")
3. Select a field type from dropdown
4. For dropdown fields, enter comma-separated options
5. Click "Save Settings"

### Field Types Examples
- **Text**: Director name, Actor, Studio
- **Long Text**: Personal notes, review, synopsis
- **Number**: Budget, Runtime (minutes), Year
- **Date**: Release date, Purchase date
- **Date & Time**: Premiere date/time
- **Dropdown**: Genre (Action, Comedy, Drama), Rating (G, PG, PG-13, R)

## Integration Steps

To fully integrate this feature, you need to:

### Step 1: Add Settings Button to popup.html
Add this code after line 31 (replace the single viewRatingsBtn):

```html
<div style="display: flex; gap: 8px;">
  <button class="view-ratings-btn" id="settingsBtn" title="Settings">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/>
      <path d="M16 10a6 6 0 11-12 0 6 6 0 0112 0z" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  </button>
  <button class="view-ratings-btn" id="viewRatingsBtn">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4H17M3 10H17M3 16H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>
</div>
```

### Step 2: Add Custom Fields Container to popup.html
Add this after the "Date Watched" section (around line 68):

```html
<!-- Custom Fields Container -->
<div id="customFieldsContainer">
  <!-- Custom fields will be dynamically inserted here -->
</div>
```

### Step 3: Update popup.js - Add Settings Button Handler
Add to the `setupEventListeners()` function:

```javascript
// Settings button
document.getElementById('settingsBtn').addEventListener('click', () => {
  window.location.href = 'settings.html';
});
```

### Step 4: Update popup.js - Load and Render Custom Fields
Add this function after `autoFillMovieTitle()`:

```javascript
// Load and render custom fields
async function loadCustomFields() {
  try {
    const result = await chrome.storage.local.get(['customFields', 'fieldSettings']);
    const customFields = result.customFields || [];
    const fieldSettings = result.fieldSettings || {};
    
    const container = document.getElementById('customFieldsContainer');
    container.innerHTML = '';
    
    customFields.forEach(field => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'movie-title-section';
      
      const label = document.createElement('label');
      label.className = 'section-label';
      label.textContent = field.label;
      label.setAttribute('for', field.id);
      
      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.className = 'movie-title-input';
        input.rows = 3;
      } else if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'movie-title-input';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select...';
        input.appendChild(defaultOption);
        
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

### Step 5: Update popup.js - Call loadCustomFields on Init
Modify the `DOMContentLoaded` event listener:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  initializeSliders();
  setupEventListeners();
  updateTotalScore();
  autoFillMovieTitle();
  loadCustomFields(); // Add this line
});
```

### Step 6: Update popup.js - Save Custom Field Values
Modify the `saveRating()` function to include custom fields:

```javascript
// After collecting ratings, add this:
const customFieldValues = {};
const customFieldsContainer = document.getElementById('customFieldsContainer');
if (customFieldsContainer) {
  customFieldsContainer.querySelectorAll('input, textarea, select').forEach(input => {
    if (input.value) {
      customFieldValues[input.id] = input.value;
    }
  });
}

// Add to rating object:
const rating = {
  id: Date.now(),
  movieTitle,
  ratings,
  totalScore: parseFloat(average.toFixed(1)),
  date: dateWatched ? new Date(dateWatched).toISOString() : new Date().toISOString(),
  dateWatched: dateWatched || null,
  customFields: customFieldValues, // Add this line
  timestamp: Date.now()
};
```

### Step 7: Update popup.js - Reset Custom Fields
Modify the `resetForm()` function:

```javascript
// Add after resetting dateWatched:
// Reset custom fields
const customFieldsContainer = document.getElementById('customFieldsContainer');
if (customFieldsContainer) {
  customFieldsContainer.querySelectorAll('input, textarea, select').forEach(input => {
    input.value = '';
  });
}
```

## Features

### Settings Page Features
✅ Modern, glassmorphic UI design
✅ Toggle switches for default fields
✅ Add/remove custom fields dynamically
✅ Multiple field types supported
✅ Dropdown fields with custom options
✅ Auto-save to Chrome storage
✅ Validation and error handling
✅ Smooth animations and transitions

### User Benefits
- **Flexibility**: Add any fields you want to track
- **Customization**: Tailor the extension to your needs
- **Organization**: Keep all movie data in one place
- **Simplicity**: Easy-to-use interface

## Example Use Cases

### Movie Buff
Custom fields:
- Director (Text)
- Lead Actor (Text)
- Genre (Dropdown: Action, Comedy, Drama, Horror, Sci-Fi)
- Personal Notes (Long Text)
- Rewatch? (Dropdown: Yes, No, Maybe)

### Film Student
Custom fields:
- Director (Text)
- Cinematographer (Text)
- Color Grading (Dropdown: Excellent, Good, Average, Poor)
- Editing Style (Long Text)
- Technical Notes (Long Text)

### Casual Viewer
Custom fields:
- Watched With (Text)
- Where Watched (Dropdown: Theater, Home, Friend's Place)
- Would Recommend? (Dropdown: Yes, No)

## Styling

The settings page uses the same design system as the main popup:
- Purple/Pink gradient theme
- Glassmorphism effects
- Smooth animations
- Responsive layout
- Dark mode optimized

## Storage Structure

```javascript
{
  customFields: [
    {
      id: "custom_1234567890_abc123",
      label: "Director",
      type: "text"
    },
    {
      id: "custom_1234567891_def456",
      label: "Genre",
      type: "select",
      options: ["Action", "Comedy", "Drama"]
    }
  ],
  fieldSettings: {
    movieTitle: true,  // enabled
    dateWatched: true  // enabled
  }
}
```

## Next Steps

1. Manually apply the integration steps above to popup.html and popup.js
2. Test the settings page by opening settings.html
3. Add custom fields and save
4. Return to popup and verify custom fields appear
5. Rate a movie and verify custom field values are saved

## Notes

- Custom field IDs are automatically generated with timestamps and random strings
- Field settings are persistent across browser sessions
- Deleting a custom field doesn't delete existing data (for data integrity)
- The settings page validates input before saving
