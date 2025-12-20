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

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getMovieTitle') {
        const title = detectMovieTitle();
        sendResponse({ title: title });
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
