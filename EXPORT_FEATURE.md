# Export Feature

## Overview
The Movie Rating Pro extension now includes a powerful export feature that allows you to export all your movie ratings to a CSV (Comma-Separated Values) file. This file can be opened in Excel, Google Sheets, or any spreadsheet application.

## Quick Actions Bar
Located just below the header and above the movie title input, you'll find three quick action buttons:

- **History** 📋 - View your saved ratings
- **Settings** ⚙️ - Access extension settings
- **Export** 📄 - Export your ratings to CSV

## How to Export

1. Click the **Export** button in the quick actions bar
2. The extension will generate a CSV file with all your ratings
3. The file will automatically download to your default downloads folder
4. Filename format: `movie-ratings-YYYY-MM-DD.csv`

## CSV Format

The exported CSV includes the following columns:

### Standard Columns
- **Name** - Movie title
- **Genre** - (Empty - for manual entry)
- **Quality (Visual)** - Visual quality rating (1-10)
- **Audio** - Sound design rating (1-10)
- **Writing/Concept** - Screenplay rating (1-10)
- **Directing** - Directing rating (1-10)
- **Acting** - Acting rating (1-10)
- **Intro** - First 30 minutes rating (1-10)
- **Middle** - Middle hour rating (1-10)
- **Ending** - Last 30 minutes rating (1-10)
- **Soundtrack** - Music score rating (1-10)
- **Watch Date** - Date you watched the movie
- **Total Score** - Overall calculated score (1-10)

### Custom Fields
Any custom fields you've created in the settings will be added as additional columns:
- Custom sliders appear as rating columns
- Custom text/select fields appear as text columns

## Opening the CSV File

### In Excel
1. Open Excel
2. Go to File → Open
3. Select your downloaded CSV file
4. The data will be formatted in columns

### In Google Sheets
1. Go to Google Sheets
2. Click File → Import
3. Upload your CSV file
4. Choose "Replace spreadsheet" or "Insert new sheet"

## Features

✅ **All Ratings Included** - Exports every saved rating
✅ **Custom Fields Support** - Includes all your custom fields
✅ **Proper CSV Formatting** - Handles commas, quotes, and special characters
✅ **Date Formatting** - Watch dates are properly formatted
✅ **Genre Column** - Includes an empty Genre column for manual data entry

## Use Cases

- **Backup** - Keep a backup of your ratings outside the extension
- **Analysis** - Analyze your rating patterns in Excel/Sheets
- **Sharing** - Share your movie list with friends
- **Migration** - Move your data to another system
- **Tracking** - Add additional information like Genre, Release Year manually

## Notes

- If you have no ratings saved, you'll see a warning message
- The export includes all ratings, not just filtered ones
- Custom fields are automatically included in the export
- The Genre column is left empty for you to fill in manually if desired

## Troubleshooting

**Export button doesn't work?**
- Make sure you have at least one rating saved
- Check your browser's download settings
- Try disabling popup blockers

**CSV looks wrong in Excel?**
- Make sure you're opening it as a CSV file, not importing as text
- Check your Excel delimiter settings (should be comma)

**Missing columns?**
- Custom fields only appear if you've created them in Settings
- Make sure your extension is up to date

---

*Last updated: December 2025*
