# How to Disable Rating Categories - Quick Guide

## ✅ Feature is Ready to Use!

The toggle system for disabling rating categories is **fully implemented and working**!

---

## 🎯 How to Use

### Step 1: Open Settings
Click the **⚙️ Settings** icon in the top-right corner of the extension popup.

### Step 2: Find Rating Categories Section
Scroll to the **"Rating Categories"** section (between "Default Fields" and "Custom Fields").

### Step 3: Toggle Categories On/Off
```
Rating Categories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

First 30 Minutes        [●━━━] ← Click to disable
Middle Hour             [━━━●] ← Enabled
Last 30 Minutes         [━━━●] ← Enabled
Sound Design            [━━━●] ← Enabled
Music Score             [●━━━] ← Click to disable
Visual Quality          [━━━●] ← Enabled
Directing               [━━━●] ← Enabled
Acting                  [━━━●] ← Enabled
Screenplay              [●━━━] ← Click to disable
Cinematography          [━━━●] ← Enabled
```

**Green/Active** = Enabled (shows on homepage)
**Gray/Inactive** = Disabled (hidden from homepage)

### Step 4: Save Settings
Click the **"Save Settings"** button at the bottom.

### Step 5: Return to Main Form
You'll be automatically redirected back to the rating form.

---

## 🎬 What Happens

### When You Disable a Category:

**On the Homepage:**
- ❌ Category slider is completely hidden
- ❌ Category doesn't appear in the form
- ❌ Section is hidden if all its categories are disabled

**In the Rating System:**
- ❌ Disabled category doesn't contribute to score
- ✅ Score calculated only from enabled categories
- ✅ Custom sliders still work normally

---

## 📊 Examples

### Example 1: Disable "Middle Hour"

**Before:**
```
Time Segments
- First 30 Minutes    [slider]
- Middle Hour         [slider]
- Last 30 Minutes     [slider]
```

**After Disabling:**
```
Time Segments
- First 30 Minutes    [slider]
- Last 30 Minutes     [slider]
```

**Score:** Calculated from 9 categories instead of 10

---

### Example 2: Disable All Time Segments

**Settings:**
```
☐ First 30 Minutes    (disabled)
☐ Middle Hour         (disabled)
☐ Last 30 Minutes     (disabled)
```

**Result:**
```
Homepage:
- Time Segments section: HIDDEN
- Production Quality section: VISIBLE
- Creative Aspects section: VISIBLE

Score: Calculated from 7 categories
```

---

### Example 3: Minimal Setup

**Settings (Enable only 3):**
```
☐ First 30 Minutes
☐ Middle Hour
☐ Last 30 Minutes
☐ Sound Design
☐ Music Score
☐ Visual Quality
☑ Directing
☑ Acting
☑ Screenplay
☐ Cinematography
```

**Result:**
```
Homepage:
- Time Segments: HIDDEN
- Production Quality: HIDDEN
- Creative Aspects: Shows only Directing, Acting, Screenplay

Score: Calculated from 3 categories
```

---

## 🔄 How It Works Technically

### 1. Settings Page
```javascript
// Each category has a toggle
toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
});

// Saved to Chrome storage
ratingCategorySettings = {
  first30: true,
  middleHour: false,  // Disabled
  last30: true,
  // ...
}
```

### 2. Main Form
```javascript
// On page load
loadRatingCategorySettings();

// Hides disabled categories
if (!isEnabled) {
  ratingItem.style.display = 'none';
}

// Hides empty sections
if (all items hidden) {
  section.style.display = 'none';
}
```

### 3. Score Calculation
```javascript
// Only counts visible (enabled) sliders
document.querySelectorAll('.rating-item:not([style*="display: none"]) input[type="range"]')

// Score = sum of enabled / count of enabled
```

---

## ✅ Verification Checklist

To verify it's working:

1. **Open Settings** ✓
2. **See Rating Categories section** ✓
3. **See toggle switches for each category** ✓
4. **Click a toggle to disable** ✓
5. **Save Settings** ✓
6. **Return to main form** ✓
7. **Disabled category is hidden** ✓
8. **Score doesn't include disabled category** ✓

---

## 🎯 Pro Tips

### Tip 1: Genre-Specific Setups
Create different setups for different genres by enabling/disabling categories as needed.

### Tip 2: Quick Ratings
Disable categories you rarely use to make rating faster.

### Tip 3: Combine with Custom Sliders
Disable default categories you don't need, add custom sliders for what you do need.

### Tip 4: Test It Out
Try disabling all categories in one section to see the section disappear!

---

## 🚀 Ready to Use!

The feature is **100% functional** and ready to use right now!

**Try it:**
1. Open the extension
2. Click ⚙️ Settings
3. Scroll to "Rating Categories"
4. Toggle any category off
5. Save
6. See it disappear from the main form!

---

## 📝 Summary

**What You Can Do:**
- ✅ Toggle any rating category on/off
- ✅ Disabled categories hidden from homepage
- ✅ Disabled categories removed from rating system
- ✅ Settings persist forever
- ✅ Works with custom sliders

**What's Required:**
- ✅ Movie Title (always required)
- ✅ Date Watched (always required)
- ❌ All rating categories (optional)

**Perfect For:**
- Minimalist raters
- Genre-specific setups
- Quick ratings
- Personal preferences

---

**The feature is ready! Start customizing your rating system now!** 🎬⭐
