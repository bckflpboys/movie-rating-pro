# Movie Rating Pro - Chrome Extension

A powerful Chrome extension that allows you to rate movies and videos with detailed scoring across multiple categories. Features automatic movie title detection from streaming platforms and video websites.

## Features

### 🎬 Automatic Movie Title Detection
The extension automatically detects the movie or video title from the current webpage when you open the popup. This works across:

- **Streaming Platforms:**
  - Netflix
  - Amazon Prime Video
  - Disney+
  - Hulu
  - HBO Max / Max
  - Apple TV+
  
- **Video Platforms:**
  - YouTube
  - Vimeo
  - Dailymotion
  - Twitch

- **Generic Detection:**
  - Works on any website with video content
  - Uses multiple detection strategies including:
    - Platform-specific selectors
    - Open Graph meta tags
    - Twitter card meta tags
    - Common video title patterns
    - Document title analysis

### 📊 Comprehensive Rating System
Rate movies across 10 different categories:

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

### ⭐ Features
- Real-time score calculation (out of 10)
- Visual star rating display (out of 5 stars)
- Save ratings locally in Chrome storage
- View all your saved ratings
- Delete ratings you no longer need
- Beautiful gradient UI with smooth animations
- Manual refresh button to re-detect titles

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extension directory

## Usage

### Automatic Title Detection

1. Navigate to any streaming platform or video website
2. Start watching a movie or video
3. Click the extension icon in your browser toolbar
4. The movie title will be automatically detected and filled in
5. If the title isn't detected or is incorrect, you can:
   - Click the refresh button (↻) to try detecting again
   - Manually type in the correct title

### Rating a Movie

1. Adjust the sliders for each category (1-10 scale)
2. Watch the overall score update in real-time
3. Click "Save Rating" to store your rating
4. The form will reset automatically after saving

### Viewing Saved Ratings

1. Click the menu icon (≡) in the top right of the popup
2. Browse through your saved ratings
3. Each rating shows:
   - Movie title
   - Date rated
   - Overall score
   - Star rating
   - Top 4 category scores
4. Click "Delete Rating" to remove a rating
5. Click "Back" to return to the rating form

## How Title Detection Works

The extension uses a content script that runs on all web pages. When you open the popup, it:

1. **Checks the current website** - Identifies if you're on a known streaming platform
2. **Uses platform-specific detection** - Applies optimized selectors for popular platforms
3. **Falls back to generic detection** - Uses multiple strategies for unknown websites:
   - Searches for video elements and nearby titles
   - Checks meta tags (Open Graph, Twitter Cards)
   - Looks for common title class names and patterns
   - Analyzes the page title
4. **Cleans the title** - Removes platform names, "Watch" prefixes, and other noise
5. **Auto-fills the input** - Populates the movie title field with a subtle animation

### Manual Refresh

If the automatic detection doesn't work or you navigate to a different video:
- Click the refresh button (↻) next to the title input
- The extension will re-scan the page for the current title
- This will overwrite any existing title in the field

## Technical Details

### Permissions

- `storage` - Save ratings locally
- `activeTab` - Access the current tab to detect titles
- `scripting` - Inject content script for title detection

### Files

- `manifest.json` - Extension configuration
- `popup.html` - Main popup interface
- `popup.js` - Popup logic and Chrome API interactions
- `content.js` - Content script for title detection
- `styles.css` - Beautiful gradient UI styles
- `icons/` - Extension icons

### Storage

Ratings are stored locally using Chrome's `storage.local` API. Each rating includes:
- Unique ID (timestamp)
- Movie title
- All 10 category ratings
- Calculated total score
- Date and timestamp

## Privacy

- All data is stored locally on your device
- No data is sent to external servers
- No tracking or analytics
- No account required

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Future Enhancements

Potential features for future versions:
- Export ratings to CSV/JSON
- Import ratings from files
- Search and filter saved ratings
- Sort ratings by score, date, or title
- Integration with movie databases (IMDB, TMDB)
- Sync ratings across devices
- Custom rating categories
- Notes and comments for each rating

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use and modify as needed.

---

**Enjoy rating your movies! 🎬⭐**
