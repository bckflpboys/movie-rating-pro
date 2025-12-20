# Movie Rating Pro - Chrome Extension

A beautiful and comprehensive Chrome extension for rating movies across different time segments and production categories.

## Features

### 📊 Comprehensive Rating System
- **Time Segments**: Rate the first 30 minutes, middle hour, and last 30 minutes separately
- **Production Quality**: Evaluate sound design, music score, and visual quality
- **Creative Aspects**: Rate directing, acting, screenplay, and cinematography
- **1-10 Scale**: Each category uses an intuitive 1-10 rating scale

### ⭐ Smart Scoring
- Automatic calculation of overall movie score
- Visual star rating display (out of 5 stars)
- Real-time score updates as you adjust ratings

### 💾 Local Storage
- Save unlimited movie ratings
- View all your saved ratings in a beautiful list
- Delete ratings you no longer need
- All data stored locally in your browser

### 🎨 Premium Design
- Modern dark theme with vibrant gradients
- Smooth animations and transitions
- Responsive and intuitive interface
- Color-coded rating sliders

## Installation Instructions

### Method 1: Load Unpacked Extension (Developer Mode)

1. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the folder: `e:\web\chrome extentions\movie list`
   - Select the folder and click "Select Folder"

4. **Start Using**
   - The extension icon should appear in your Chrome toolbar
   - Click the icon to open the rating interface
   - Start rating your favorite movies!

### Method 2: Pin the Extension (Recommended)

After loading the extension:
1. Click the puzzle piece icon in Chrome toolbar
2. Find "Movie Rating Pro" in the list
3. Click the pin icon to keep it visible in your toolbar

## How to Use

### Rating a Movie

1. **Enter Movie Title**
   - Click the extension icon
   - Type the movie name in the title field

2. **Rate Time Segments**
   - First 30 Minutes: Rate the opening and setup
   - Middle Hour: Rate the main story development
   - Last 30 Minutes: Rate the climax and conclusion

3. **Rate Production Quality**
   - Sound Design: Audio effects and sound mixing
   - Music Score: Original soundtrack and music
   - Visual Quality: Cinematography and visual effects

4. **Rate Creative Aspects**
   - Directing: Director's vision and execution
   - Acting: Performance quality
   - Screenplay: Story and dialogue
   - Cinematography: Camera work and framing

5. **Save Your Rating**
   - Watch the overall score update in real-time
   - Click "Save Rating" to store your review
   - Click "Reset" to start over

### Viewing Saved Ratings

1. Click the menu icon (three lines) in the top-right
2. Browse all your saved movie ratings
3. See scores, dates, and key metrics at a glance
4. Delete ratings by clicking the "Delete Rating" button

## Technical Details

- **Manifest Version**: 3 (Latest Chrome Extension standard)
- **Permissions**: Local storage only (no network access)
- **Storage**: Chrome's local storage API
- **Size**: Lightweight (~50KB)
- **Privacy**: All data stays on your device

## File Structure

```
movie list/
├── manifest.json       # Extension configuration
├── popup.html         # Main interface
├── popup.js           # Application logic
├── styles.css         # Styling and animations
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

## Rating Categories Explained

### Time Segments
- **First 30 Minutes**: How well does the movie hook you? Is the setup engaging?
- **Middle Hour**: Does the story maintain momentum? Is the development satisfying?
- **Last 30 Minutes**: Is the payoff worth it? Does it stick the landing?

### Production Quality
- **Sound Design**: Ambient sounds, effects, mixing quality
- **Music Score**: Original music, soundtrack choices, emotional impact
- **Visual Quality**: Image quality, color grading, visual effects

### Creative Aspects
- **Directing**: Vision, pacing, shot composition
- **Acting**: Performance quality, chemistry, believability
- **Screenplay**: Story structure, dialogue, character development
- **Cinematography**: Camera work, lighting, visual storytelling

## Tips for Better Ratings

1. **Be Honest**: Rate based on your genuine experience
2. **Consider Context**: Genre expectations matter
3. **Rate Immediately**: Fresh impressions are most accurate
4. **Use Full Scale**: Don't be afraid to use 1s and 10s
5. **Take Notes**: The title field helps you remember which movie

## Troubleshooting

### Extension Not Loading?
- Make sure Developer Mode is enabled
- Check that all files are in the correct folder
- Try removing and re-adding the extension

### Ratings Not Saving?
- Check Chrome's storage permissions
- Ensure you've entered a movie title
- Try reloading the extension

### Visual Issues?
- Make sure you're using a recent version of Chrome
- Try zooming in/out (Ctrl + / Ctrl -)
- Check if hardware acceleration is enabled

## Future Enhancements (Potential)

- Export ratings to CSV/JSON
- Import ratings from other sources
- Advanced filtering and sorting
- Rating statistics and insights
- Comparison between movies
- Custom rating categories
- Dark/Light theme toggle

## Privacy & Data

- **No Internet Connection Required**: Works completely offline
- **No Data Collection**: We don't collect any user data
- **Local Storage Only**: All ratings stay on your device
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Code is transparent and auditable

## Support

If you encounter any issues or have suggestions:
1. Check the troubleshooting section above
2. Review the file structure to ensure all files are present
3. Make sure you're using the latest version of Chrome

## Credits

Created with ❤️ for movie enthusiasts who want to track and remember their viewing experiences.

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**License**: Personal Use

Enjoy rating your movies! 🎬⭐
