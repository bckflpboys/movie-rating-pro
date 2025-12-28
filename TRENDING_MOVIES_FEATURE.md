# Trending Movies Carousel - Feature Documentation

## Overview
Added a horizontal scrolling carousel that displays trending movies from The Movie Database (TMDB) API, positioned between the "Date Watched" field and the rating categories.

---

## ✨ Features

### Visual Display
- **Movie Posters** - High-quality poster images
- **Movie Titles** - Displayed below each poster
- **Rating Badges** - TMDB rating (out of 10) shown on posters
- **Horizontal Scroll** - Smooth auto-scrolling carousel
- **Responsive Design** - Touch-friendly on all devices

### Functionality
- **Click to Auto-Fill** - Click any movie to auto-fill the title field
- **Top 10 Trending** - Shows current week's trending movies
- **Auto-Load** - Fetches on page load
- **Smooth Animations** - Hover effects and transitions

---

## 🎨 UI Design

```
┌─────────────────────────────────────────────┐
│ ⚡ Trending Movies                          │
├─────────────────────────────────────────────┤
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ →     │
│ │ 📷│ │ 📷│ │ 📷│ │ 📷│ │ 📷│ │ 📷│       │
│ │   │ │   │ │   │ │   │ │   │ │   │       │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘       │
│ Title Title Title Title Title Title        │
└─────────────────────────────────────────────┘
```

### Each Movie Card Shows:
- Poster image (120x180px)
- TMDB rating badge (top-right)
- Movie title (below poster)
- Hover effect (lifts up)

---

## 🔧 Technical Details

### API Used
**The Movie Database (TMDB)**
- Free API
- Endpoint: `/trending/movie/week`
- Returns: Top trending movies of the week
- Images: High-quality poster images

### API Key
- Demo key included: `8265bd1679663a7ea12ac168da84d2e8`
- Users can get their own free key at: https://www.themoviedb.org/settings/api
- No registration required for basic usage

### Implementation

**HTML Structure:**
```html
<div class="trending-section">
  <h3 class="trending-title">⚡ Trending Movies</h3>
  <div class="trending-carousel">
    <div class="trending-movie">
      <div class="trending-poster">
        <div class="trending-rating">⭐ 8.5</div>
        <img src="poster.jpg" alt="Movie Title">
      </div>
      <div class="trending-movie-title">Movie Title</div>
    </div>
    <!-- More movies... -->
  </div>
</div>
```

**CSS Features:**
- Horizontal scrolling with custom scrollbar
- Hover animations
- Responsive card sizing
- Gradient overlays
- Rating badges

**JavaScript Functions:**
- `loadTrendingMovies()` - Fetches and displays movies
- Click handler - Auto-fills movie title
- Error handling - Shows error message if API fails

---

## 🎯 User Experience

### How It Works

1. **Page Load**
   - Carousel appears with "Loading..." message
   - API request sent to TMDB
   - Movies load and display

2. **Browsing**
   - User scrolls horizontally through movies
   - Hover shows lift animation
   - Rating badges visible on posters

3. **Selection**
   - User clicks a movie
   - Title auto-fills in the input field
   - Page scrolls to top
   - User can start rating

### Benefits

**Discovery:**
- See what's trending
- Discover new movies
- Quick inspiration

**Convenience:**
- One-click title entry
- No typing needed
- Accurate movie names

**Engagement:**
- Visual appeal
- Interactive element
- Modern UX

---

## 📊 Specifications

### Carousel
- **Width:** Full container width
- **Scroll:** Horizontal, smooth
- **Items Shown:** 10 trending movies
- **Update:** Weekly (TMDB updates)

### Movie Cards
- **Poster Size:** 120x180px
- **Aspect Ratio:** 2:3 (standard movie poster)
- **Gap:** 12px between cards
- **Hover Effect:** Translate up 4px

### Performance
- **Lazy Loading:** Images load as needed
- **Caching:** Browser caches images
- **Fallback:** Shows placeholder if image fails
- **Error Handling:** Graceful degradation

---

## 🎨 Styling

### Colors
- **Background:** rgba(0, 0, 0, 0.2)
- **Border:** rgba(255, 255, 255, 0.1)
- **Title Icon:** #F59E0B (amber)
- **Rating Badge:** #F59E0B on black
- **Scrollbar:** Purple gradient

### Typography
- **Title:** 16px, weight 600
- **Movie Title:** 12px, weight 500
- **Rating:** 11px, weight 600

### Animations
- **Hover:** translateY(-4px) in 0.2s
- **Scroll:** Smooth behavior
- **Auto-fill:** Scale animation on input

---

## 🔄 API Response Example

```json
{
  "results": [
    {
      "id": 123456,
      "title": "The Matrix",
      "poster_path": "/path/to/poster.jpg",
      "vote_average": 8.7,
      "release_date": "1999-03-31"
    },
    // ... more movies
  ]
}
```

---

## 🛠️ Customization

### Change Number of Movies
```javascript
const movies = data.results.slice(0, 10); // Change 10 to desired number
```

### Change Trending Period
```javascript
// Options: day, week
fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${apiKey}`)
```

### Add More Info
```javascript
// Add release year, genre, etc.
<div class="movie-year">${movie.release_date?.split('-')[0]}</div>
```

---

## 🚨 Error Handling

### Scenarios Handled

1. **API Failure**
   - Shows: "Unable to load trending movies"
   - User can still use extension normally

2. **No Results**
   - Shows: "No trending movies available"
   - Rare, but handled

3. **Missing Images**
   - Shows: Placeholder SVG with "No Image"
   - Maintains layout

4. **Network Issues**
   - Catches fetch errors
   - Displays error message
   - Doesn't break extension

---

## 📱 Responsive Design

### Mobile
- Touch-friendly scrolling
- Swipe gestures work
- Cards sized appropriately

### Desktop
- Mouse wheel scrolling
- Hover effects
- Custom scrollbar

### All Devices
- Smooth animations
- Fast loading
- Optimized images

---

## 🎯 Future Enhancements

### Possible Additions
- [ ] Genre filter (action, comedy, etc.)
- [ ] Search trending movies
- [ ] Show more details on hover
- [ ] Add to watchlist button
- [ ] Refresh button
- [ ] Different time periods (day/week/month)
- [ ] Popular vs Trending toggle
- [ ] Movie details modal
- [ ] Direct rating from carousel

---

## 📝 Usage Instructions

### For Users

**View Trending Movies:**
1. Open extension
2. Scroll down to "Trending Movies"
3. Browse horizontally

**Rate a Trending Movie:**
1. Click on any movie poster
2. Title auto-fills
3. Adjust ratings
4. Save

**Scroll Through Movies:**
- Mouse: Click and drag or use scroll wheel
- Touch: Swipe left/right
- Keyboard: Arrow keys (when focused)

---

## 🔐 Privacy

- **No Data Collection:** Only fetches public movie data
- **No Tracking:** TMDB doesn't track users
- **No Personal Info:** No user data sent
- **Public API:** Free and open

---

## ✅ Testing Completed

- [x] API connection works
- [x] Movies load correctly
- [x] Posters display properly
- [x] Ratings show correctly
- [x] Click auto-fills title
- [x] Horizontal scroll works
- [x] Hover animations work
- [x] Error handling works
- [x] Fallback images work
- [x] Mobile responsive

---

## 🎬 Summary

**Status:** ✅ Fully Implemented

**Features:**
- ✅ Trending movies carousel
- ✅ TMDB API integration
- ✅ Auto-fill on click
- ✅ Horizontal scrolling
- ✅ Rating badges
- ✅ Hover animations
- ✅ Error handling
- ✅ Responsive design

**Location:** Between "Date Watched" and rating categories

**API:** The Movie Database (TMDB) - Free

---

**Discover trending movies and rate them with one click!** 🎬⭐🔥
