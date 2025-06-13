/**
 * i18n.js - Internationalization support for Game Center
 * Handles language switching and text translations
 */

// Available languages
const LANGUAGES = {
    'en': 'English',
    'zh': '中文'
};

// Current language (default to Chinese)
let currentLanguage = 'zh';

// DOM loaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    initLanguage();
    
    // Setup language switch
    setupLanguageSwitch();
});

/**
 * Initialize language settings
 */
function initLanguage() {
    // Get language setting from local storage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && LANGUAGES[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    
    // Update language switch button text
    updateLanguageButton();
    
    // Apply translations
    translateUI();
}

/**
 * Setup language switch functionality
 */
function setupLanguageSwitch() {
    const langBtn = document.querySelector('.language-btn');
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            // Switch language
            currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
            
            // Save to local storage
            localStorage.setItem('language', currentLanguage);
            
            // Update UI
            updateLanguageButton();
            translateUI();
        });
    }
}

/**
 * Update language switch button text
 */
function updateLanguageButton() {
    const langBtn = document.querySelector('.language-btn');
    if (langBtn) {
        langBtn.innerHTML = currentLanguage === 'en' 
            ? '<i class="fas fa-globe"></i> English' 
            : '<i class="fas fa-globe"></i> 中文';
    }
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Translate UI elements
 */
function translateUI() {
    // Translate page title
    translatePageTitle();
    
    // Translate navigation
    translateNavigation();
    
    // Translate search placeholder
    translateSearchPlaceholder();
    
    // Translate footer
    translateFooter();
    
    // Translate buttons and other elements with data-i18n attribute
    translateElements();
}

/**
 * Translate page title
 */
function translatePageTitle() {
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const key = title.getAttribute('data-i18n');
        if (key) {
            title.textContent = translate(key);
        }
    });
    
    // Update document title
    const docTitleKey = document.body.getAttribute('data-i18n-title');
    if (docTitleKey) {
        document.title = translate(docTitleKey);
    }
}

/**
 * Translate navigation items
 */
function translateNavigation() {
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        const span = link.querySelector('span');
        if (!span) return;
        
        const key = link.getAttribute('data-nav');
        if (key) {
            span.textContent = translate(key);
        }
    });
    
    // Translate navigation headers
    document.querySelectorAll('.nav-link-header').forEach(header => {
        const key = header.getAttribute('data-nav');
        if (key) {
            header.textContent = translate(key);
        }
    });
}

/**
 * Translate search placeholder
 */
function translateSearchPlaceholder() {
    const searchInput = document.querySelector('.search-form input');
    if (searchInput) {
        searchInput.placeholder = translate('search_placeholder');
    }
}

/**
 * Translate footer links
 */
function translateFooter() {
    document.querySelectorAll('.footer-links a').forEach(link => {
        const key = link.getAttribute('data-i18n');
        if (key) {
            link.textContent = translate(key);
        }
    });
    
    // Translate copyright
    const copyright = document.querySelector('.footer-copyright');
    if (copyright) {
        const key = copyright.getAttribute('data-i18n');
        if (key) {
            copyright.textContent = translate(key);
        }
    }
}

/**
 * Translate elements with data-i18n attribute
 */
function translateElements() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translate(key);
            } else {
                element.textContent = translate(key);
            }
        }
    });
}

/**
 * Translate a key to the current language
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} - Translated text
 */
function translate(key, params = {}) {
    if (!key) return '';
    
    const text = translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
    
    // Replace parameters in the text
    if (params && Object.keys(params).length > 0) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }
    
    return text;
}

/**
 * Translation dictionary
 */
const translations = {
    'en': {
        // Navigation
        'home': 'Home',
        'recently_played': 'Recently Played',
        'new_games': 'New Games',
        'trending': 'Trending',
        'game_categories': 'Game Categories',
        'action': 'Action',
        'adventure': 'Adventure',
        'arcade': 'Arcade',
        'puzzle': 'Puzzle',
        'racing': 'Racing',
        'sports': 'Sports',
        'shooting': 'Shooting',
        'strategy': 'Strategy',
        'casual': 'Casual',
        'card': 'Card',
        'simulation': 'Simulation',
        'io_games': 'IO Games',
        'all_categories': 'All Categories',
        
        // Search
        'search_placeholder': 'Search games...',
        
        // Section titles
        'featured_games': 'Featured Games',
        'popular_games': 'Popular Games',
        'new_games_title': 'New Games',
        'all_games': 'All Games',
        'related_games': 'Related Games',
        
        // Game page
        'back_to_games': 'Back to Games',
        'add_to_favorites': 'Add to Favorites',
        'remove_from_favorites': 'Remove from Favorites',
        'fullscreen': 'Fullscreen',
        'how_to_play': 'How to Play',
        
        // Footer
        'about': 'About Us',
        'contact': 'Contact',
        'privacy': 'Privacy Policy',
        'terms': 'Terms of Service',
        'copyright': '© 2023 Game Center. All rights reserved.',
        
        // Messages
        'no_games': 'No games available.',
        'loading': 'Loading...',
        'error_loading': 'Failed to load game data. Please try again later.',
        'search_results': 'Search Results for "{query}"',
        
        // Categories
        'all_games_title': 'All Games',
        'recently_played_title': 'Recently Played',
        'favorites_title': 'Favorites',
        'new_games_category': 'New Games',
        'trending_games': 'Trending Games',
        'all_categories_title': 'All Categories'
    },
    'zh': {
        // 导航
        'home': '首页',
        'recently_played': '最近游玩',
        'new_games': '新游戏',
        'trending': '热门游戏',
        'game_categories': '游戏分类',
        'action': '动作',
        'adventure': '冒险',
        'arcade': '街机',
        'puzzle': '益智',
        'racing': '赛车',
        'sports': '体育',
        'shooting': '射击',
        'strategy': '策略',
        'casual': '休闲',
        'card': '卡牌',
        'simulation': '模拟',
        'io_games': 'IO游戏',
        'all_categories': '所有分类',
        
        // 搜索
        'search_placeholder': '搜索游戏...',
        
        // 区块标题
        'featured_games': '精选游戏',
        'popular_games': '热门游戏',
        'new_games_title': '新游戏',
        'all_games': '所有游戏',
        'related_games': '相关游戏',
        
        // 游戏页面
        'back_to_games': '返回游戏列表',
        'add_to_favorites': '添加到收藏',
        'remove_from_favorites': '从收藏中移除',
        'fullscreen': '全屏',
        'how_to_play': '游戏操作',
        
        // 页脚
        'about': '关于我们',
        'contact': '联系我们',
        'privacy': '隐私政策',
        'terms': '服务条款',
        'copyright': '© 2023 Game Center. 保留所有权利。',
        
        // 消息
        'no_games': '没有可用的游戏。',
        'loading': '加载中...',
        'error_loading': '加载游戏数据失败。请稍后再试。',
        'search_results': '"{query}"的搜索结果',
        
        // 分类
        'all_games_title': '所有游戏',
        'recently_played_title': '最近游玩',
        'favorites_title': '收藏夹',
        'new_games_category': '新游戏',
        'trending_games': '热门游戏',
        'all_categories_title': '所有分类'
    }
};

// Export functions for use in other scripts
window.i18n = {
    getCurrentLanguage,
    translate,
    translateUI,
    setupLanguageSwitch,
    updateLanguageButton
}; 