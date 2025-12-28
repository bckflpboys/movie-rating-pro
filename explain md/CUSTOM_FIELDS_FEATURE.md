# Custom Fields Feature

## Overview
The custom fields feature allows users to add personalized fields to the movie rating form. These fields are fully persistent and will remain available across browser sessions, page refreshes, and even PC restarts.

## How It Works

### Adding Custom Fields

1. **Open Settings**: Click the settings icon (⚙️) in the top-right corner of the extension popup
2. **Add Custom Field**: Click the "Add Custom Field" button
3. **Configure Field**:
   - Enter a label for your field (e.g., "Director", "Genre", "Notes")
   - Select the field type from the dropdown:
     - **Text**: Single-line text input
     - **Long Text**: Multi-line textarea for longer content
     - **Number**: Numeric input
     - **Date**: Date picker
     - **Date & Time**: Date and time picker
     - **Dropdown**: Select from predefined options (requires comma-separated options)
     - **Rating Slider (1-10)**: Interactive slider for rating (just like the default rating categories)
4. **Save Settings**: Click "Save Settings" to apply your changes

### Using Custom Fields

Once you've added custom fields:

1. **Main Form**: Custom fields will automatically appear on the main rating form, below the "Date Watched" field
2. **Fill Values**: Enter values for your custom fields when rating a movie
3. **Save Rating**: When you save a rating, all custom field values are saved along with the rating scores
4. **View Details**: Custom field values are displayed in the rating detail view under "Additional Information"

### Managing Custom Fields

- **Edit Fields**: Go to Settings and modify the field label or type
- **Delete Fields**: Click the "Delete" button next to any custom field in Settings
- **Reorder**: Custom fields appear in the order they were created

## Data Persistence

All custom fields and their values are stored using Chrome's local storage API:

- **Field Definitions**: Stored in `chrome.storage.local` under the key `customFields`
- **Field Values**: Stored with each rating object under the `customFields` property
- **Persistence**: Data persists across:
  - Browser refreshes
  - Extension reloads
  - Browser restarts
  - PC restarts
  - New tabs/windows

## Technical Details

### Storage Structure

**Custom Field Definition:**
```javascript
{
  id: "custom_1234567890_abc123",
  label: "Director",
  type: "text",
  options: [] // Only for dropdown type
}
```

**Saved Rating with Custom Fields:**
```javascript
{
  id: 1234567890,
  movieTitle: "The Matrix",
  ratings: { ... },
  customFields: {
    "custom_1234567890_abc123": "Wachowski Sisters"
  },
  totalScore: 8.5,
  date: "2025-12-28T08:00:00.000Z"
}
```

### Field Types

| Type | HTML Element | Use Case |
|------|-------------|----------|
| text | `<input type="text">` | Short text (names, titles) |
| textarea | `<textarea>` | Long text (notes, reviews) |
| number | `<input type="number">` | Numeric values |
| date | `<input type="date">` | Date selection |
| datetime-local | `<input type="datetime-local">` | Date and time |
| select | `<select>` | Predefined options |
| slider | `<input type="range">` | Rating scale (1-10) |

## Features

✅ **Fully Persistent**: Data never lost across sessions
✅ **Dynamic UI**: Fields automatically appear/disappear based on settings
✅ **Type Safety**: Each field type has appropriate input validation
✅ **Clean Reset**: Reset button clears custom field values
✅ **Detail View**: Custom fields displayed in rating details
✅ **ID Preservation**: Field IDs remain constant when editing

## Limitations

- Custom fields are local to each browser installation
- No sync across devices (uses local storage, not sync storage)
- Field IDs cannot be changed once created
- Deleting a field definition doesn't remove old data (values remain in saved ratings)

## Future Enhancements

Potential improvements for future versions:
- Export/import custom field configurations
- Sync custom fields across devices using Chrome sync storage
- Field validation rules (required, min/max length, regex patterns)
- Conditional fields (show/hide based on other field values)
- Field groups and sections
- Default values for custom fields
