// Content script to detect movie/video titles from various websites

/**
 * Detects the movie or video title from the current page
 * Works across multiple streaming platforms and video sites
 */
function detectMovieTitle() {
    const hostname = window.location.hostname;
    let title = null;

    // Try platform-specific detection first
    if (hostname.includes('netflix.com')) {
        title = detectNetflixTitle();
    } else if (hostname.includes('youtube.com')) {
        title = detectYouTubeTitle();
    } else if (hostname.includes('primevideo.com') || hostname.includes('amazon.com')) {
        title = detectPrimeVideoTitle();
    } else if (hostname.includes('disneyplus.com') || hostname.includes('hotstar.com')) {
        title = detectDisneyPlusTitle();
    } else if (hostname.includes('hulu.com')) {
        title = detectHuluTitle();
    } else if (hostname.includes('hbo.com') || hostname.includes('max.com')) {
        title = detectHBOMaxTitle();
    } else if (hostname.includes('apple.com')) {
        title = detectAppleTVTitle();
    } else if (hostname.includes('vimeo.com')) {
        title = detectVimeoTitle();
    } else if (hostname.includes('dailymotion.com')) {
        title = detectDailymotionTitle();
    } else if (hostname.includes('twitch.tv')) {
        title = detectTwitchTitle();
    }

    // If platform-specific detection didn't work, try generic methods
    if (!title) {
        title = detectGenericVideoTitle();
    }

    // Clean up the title
    if (title) {
        title = cleanTitle(title);
    }

    return title || '';
}

// Netflix detection
function detectNetflixTitle() {
    // Try video player title
    const videoTitle = document.querySelector('.video-title');
    if (videoTitle) return videoTitle.textContent;

    // Try metadata
    const titleElement = document.querySelector('.title-logo');
    if (titleElement) return titleElement.getAttribute('alt');

    // Try page title
    const pageTitle = document.querySelector('h1, .previewModal--player-titleTreatment-logo');
    if (pageTitle) return pageTitle.textContent || pageTitle.getAttribute('alt');

    return null;
}

// YouTube detection
function detectYouTubeTitle() {
    // Try video title in player
    const videoTitle = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1.title.ytd-video-primary-info-renderer');
    if (videoTitle) return videoTitle.textContent;

    // Try metadata
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Amazon Prime Video detection
function detectPrimeVideoTitle() {
    const titleElement = document.querySelector('.title, h1[data-automation-id="title"]');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Disney+ detection
function detectDisneyPlusTitle() {
    const titleElement = document.querySelector('.title-field, h1.title');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Hulu detection
function detectHuluTitle() {
    const titleElement = document.querySelector('.Masthead__title, h1');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// HBO Max detection
function detectHBOMaxTitle() {
    const titleElement = document.querySelector('[data-testid="title"], h1');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Apple TV+ detection
function detectAppleTVTitle() {
    const titleElement = document.querySelector('.product-header__title, h1');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Vimeo detection
function detectVimeoTitle() {
    const titleElement = document.querySelector('.clip-title, h1');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Dailymotion detection
function detectDailymotionTitle() {
    const titleElement = document.querySelector('.VideoTitle, h1');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Twitch detection
function detectTwitchTitle() {
    const titleElement = document.querySelector('h1[data-a-target="stream-title"]');
    if (titleElement) return titleElement.textContent;

    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) return metaTitle.getAttribute('content');

    return null;
}

// Generic video title detection for any website
function detectGenericVideoTitle() {
    // Strategy 1: Look for video elements and their associated titles
    const video = document.querySelector('video');
    if (video) {
        // Check for title attribute
        if (video.title) return video.title;

        // Check for aria-label
        if (video.getAttribute('aria-label')) return video.getAttribute('aria-label');

        // Look for nearby title elements
        const parent = video.closest('div, section, article');
        if (parent) {
            const nearbyTitle = parent.querySelector('h1, h2, .title, [class*="title"]');
            if (nearbyTitle) return nearbyTitle.textContent;
        }
    }

    // Strategy 2: Check Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        const content = ogTitle.getAttribute('content');
        if (content && !content.toLowerCase().includes('watch') && !content.toLowerCase().includes('home')) {
            return content;
        }
    }

    // Strategy 3: Check Twitter card meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        const content = twitterTitle.getAttribute('content');
        if (content) return content;
    }

    // Strategy 4: Look for common video title selectors
    const commonSelectors = [
        'h1.video-title',
        'h1.movie-title',
        '.video-title',
        '.movie-title',
        '[data-testid="video-title"]',
        '[data-testid="movie-title"]',
        '.player-title',
        '.content-title',
        'h1[class*="title"]',
        'h2[class*="title"]'
    ];

    for (const selector of commonSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            return element.textContent;
        }
    }

    // Strategy 5: Check document title (last resort)
    const docTitle = document.title;
    if (docTitle) {
        // Remove common suffixes
        return docTitle.split('|')[0].split('-')[0].split('—')[0];
    }

    return null;
}

// Clean up the detected title
function cleanTitle(title) {
    if (!title) return '';

    // Trim whitespace
    title = title.trim();

    // Remove common streaming service suffixes
    const suffixPatterns = [
        / - Netflix$/i,
        / - YouTube$/i,
        / - Prime Video$/i,
        / - Disney\+$/i,
        / - Hulu$/i,
        / - HBO Max$/i,
        / - Apple TV\+$/i,
        / \| Netflix$/i,
        / \| YouTube$/i,
        / \| Prime Video$/i,
        / Watch on .+$/i,
        / - Watch .+$/i,
        / \(.+\)$/  // Remove year or other info in parentheses at the end
    ];

    for (const pattern of suffixPatterns) {
        title = title.replace(pattern, '');
    }

    // Remove "Watch" prefix if present
    title = title.replace(/^Watch\s+/i, '');

    // Remove extra whitespace
    title = title.replace(/\s+/g, ' ').trim();

    // Remove quotes if the entire title is quoted
    if ((title.startsWith('"') && title.endsWith('"')) ||
        (title.startsWith("'") && title.endsWith("'"))) {
        title = title.slice(1, -1);
    }

    return title;
}

/**
 * Detects the movie genre from the current page
 * Works across multiple streaming platforms and video sites
 */
function detectMovieGenre() {
    const hostname = window.location.hostname;
    let genre = null;

    // Try platform-specific detection first
    if (hostname.includes('netflix.com')) {
        genre = detectNetflixGenre();
    } else if (hostname.includes('primevideo.com') || hostname.includes('amazon.com')) {
        genre = detectPrimeVideoGenre();
    } else if (hostname.includes('disneyplus.com') || hostname.includes('hotstar.com')) {
        genre = detectDisneyPlusGenre();
    } else if (hostname.includes('hulu.com')) {
        genre = detectHuluGenre();
    } else if (hostname.includes('hbo.com') || hostname.includes('max.com')) {
        genre = detectHBOMaxGenre();
    } else if (hostname.includes('apple.com')) {
        genre = detectAppleTVGenre();
    } else if (hostname.includes('imdb.com')) {
        genre = detectIMDbGenre();
    }

    // If platform-specific detection didn't work, try generic methods
    if (!genre) {
        genre = detectGenericGenre();
    }

    // Clean up the genre
    if (genre) {
        genre = cleanGenre(genre);
    }

    return genre || '';
}

// Netflix genre detection
function detectNetflixGenre() {
    // Try to find genre in metadata
    const genreElements = document.querySelectorAll('.genre, [class*="genre"]');
    if (genreElements.length > 0) {
        return Array.from(genreElements).map(el => el.textContent.trim()).join(', ');
    }

    // Try JSON-LD structured data
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
        try {
            const data = JSON.parse(jsonLd.textContent);
            if (data.genre) {
                return Array.isArray(data.genre) ? data.genre.join(', ') : data.genre;
            }
        } catch (e) {
            // Ignore parsing errors
        }
    }

    return null;
}

// Amazon Prime Video genre detection
function detectPrimeVideoGenre() {
    // Try genre metadata
    const genreElement = document.querySelector('[data-automation-id="genre"], .genre');
    if (genreElement) return genreElement.textContent;

    // Try meta tags
    const metaGenre = document.querySelector('meta[property="og:video:tag"]');
    if (metaGenre) return metaGenre.getAttribute('content');

    return null;
}

// Disney+ genre detection
function detectDisneyPlusGenre() {
    // Try genre field
    const genreElement = document.querySelector('.genre-field, [class*="genre"]');
    if (genreElement) return genreElement.textContent;

    return null;
}

// Hulu genre detection
function detectHuluGenre() {
    // Try genre metadata
    const genreElement = document.querySelector('.Masthead__genre, [class*="genre"]');
    if (genreElement) return genreElement.textContent;

    return null;
}

// HBO Max genre detection
function detectHBOMaxGenre() {
    // Try genre field
    const genreElement = document.querySelector('[data-testid="genre"], [class*="genre"]');
    if (genreElement) return genreElement.textContent;

    return null;
}

// Apple TV+ genre detection
function detectAppleTVGenre() {
    // Try genre metadata
    const genreElement = document.querySelector('.product-header__genre, [class*="genre"]');
    if (genreElement) return genreElement.textContent;

    return null;
}

// IMDb genre detection
function detectIMDbGenre() {
    // IMDb has specific genre links
    const genreElements = document.querySelectorAll('a[href*="/search/title/?genres="], .ipc-chip__text');
    if (genreElements.length > 0) {
        return Array.from(genreElements)
            .map(el => el.textContent.trim())
            .filter(text => text && text.length < 20) // Filter out long text
            .slice(0, 3) // Take first 3 genres
            .join(', ');
    }

    return null;
}

// Generic genre detection for any website
function detectGenericGenre() {
    // Strategy 1: Check JSON-LD structured data
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
        try {
            const data = JSON.parse(script.textContent);
            if (data.genre) {
                return Array.isArray(data.genre) ? data.genre.join(', ') : data.genre;
            }
            // Check nested objects
            if (data['@graph']) {
                for (const item of data['@graph']) {
                    if (item.genre) {
                        return Array.isArray(item.genre) ? item.genre.join(', ') : item.genre;
                    }
                }
            }
        } catch (e) {
            // Ignore parsing errors
        }
    }

    // Strategy 2: Check Open Graph meta tags
    const ogGenre = document.querySelector('meta[property="og:video:tag"], meta[property="video:tag"], meta[property="og:genre"]');
    if (ogGenre) {
        return ogGenre.getAttribute('content');
    }

    // Strategy 3: Check other meta tags
    const metaGenre = document.querySelector('meta[name="genre"], meta[name="genres"], meta[name="category"]');
    if (metaGenre) {
        const content = metaGenre.getAttribute('content');
        if (content && content.split(',').length <= 5) {
            return content;
        }
    }

    // Strategy 4: Check keywords meta tag for genre-like words
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
        const keywords = keywordsMeta.getAttribute('content');
        if (keywords) {
            const genreKeywords = extractGenresFromText(keywords);
            if (genreKeywords) return genreKeywords;
        }
    }

    // Strategy 5: Look for common genre selectors (expanded list)
    const commonSelectors = [
        '.genre',
        '.genres',
        '[class*="genre" i]',
        '[class*="category" i]',
        '[data-testid="genre"]',
        '[data-testid="genres"]',
        '[data-genre]',
        '.movie-genre',
        '.video-genre',
        '.content-genre',
        '.film-genre',
        '.movie-category',
        '.video-category',
        '.info-genre',
        '.meta-genre',
        'span[class*="genre" i]',
        'div[class*="genre" i]',
        'p[class*="genre" i]',
        'a[class*="genre" i]',
        '.tags',
        '.tag',
        '[class*="tag" i]'
    ];

    for (const selector of commonSelectors) {
        try {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element && element.textContent.trim()) {
                    const text = element.textContent.trim();
                    // Make sure it's not too long and looks like a genre
                    if (text.length > 2 && text.length < 60 && !text.includes('\n')) {
                        const cleaned = cleanGenre(text);
                        if (cleaned && isLikelyGenre(cleaned)) {
                            return cleaned;
                        }
                    }
                }
            }
        } catch (e) {
            // Continue if selector fails
        }
    }

    // Strategy 6: Look for genre in links (common on streaming sites)
    const genreLinks = document.querySelectorAll('a[href*="genre"], a[href*="category"], a[class*="genre" i], a[class*="category" i]');
    const foundGenres = [];
    for (const link of genreLinks) {
        const text = link.textContent.trim();
        if (text.length > 2 && text.length < 25 && isLikelyGenre(text)) {
            foundGenres.push(text);
            if (foundGenres.length >= 3) break;
        }
    }
    if (foundGenres.length > 0) {
        return foundGenres.join(', ');
    }

    // Strategy 7: Look for text patterns like "Genre: Action" or "Category: Drama"
    const bodyText = document.body.innerText || document.body.textContent;
    const genrePatterns = [
        /Genre[s]?:\s*([A-Z][a-zA-Z\s,&-]+?)(?:\n|$|\|)/i,
        /Categor(?:y|ies):\s*([A-Z][a-zA-Z\s,&-]+?)(?:\n|$|\|)/i,
        /Type:\s*([A-Z][a-zA-Z\s,&-]+?)(?:\n|$|\|)/i,
        /\|\s*([A-Z][a-zA-Z]+(?:\s*,\s*[A-Z][a-zA-Z]+){1,3})\s*\|/
    ];

    for (const pattern of genrePatterns) {
        const match = bodyText.match(pattern);
        if (match && match[1]) {
            const extracted = match[1].trim();
            if (extracted.length < 60 && isLikelyGenre(extracted)) {
                return extracted;
            }
        }
    }

    // Strategy 8: Look in breadcrumbs
    const breadcrumbs = document.querySelectorAll('[class*="breadcrumb" i] a, [class*="bread" i] a, nav a');
    for (const crumb of breadcrumbs) {
        const text = crumb.textContent.trim();
        if (text.length > 2 && text.length < 25 && isLikelyGenre(text)) {
            return text;
        }
    }

    // Strategy 9: Look for common genre words in the page title or headings
    const pageTitle = document.title;
    const genresFromTitle = extractGenresFromText(pageTitle);
    if (genresFromTitle) return genresFromTitle;

    // Strategy 10: Scan all text content for genre-like words near "genre" or "category" labels
    const allText = document.body.innerText || document.body.textContent;
    const lines = allText.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/genre|category|type/i.test(line) && i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim();
            if (nextLine.length > 2 && nextLine.length < 60 && isLikelyGenre(nextLine)) {
                return nextLine;
            }
        }
    }

    return null;
}

// Helper function to check if text looks like a genre
function isLikelyGenre(text) {
    if (!text || text.length < 3) return false;

    // Common genre words
    const commonGenres = [
        'action', 'adventure', 'animation', 'anime', 'biography', 'comedy', 'crime', 'documentary',
        'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror', 'music', 'musical',
        'mystery', 'romance', 'sci-fi', 'science fiction', 'sport', 'thriller', 'war', 'western',
        'superhero', 'supernatural', 'psychological', 'noir', 'suspense', 'indie', 'classic',
        'martial arts', 'zombie', 'vampire', 'monster', 'slasher', 'teen', 'kids', 'adult'
    ];

    const lowerText = text.toLowerCase();

    // Check if it contains any common genre words
    for (const genre of commonGenres) {
        if (lowerText.includes(genre)) return true;
    }

    // Check if it looks like a genre (capitalized words, not too many words)
    const words = text.split(/[\s,&]+/);
    if (words.length > 5) return false; // Too many words

    // Should start with capital letter and not contain numbers or special chars (except &, -)
    if (!/^[A-Z]/.test(text)) return false;
    if (/\d/.test(text)) return false;
    if (/[!@#$%^*()_+=\[\]{}|\\;:'",.<>?\/]/.test(text)) return false;

    return true;
}

// Helper function to extract genres from text
function extractGenresFromText(text) {
    if (!text) return null;

    const commonGenres = [
        'Action', 'Adventure', 'Animation', 'Anime', 'Biography', 'Comedy', 'Crime', 'Documentary',
        'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical',
        'Mystery', 'Romance', 'Sci-Fi', 'Science Fiction', 'Sport', 'Thriller', 'War', 'Western',
        'Superhero', 'Supernatural', 'Psychological', 'Noir', 'Suspense', 'Indie', 'Classic'
    ];

    const foundGenres = [];
    const lowerText = text.toLowerCase();

    for (const genre of commonGenres) {
        if (lowerText.includes(genre.toLowerCase())) {
            foundGenres.push(genre);
            if (foundGenres.length >= 3) break;
        }
    }

    return foundGenres.length > 0 ? foundGenres.join(', ') : null;
}

// Clean up the detected genre
function cleanGenre(genre) {
    if (!genre) return '';

    // Trim whitespace
    genre = genre.trim();

    // Remove common prefixes
    genre = genre.replace(/^Genres?:\s*/i, '');
    genre = genre.replace(/^Categories?:\s*/i, '');

    // Clean up multiple genres
    if (genre.includes(',')) {
        // Split, trim, and rejoin
        const genres = genre.split(',')
            .map(g => g.trim())
            .filter(g => g.length > 0 && g.length < 30) // Filter out empty or too long
            .slice(0, 3); // Take max 3 genres
        genre = genres.join(', ');
    }

    // Remove extra whitespace
    genre = genre.replace(/\s+/g, ' ').trim();

    // Capitalize first letter of each word
    genre = genre.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    return genre;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getMovieTitle') {
        const title = detectMovieTitle();
        sendResponse({ title: title });
    } else if (request.action === 'getMovieGenre') {
        const genre = detectMovieGenre();
        sendResponse({ genre: genre });
    }
    return true; // Keep the message channel open for async response
});

// Store the detected title in a variable that can be accessed
let detectedTitle = detectMovieTitle();

// Re-detect title when the page changes (for SPAs)
const observer = new MutationObserver(() => {
    const newTitle = detectMovieTitle();
    if (newTitle && newTitle !== detectedTitle) {
        detectedTitle = newTitle;
    }
});

// Observe changes to the document
observer.observe(document.body, {
    childList: true,
    subtree: true
});
