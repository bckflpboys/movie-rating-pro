# Movie Rating Pro - Chrome Extension

A powerful and highly customizable Chrome extension for rating movies with detailed scoring across multiple categories. Features automatic title detection, custom fields, optional rating categories, and comprehensive rating analytics.

## 🌟 Key Features

### 🎬 Automatic Movie Title Detection
Automatically detects movie titles from streaming platforms and video websites:

**Supported Platforms:**
- Netflix, Amazon Prime Video, Disney+, Hulu, HBO Max/Max, Apple TV+
- YouTube, Vimeo, Dailymotion, Twitch
- Generic detection for any video website

**Detection Methods:**
- Platform-specific selectors
- Open Graph and Twitter Card meta tags
- Common video title patterns
- Document title analysis
- Manual refresh button for re-detection

### 📊 Flexible Rating System

**10 Default Rating Categories (All Optional!):**

**Time Segments:**
- First 30 Minutes
- Middle Hour
- Last 30 Minutes

**Production Quality:**
- Sound Design
- Music Score
- Visual Quality

**Creative Aspects:**
- Directing
- Acting
- Screenplay
- Cinematography

**✨ NEW: All categories can be enabled/disabled from Settings!**

### 🎨 Custom Fields System

**7 Field Types Available:**
1. **Text** - Short text input (names, titles)
2. **Long Text** - Textarea for reviews and notes
3. **Number** - Numeric values
4. **Date** - Date picker
5. **Date & Time** - DateTime picker
6. **Dropdown** - Select from predefined options
7. **Rating Slider (1-10)** - Custom rating categories that contribute to total score

**Features:**
- ✅ Unlimited custom fields
- ✅ Custom sliders count toward total score
- ✅ Fully persistent across sessions
- ✅ Easy management (add/edit/delete)
- ✅ Displayed in detail view

### ⚙️ Advanced Settings

**Customizable Rating Categories:**
- Enable/disable any of the 10 default categories
- Hide unused categories from the main form
- Empty sections automatically hidden
- Score calculated only from enabled categories

**Persistent Configuration:**
- All settings saved to Chrome local storage
- Survives browser restarts and PC reboots
- No data loss ever

### ⭐ Core Features

- **Real-time Score Calculation** - Updates as you adjust sliders
- **Visual Star Rating** - 5-star display (out of 10 scale)
- **Auto-fill Date & Time** - Automatically fills when rating
- **Detailed Rating View** - Click any saved rating to see full breakdown
- **Rating Analytics** - View all ratings with visual bars
- **Local Storage** - All data stored securely on your device
- **Beautiful UI** - Modern gradient design with smooth animations
- **Responsive Design** - Clean, intuitive interface

## 🚀 Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the extension directory
6. Pin the extension to your toolbar for easy access

## 📖 Usage Guide

### Quick Start

1. **Navigate to a movie** on any streaming platform
2. **Click the extension icon** - Title auto-fills
3. **Adjust rating sliders** - Score updates in real-time
4. **Fill custom fields** (if any)
5. **Click "Save Rating"** - Done!

### Settings Configuration

**Access Settings:**
- Click the ⚙️ icon in the extension popup

**Configure Rating Categories:**
1. Go to "Rating Categories" section
2. Toggle categories on/off
3. Save settings
4. Disabled categories hidden from main form

**Add Custom Fields:**
1. Go to "Custom Fields" section
2. Click "Add Custom Field"
3. Enter label and select type
4. For dropdowns, add comma-separated options
5. Save settings

**Custom Field Examples:**
- Director (Text)
- Genre (Dropdown: Action, Comedy, Drama, etc.)
- Platform (Dropdown: Netflix, Theater, etc.)
- Rewatchability (Rating Slider)
- My Review (Long Text)

### Viewing Saved Ratings

1. Click the menu icon (≡) in top-right
2. Browse all saved ratings
3. Click any rating card for detailed view
4. See all category scores with visual bars
5. View custom field values
6. Delete ratings if needed

## 🔧 Technical Details

### Architecture

**Files:**
- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html` - Main popup interface
- `popup.js` - Core logic and Chrome API interactions
- `settings.html` - Settings page interface
- `settings.js` - Settings management
- `content.js` - Content script for title detection
- `styles.css` - Modern gradient UI styles
- `icons/` - Extension icons

### Permissions

- `storage` - Save ratings and settings locally
- `activeTab` - Access current tab for title detection

### Data Storage

**Chrome Local Storage:**
```javascript
{
  movieRatings: [
    {
      id: timestamp,
      movieTitle: "The Matrix",
      ratings: { first30: 8, middleHour: 9, ... },
      customFields: { director: "Wachowski Sisters", ... },
      totalScore: 8.5,
      date: "2025-12-28T...",
      dateWatched: "2025-12-27T20:00"
    }
  ],
  customFields: [...],
  ratingCategorySettings: { first30: true, ... }
}
```

### Score Calculation

```
Total Score = (Sum of all enabled rating sliders) / (Count of enabled sliders)

Includes:
- Enabled default rating categories
- Custom rating sliders
- Excludes disabled categories
```

## 🎯 Use Cases

### Movie Enthusiast
- Track all movies watched
- Rate across multiple dimensions
- Add personal notes and reviews
- See rating history

### Film Student
- Analyze technical aspects
- Custom fields for cinematography notes
- Track directors and styles
- Build comprehensive database

### Casual Viewer
- Quick ratings with minimal categories
- Track where watched (platform)
- Note who watched with
- Simple rewatchability rating

### Genre-Specific
- Different category setups for different genres
- Horror: Enable scariness, gore level
- Comedy: Enable humor level
- Drama: Focus on acting, screenplay

## 📊 Statistics

**Current Features:**
- 10 default rating categories (all optional)
- 7 custom field types
- Unlimited custom fields
- Automatic title detection
- Persistent storage
- Detailed analytics
- Beautiful UI

**Code Stats:**
- ~31KB JavaScript (popup.js)
- ~11KB JavaScript (settings.js)
- ~16KB CSS
- ~12KB HTML (popup)
- ~11KB HTML (settings)

## 🔒 Privacy

- ✅ All data stored locally on your device
- ✅ No external servers
- ✅ No tracking or analytics
- ✅ No account required
- ✅ No data collection
- ✅ Complete privacy

## 🌐 Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Opera
- ✅ Any Chromium-based browser

## 📚 Documentation

- [CUSTOM_FIELDS_QUICK_START.md](CUSTOM_FIELDS_QUICK_START.md) - Custom fields guide
- [CUSTOM_FIELDS_FEATURE.md](CUSTOM_FIELDS_FEATURE.md) - Technical documentation
- [OPTIONAL_RATING_CATEGORIES.md](OPTIONAL_RATING_CATEGORIES.md) - Category customization
- [HOW_TO_DISABLE_CATEGORIES.md](HOW_TO_DISABLE_CATEGORIES.md) - Category management
- [AUTO_TITLE_DETECTION.md](AUTO_TITLE_DETECTION.md) - Title detection details
- [DETAIL_VIEW_IMPLEMENTATION.md](DETAIL_VIEW_IMPLEMENTATION.md) - Detail view info

## 🎉 Recent Updates

### Latest Features (December 2025)
- ✅ **Optional Rating Categories** - Enable/disable any category
- ✅ **Custom Rating Sliders** - Add your own rating categories
- ✅ **Custom Sliders in Score** - Custom ratings count toward total
- ✅ **7 Custom Field Types** - Including rating sliders
- ✅ **Auto-fill Date & Time** - Automatic timestamp
- ✅ **Detailed Rating View** - Click to see full breakdown
- ✅ **Settings Page** - Complete customization

## 🚧 Future Enhancements

### Planned Features
- [ ] Export ratings to CSV/JSON
- [ ] Import ratings from files
- [ ] Search and filter saved ratings
- [ ] Sort ratings by score, date, or title
- [ ] Integration with IMDB/TMDB APIs
- [ ] Sync ratings across devices (Chrome sync)
- [ ] Rating statistics and charts
- [ ] Backup and restore functionality
- [ ] Bulk edit/delete ratings
- [ ] Rating templates for different genres
- [ ] Keyboard shortcuts
- [ ] Dark/light theme toggle
- [ ] Rating comparison tools
- [ ] Watchlist integration
- [ ] Rating reminders
- [ ] Social sharing features

### Possible Enhancements
- [ ] Field validation rules
- [ ] Required custom fields
- [ ] Conditional field visibility
- [ ] Drag-and-drop field reordering
- [ ] Field groups/sections
- [ ] Default values for fields
- [ ] Rating presets/templates
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Mobile companion app
- [ ] Browser action badge with rating count
- [ ] Quick rate from context menu
- [ ] Rating notifications
- [ ] Collaborative ratings
- [ ] Public rating profiles

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - Free to use and modify

---

**Made with ❤️ for movie lovers**

**Start rating your movies with precision and style! 🎬⭐**
