# Movie Rating Pro - Chrome Extension

A powerful and highly customizable Chrome extension for rating movies with detailed scoring across multiple categories. Features automatic title detection, trending movies carousel, custom fields, search/filter/sort capabilities, CSV export, and comprehensive rating analytics.

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

### 🔥 Trending Movies Carousel
Browse and discover trending movies directly in the extension:

**Features:**
- Top 10 trending movies of the week (powered by TMDB API)
- Movie posters with ratings
- Auto-scrolling carousel (pauses on hover)
- Click any movie to auto-fill the title
- Collapsible section to save space
- Smooth animations and transitions

### 🚀 Quick Actions Bar
Fast access to key features right below the header:

- **📋 History** - View all saved ratings instantly
- **⚙️ Settings** - Access extension settings
- **📄 Export** - Export ratings to CSV spreadsheet

### 📊 Advanced Search, Filter & Sort
Powerful tools to manage your movie collection:

**Search:**
- Real-time search by movie title
- Instant results as you type
- Clear search button

**Filter:**
- Score ranges (9-10 Excellent, 7-8 Good, 5-6 Average, 1-4 Poor)
- Date range filtering
- Advanced filters panel

**Sort:**
- Newest/Oldest first
- Highest/Lowest score
- Title (A-Z / Z-A)

**Results Display:**
- Shows count of filtered results
- "Showing X of Y ratings" when filtered
- Smooth transitions

### 💾 Export to CSV
Export all your ratings to a spreadsheet:

**Export Includes:**
- Movie name and genre (empty for manual entry)
- All rating categories (Visual Quality, Audio, Writing, Directing, Acting, etc.)
- Time segments (Intro, Middle, Ending)
- Soundtrack rating
- Watch date and total score
- All custom fields (sliders and text)

**Features:**
- One-click export from quick actions bar
- Proper CSV formatting (opens in Excel/Google Sheets)
- Filename: `movie-ratings-YYYY-MM-DD.csv`
- Handles special characters and commas correctly

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

**✨ All categories can be enabled/disabled from Settings!**

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
- ✅ Displayed in detail view and exports

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
3. **Browse trending movies** (optional) - Click to auto-fill title
4. **Adjust rating sliders** - Score updates in real-time
5. **Fill custom fields** (if any)
6. **Click "Save Rating"** - Done!

### Quick Actions

**History Button:**
- View all saved ratings
- Search, filter, and sort your collection
- Click any rating for detailed view

**Settings Button:**
- Configure rating categories
- Add/manage custom fields
- Customize your rating experience

**Export Button:**
- Export all ratings to CSV
- Opens in Excel/Google Sheets
- Perfect for backup or analysis

### Settings Configuration

**Access Settings:**
- Click the ⚙️ icon in the header OR
- Click "Settings" in quick actions bar

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

1. Click "History" in quick actions OR menu icon (≡) in top-right
2. Use search bar to find specific movies
3. Filter by score range or date
4. Sort by date, score, or title
5. Click any rating card for detailed view
6. See all category scores with visual bars
7. View custom field values
8. Delete ratings if needed

### Exporting Ratings

1. Click "Export" in quick actions bar
2. CSV file downloads automatically
3. Open in Excel, Google Sheets, or any spreadsheet app
4. All ratings and custom fields included

## 🔧 Technical Details

### Architecture

**Files:**
- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html` - Main popup interface with quick actions
- `popup.js` - Core logic, Chrome API, trending movies, export
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

### TMDB API Integration

**Trending Movies:**
- Uses TMDB API for trending movies data
- Free tier: 40 requests per 10 seconds
- Demo API key included (get your own at themoviedb.org)
- Displays top 10 trending movies of the week
- Auto-scrolling carousel with pause on hover

## 🎯 Use Cases

### Movie Enthusiast
- Track all movies watched
- Rate across multiple dimensions
- Export to spreadsheet for analysis
- Search and filter your collection
- Discover trending movies

### Film Student
- Analyze technical aspects
- Custom fields for cinematography notes
- Track directors and styles
- Export data for academic projects
- Build comprehensive database

### Casual Viewer
- Quick ratings with minimal categories
- Track where watched (platform)
- Note who watched with
- Simple rewatchability rating
- Export to share with friends

### Data Analyst
- Export to CSV for analysis
- Track rating patterns over time
- Filter by score ranges
- Sort by various criteria
- Backup data regularly

## 📊 Statistics

**Current Features:**
- 10 default rating categories (all optional)
- 7 custom field types
- Unlimited custom fields
- Automatic title detection
- Trending movies carousel (TMDB API)
- Search, filter, and sort
- CSV export functionality
- Quick actions bar
- Persistent storage
- Detailed analytics
- Beautiful UI

**Code Stats:**
- ~45KB JavaScript (popup.js)
- ~11KB JavaScript (settings.js)
- ~25KB CSS
- ~17KB HTML (popup)
- ~11KB HTML (settings)
- ~10KB JavaScript (content.js)

## 🔒 Privacy

- ✅ All data stored locally on your device
- ✅ No external servers (except TMDB API for trending movies)
- ✅ No tracking or analytics
- ✅ No account required
- ✅ No personal data collection
- ✅ Complete privacy
- ✅ TMDB API only fetches public movie data

## 🌐 Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Opera
- ✅ Any Chromium-based browser

## 🎉 Recent Updates

### Latest Features (December 2025)
- ✅ **Quick Actions Bar** - Fast access to History, Settings, Export
- ✅ **CSV Export** - Export all ratings to spreadsheet
- ✅ **Trending Movies** - TMDB API integration with carousel
- ✅ **Search & Filter** - Find ratings by title, score, date
- ✅ **Sort Options** - Sort by date, score, or title
- ✅ **Optional Rating Categories** - Enable/disable any category
- ✅ **Custom Rating Sliders** - Add your own rating categories
- ✅ **Custom Sliders in Score** - Custom ratings count toward total
- ✅ **7 Custom Field Types** - Including rating sliders
- ✅ **Auto-fill Date & Time** - Automatic timestamp
- ✅ **Detailed Rating View** - Click to see full breakdown
- ✅ **Settings Page** - Complete customization

## 🚧 Future Enhancements

### Potential Features
- [ ] Import ratings from CSV/JSON
- [ ] Integration with more movie APIs (IMDB, etc.)
- [ ] Sync ratings across devices (Chrome sync)
- [ ] Rating statistics and charts
- [ ] Backup and restore functionality
- [ ] Bulk edit/delete ratings
- [ ] Rating templates for different genres
- [ ] Keyboard shortcuts
- [ ] Dark/light theme toggle
- [ ] Rating comparison tools
- [ ] Watchlist integration
- [ ] Social sharing features

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
