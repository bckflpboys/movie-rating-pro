# Quick Start Guide - Automatic Title Detection

## Installation & Testing

### Step 1: Reload the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Find "Movie Rating Pro"
3. Click the refresh icon (↻) to reload the extension

### Step 2: Test on YouTube
1. Go to YouTube (https://youtube.com)
2. Open any video
3. Click the Movie Rating Pro extension icon
4. **Result**: The video title should automatically appear in the "Movie Title" field

### Step 3: Test on Netflix (if you have access)
1. Go to Netflix (https://netflix.com)
2. Start playing any movie or show
3. Click the Movie Rating Pro extension icon
4. **Result**: The movie/show title should automatically appear

### Step 4: Test Manual Refresh
1. While on any video page, click the extension icon
2. Notice the auto-filled title
3. Click the circular refresh button (↻) next to the title input
4. **Result**: The button spins and re-detects the title

### Step 5: Test Manual Entry
1. Click the extension icon on any page
2. If no title is detected, the field will be empty
3. You can still manually type any movie title
4. **Result**: Manual entry works as before

## Visual Changes

### Before
```
Movie Title
[Enter movie name...                    ]
```

### After
```
Movie Title
[Auto-detected or enter manually...  ] [↻]
```

## What You'll See

### Automatic Detection Success
- Title field fills automatically
- Brief green background flash on the input
- You can immediately start rating

### Manual Refresh
- Click the refresh button (↻)
- Button spins for 1 second
- Title updates if detected
- Error notification if not found

### No Detection
- Input field remains empty
- No error messages (non-intrusive)
- You can type manually as usual

## Supported Websites

### Streaming Platforms (Optimized)
✅ Netflix
✅ YouTube  
✅ Amazon Prime Video
✅ Disney+
✅ Hulu
✅ HBO Max / Max
✅ Apple TV+

### Video Platforms (Optimized)
✅ Vimeo
✅ Dailymotion
✅ Twitch

### Generic Support
✅ Any website with video content
✅ Uses multiple detection strategies
✅ Fallback to meta tags and page titles

## Troubleshooting

### Title Not Detected?
1. Click the refresh button (↻)
2. Make sure the video is loaded
3. Try manually typing the title

### Wrong Title Detected?
1. Click the refresh button (↻) to try again
2. Manually edit the title in the input field
3. The extension will use your manual entry

### Extension Not Working?
1. Reload the extension at `chrome://extensions/`
2. Refresh the video page
3. Try opening the extension again

## Tips

- **Best Time to Use**: Open the extension after the video starts playing
- **Manual Override**: You can always edit or replace the auto-detected title
- **Refresh Anytime**: Click the refresh button if you navigate to a different video
- **Works Everywhere**: Even works on lesser-known video sites through generic detection

## Privacy Note

- All detection happens locally in your browser
- No data is sent to external servers
- Titles are only stored locally when you save a rating

---

**Ready to rate some movies! 🎬**
