/**
 * Game Center - Main JavaScript
 * Handles game loading, filtering, searching and user interactions
 */

// Global variables
let allGames = [];
let currentCategory = 'all';
let recentlyPlayed = [];
let favorites = [];
// currentLanguage is defined in i18n.js

// DOM loaded event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Load games data
    loadGamesData();
    
    // Setup navigation
    setupNavigation();
    
    // Setup search
    setupSearch();
    
    // Load user data from local storage
    loadUserData();
    
    // Setup mobile sidebar
    setupMobileSidebar();
});

/**
 * Load games data from JSON file
 */
function loadGamesData() {
    showLoader();
    
    // 从games_data.json加载数据
    fetch('games_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allGames = data;
            console.log(`Loaded ${allGames.length} games`);
            
            // Add unique IDs to games if they don't have them
            allGames.forEach((game, index) => {
                if (!game.id) {
                    game.id = `game-${index}`;
                }
            });
            
            // 直接显示所有游戏，不使用setTimeout
            displayFeaturedGames();
            displayPopularGames();
            displayNewGames();
            displayGames(allGames);
            
            // 隐藏加载动画
            hideLoader();
        })
        .catch(error => {
            console.error('Error loading games data:', error);
            showErrorMessage('加载游戏数据失败，请稍后重试。');
            hideLoader();
            
            // 加载失败时使用备用数据
            useFallbackData();
        });
}

/**
 * 加载失败时使用备用数据
 */
function useFallbackData() {
    // 备用游戏数据
    const fallbackGames = [
        {
            id: "game1",
            name: "赛车游戏",
            url: "#",
            cover: "https://via.placeholder.com/300x200/3498db/ffffff?text=赛车游戏",
            category: "racing",
            description: "一个精彩的赛车游戏"
        },
        {
            id: "game2",
            name: "益智游戏",
            url: "#",
            cover: "https://via.placeholder.com/300x200/e74c3c/ffffff?text=益智游戏",
            category: "puzzle",
            description: "一个有趣的益智游戏"
        },
        {
            id: "game3",
            name: "动作游戏",
            url: "#",
            cover: "https://via.placeholder.com/300x200/2ecc71/ffffff?text=动作游戏",
            category: "action",
            description: "一个刺激的动作游戏"
        },
        {
            id: "game4",
            name: "射击游戏",
            url: "#",
            cover: "https://via.placeholder.com/300x200/f39c12/ffffff?text=射击游戏",
            category: "shooting",
            description: "一个紧张的射击游戏"
        },
        {
            id: "game5",
            name: "体育游戏",
            url: "#",
            cover: "https://via.placeholder.com/300x200/9b59b6/ffffff?text=体育游戏",
            category: "sports",
            description: "一个激烈的体育游戏"
        },
        {
            id: "game6",
            name: "模拟游戏",
            url: "#",
            cover: "https://via.placeholder.com/300x200/1abc9c/ffffff?text=模拟游戏",
            category: "simulation",
            description: "一个真实的模拟游戏"
        }
    ];
    
    allGames = fallbackGames;
    console.log(`Using ${allGames.length} fallback games`);
    
    // 显示备用游戏数据
    displayFeaturedGames();
    displayPopularGames();
    displayNewGames();
    displayGames(allGames);
}

/**
 * Show loader animation
 */
function showLoader() {
    // Check if loader exists
    let loader = document.querySelector('.loader');
    
    if (!loader) {
        // Create loader if it doesn't exist
        loader = document.createElement('div');
        loader.className = 'loader';
        
        const spinner = document.createElement('div');
        spinner.className = 'loader-spinner';
        
        loader.appendChild(spinner);
        document.getElementById('gameContainer').appendChild(loader);
    } else {
        // Show existing loader
        loader.style.display = 'flex';
    }
}

/**
 * Hide loader animation
 */
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const gameContainer = document.getElementById('gameContainer');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    
    // Clear container and append error
    gameContainer.innerHTML = '';
    gameContainer.appendChild(errorDiv);
}

/**
 * Display featured games
 */
function displayFeaturedGames() {
    // Get random featured games (6)
    const featuredGames = getRandomGames(allGames, 6);
    
    // Get container
    const container = document.getElementById('featuredGamesContainer');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if we have games
    if (!featuredGames || featuredGames.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No featured games available</div>';
        return;
    }
    
    // Create game cards
    featuredGames.forEach(game => {
        const card = createGameCard(game, 'col-6 col-md-4 col-lg-2 mb-4', true);
        container.appendChild(card);
    });
    
    // 添加事件监听器，点击时打开模态框而不是跳转
    addGameModalEvents(container);
}

/**
 * Display popular games
 */
function displayPopularGames() {
    // Get random popular games (12)
    const popularGames = getRandomGames(allGames, 12);
    
    // Get container
    const container = document.getElementById('popularGamesContainer');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if we have games
    if (!popularGames || popularGames.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No popular games available</div>';
        return;
    }
    
    // Create game cards
    popularGames.forEach(game => {
        const card = createGameCard(game);
        container.appendChild(card);
    });
    
    // 添加事件监听器，点击时打开模态框而不是跳转
    addGameModalEvents(container);
}

/**
 * Display new games
 */
function displayNewGames() {
    // Get last 12 games as new games
    const newGames = allGames && allGames.length > 12 ? [...allGames].slice(-12) : allGames;
    
    // Get container
    const container = document.getElementById('newGamesContainer');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if we have games
    if (!newGames || newGames.length === 0) {
        container.innerHTML = '<div class="col-12 text-center">No new games available</div>';
        return;
    }
    
    // Create game cards
    newGames.forEach(game => {
        const card = createGameCard(game, 'col-6 col-sm-4 col-md-3 col-lg-2 mb-4', true);
        container.appendChild(card);
    });
    
    // 添加事件监听器，点击时打开模态框而不是跳转
    addGameModalEvents(container);
}

/**
 * Display games in the main container
 * @param {Array} games - Array of game objects
 * @param {string} title - Optional title to display
 */
function displayGames(games, title) {
    // Get container
    const container = document.getElementById('gameContainer');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Update title if provided
    if (title) {
        const sectionTitle = document.querySelector('.section-title:last-of-type');
        if (sectionTitle) {
            sectionTitle.textContent = title;
        }
    }
    
    // Show message if no games
    if (!games || games.length === 0) {
        const noGamesMsg = document.createElement('div');
        noGamesMsg.className = 'col-12 text-center mt-4';
        noGamesMsg.textContent = window.i18n ? window.i18n.translate('no_games') : 'No games available.';
        container.appendChild(noGamesMsg);
        return;
    }
    
    // Create game cards
    games.forEach(game => {
        const card = createGameCard(game);
        container.appendChild(card);
    });
    
    // Add event listeners to game cards
    addGameCardEvents(container);
}

/**
 * Create a game card element
 * @param {Object} game - Game object
 * @param {string} columnClass - CSS class for column layout
 * @param {boolean} isNew - Whether to show new badge
 * @returns {HTMLElement} - Game card element
 */
function createGameCard(game, columnClass = 'col-6 col-sm-4 col-md-3 col-lg-2 mb-4', isNew = false) {
    if (!game) return document.createElement('div');
    
    const column = document.createElement('div');
    column.className = columnClass;
    
    // Ensure all required properties exist
    const gameId = game.id || '';
    const gameUrl = game.url || '#';
    const gameName = game.name || '未知游戏';
    const gameCover = game.cover || 'https://via.placeholder.com/300x200/cccccc/ffffff?text=游戏';
    const gameCategory = game.category || '其他';
    
    // 简化HTML结构，移除多余的嵌套
    column.innerHTML = `
        <div class="game-card" data-id="${gameId}" data-url="${gameUrl}">
            <img src="${gameCover}" class="card-img-top" alt="${gameName}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=加载失败';">
            <div class="card-body">
                <h5 class="card-title">${gameName}</h5>
            </div>
            <span class="category-badge">${gameCategory}</span>
            ${isNew ? '<span class="new-badge">New</span>' : ''}
        </div>
    `;
    
    return column;
}

/**
 * Add event listeners to game cards
 * @param {HTMLElement} container - Container with game cards
 */
function addGameCardEvents(container) {
    container.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            const gameId = this.getAttribute('data-id');
            const gameUrl = this.getAttribute('data-url');
            const gameCategory = this.querySelector('.category-badge').textContent.toLowerCase();
            const gameName = this.querySelector('.card-title').textContent.trim();
            
            if (!gameUrl) return;
            
            // 使用伪静态URL格式
            const slugName = gameName.toLowerCase()
                .replace(/[^\w\s-]/g, '') // 移除特殊字符
                .replace(/\s+/g, '-')     // 将空格替换为连字符
                .replace(/-+/g, '-');     // 移除多余的连字符
            
            console.log('点击游戏卡片:', {
                gameId,
                gameUrl,
                gameCategory,
                gameName,
                slugName
            });
            
            // 本地开发环境特殊处理
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // 在本地环境中，直接跳转到game.html，带上查询参数
                // 使用URL作为ID，因为很多游戏没有ID但有URL
                const idParam = gameUrl && gameUrl !== '#' ? gameUrl : slugName;
                window.location.href = `game.html?id=${encodeURIComponent(idParam)}&category=${gameCategory}`;
            } else {
                // 在生产环境中，使用伪静态URL
                window.location.href = `games/${gameCategory}/${slugName}.html`;
            }
        });
    });
}

/**
 * Find game by ID
 * @param {string} id - Game ID
 * @returns {Object|null} - Game object or null if not found
 */
function findGameById(id) {
    if (!id || !allGames || !Array.isArray(allGames)) return null;
    return allGames.find(game => game.id === id || game.url === id) || null;
}

/**
 * Open game modal
 * @param {Object} game - Game object
 */
function openGameModal(game) {
    if (!game) return;
    
    // Ensure modal exists
    ensureGameModalExists();
    
    // Get modal elements
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('gameModalTitle');
    const modalFrame = document.getElementById('gameModalFrame');
    const modalDescription = document.getElementById('gameModalDescription');
    const modalCategory = document.getElementById('gameModalCategory');
    
    // Update modal content
    modalTitle.textContent = game.name || 'Game';
    modalCategory.textContent = game.category || 'Other';
    modalDescription.textContent = game.description || 'No description available.';
    
    // Set iframe source
    if (game.embed_url) {
        modalFrame.src = game.embed_url;
    } else if (game.url) {
        // Try to construct embed URL
        if (game.url.includes('crazygames.com')) {
            const gameSlug = game.url.split('/').pop();
            modalFrame.src = `https://www.crazygames.com/embed/${gameSlug}`;
    } else {
            modalFrame.src = game.url;
        }
    }
    
    // Add to recently played
    addToRecentlyPlayed(game);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Add event listener to close button
    modal.querySelector('.btn-close').addEventListener('click', function() {
        modalFrame.src = '';
    });
}

/**
 * Ensure game modal exists in the DOM
 */
function ensureGameModalExists() {
    if (!document.getElementById('gameModal')) {
        const modalHTML = `
            <div class="modal fade" id="gameModal" tabindex="-1" aria-labelledby="gameModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="gameModalTitle">Game Title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-lg-8">
                                    <div class="game-frame-container">
                                        <iframe id="gameModalFrame" src="" frameborder="0" allowfullscreen></iframe>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="game-info">
                                        <p class="category-badge" id="gameModalCategory">Category</p>
                                        <p id="gameModalDescription">Game description</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

/**
 * Setup navigation
 */
function setupNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get category
            const category = this.getAttribute('data-category');
            
            console.log('点击导航:', {
                category,
                text: this.textContent.trim(),
                hostname: window.location.hostname
            });
            
            // Update current category
            currentCategory = category;
            
            // 如果是分类链接，使用伪静态URL
            if (category && category !== 'all' && category !== 'recently-played' && 
                category !== 'favorites' && category !== 'new-games' && 
                category !== 'trending' && category !== 'all-categories') {
                
                // 本地开发环境特殊处理
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    // 在本地环境中，直接跳转到index.html，带上查询参数
                    window.location.href = `index.html?category=${category}`;
                } else {
                    // 在生产环境中，使用伪静态URL
                    window.location.href = `games/category/${category}.html`;
                }
                return;
            }
            
            // 否则使用传统方式过滤游戏
            filterGamesByCategory(category);
        });
    });
}

/**
 * Setup search
 */
function setupSearch() {
    // Get search form
    const searchForm = document.querySelector('.search-form');
    if (!searchForm) return;
    
    // Add submit event listener
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get search input
        const searchInput = this.querySelector('input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.trim();
        
        // Search games
        if (searchTerm) {
            searchGames(searchTerm);
        } else {
            // Reset to all games
            // 恢复所有区块的显示
            const featuredTitle = document.querySelector('.section-title[data-i18n="featured_games"]');
            const popularTitle = document.querySelector('.section-title[data-i18n="popular_games"]');
            const newGamesTitle = document.querySelector('.section-title[data-i18n="new_games_title"]');
            
            if (featuredTitle) {
                featuredTitle.style.display = '';
                featuredTitle.nextElementSibling.style.display = '';
            }
            if (popularTitle) {
                popularTitle.style.display = '';
                popularTitle.nextElementSibling.style.display = '';
            }
            if (newGamesTitle) {
                newGamesTitle.style.display = '';
                newGamesTitle.nextElementSibling.style.display = '';
            }
            
            displayGames(allGames);
        }
    });
}

/**
 * Search games
 * @param {string} searchTerm - Search term
 */
function searchGames(searchTerm) {
    if (!searchTerm || !allGames) {
        displayGames(allGames);
        return;
    }
    
    // Convert search term to lowercase
    const term = searchTerm.toLowerCase();
    
    // Filter games
    const results = allGames.filter(game => {
        // Search in name
        if (game.name && game.name.toLowerCase().includes(term)) {
            return true;
        }
        
        // Search in description
        if (game.description && game.description.toLowerCase().includes(term)) {
            return true;
        }
        
        // Search in category
        if (game.category && game.category.toLowerCase().includes(term)) {
            return true;
        }
        
        // Search in tags
        if (game.tags && Array.isArray(game.tags)) {
            return game.tags.some(tag => tag.toLowerCase().includes(term));
        }
        
        return false;
    });
    
    // 获取各个部分的标题和容器
    const featuredTitle = document.querySelector('.section-title[data-i18n="featured_games"]');
    const popularTitle = document.querySelector('.section-title[data-i18n="popular_games"]');
    const newGamesTitle = document.querySelector('.section-title[data-i18n="new_games_title"]');
    
    // 搜索时隐藏其他部分，只显示搜索结果
    if (featuredTitle) {
        featuredTitle.style.display = 'none';
        featuredTitle.nextElementSibling.style.display = 'none';
    }
    if (popularTitle) {
        popularTitle.style.display = 'none';
        popularTitle.nextElementSibling.style.display = 'none';
    }
    if (newGamesTitle) {
        newGamesTitle.style.display = 'none';
        newGamesTitle.nextElementSibling.style.display = 'none';
    }
    
    // Display results
    const searchResultsTitle = window.i18n ? 
        window.i18n.translate('search_results', { query: searchTerm }) : 
        `Search Results for "${searchTerm}"`;
    
    displayGames(results, searchResultsTitle);
}

/**
 * Filter games by category
 * @param {string} category - Category to filter by
 */
function filterGamesByCategory(category) {
    if (!category || !allGames) {
        displayGames(allGames);
        return;
    }
    
    // 获取各个部分的标题和容器
    const featuredTitle = document.querySelector('.section-title[data-i18n="featured_games"]');
    const popularTitle = document.querySelector('.section-title[data-i18n="popular_games"]');
    const newGamesTitle = document.querySelector('.section-title[data-i18n="new_games_title"]');
    const allGamesTitle = document.querySelector('.section-title[data-i18n="all_games"]');
    
    // 处理首页和分类页面的显示逻辑
    if (category === 'all') {
        // 首页显示全部内容
        if (featuredTitle) {
            featuredTitle.style.display = '';
            featuredTitle.nextElementSibling.style.display = '';
        }
        if (popularTitle) {
            popularTitle.style.display = '';
            popularTitle.nextElementSibling.style.display = '';
        }
        if (newGamesTitle) {
            newGamesTitle.style.display = '';
            newGamesTitle.nextElementSibling.style.display = '';
        }
        if (allGamesTitle) {
            // 获取当前语言并设置标题
            const langValue = localStorage.getItem('language') || 'zh';
            allGamesTitle.textContent = langValue === 'en' ? 'All Games' : '所有游戏';
        }
        
        // 显示所有游戏
        displayGames(allGames);
        return;
    } else {
        // 分类页面隐藏其他部分，只显示All Games部分
        if (featuredTitle) {
            featuredTitle.style.display = 'none';
            featuredTitle.nextElementSibling.style.display = 'none';
        }
        if (popularTitle) {
            popularTitle.style.display = 'none';
            popularTitle.nextElementSibling.style.display = 'none';
        }
        if (newGamesTitle) {
            newGamesTitle.style.display = 'none';
            newGamesTitle.nextElementSibling.style.display = 'none';
        }
    }
    
    if (category === 'recently-played') {
        // Display recently played games
        const recentGames = recentlyPlayed.map(id => findGameById(id)).filter(Boolean);
        
        // 获取当前语言并设置标题
        const langValue = localStorage.getItem('language') || 'zh';
        const recentTitle = langValue === 'en' ? 'Recently Played' : '最近游玩';
        
        displayGames(recentGames, recentTitle);
        return;
    }
    
    if (category === 'favorites') {
        // Display favorite games
        const favoriteGames = favorites.map(id => findGameById(id)).filter(Boolean);
        
        // 获取当前语言并设置标题
        const langValue = localStorage.getItem('language') || 'zh';
        const favoritesTitle = langValue === 'en' ? 'Favorites' : '收藏夹';
        
        displayGames(favoriteGames, favoritesTitle);
        return;
    }
    
    if (category === 'new-games') {
        // Display new games (last 20)
        const newGames = [...allGames].slice(-20);
        
        // 获取当前语言并设置标题
        const langValue = localStorage.getItem('language') || 'zh';
        const newGamesTitle = langValue === 'en' ? 'New Games' : '新游戏';
        
        displayGames(newGames, newGamesTitle);
        return;
    }
    
    if (category === 'trending') {
        // Display trending games (random selection)
        const trendingGames = getRandomGames(allGames, 20);
        
        // 获取当前语言并设置标题
        const langValue = localStorage.getItem('language') || 'zh';
        const trendingTitle = langValue === 'en' ? 'Trending' : '热门游戏';
        
        displayGames(trendingGames, trendingTitle);
        return;
    }
    
    if (category === 'all-categories') {
        // 获取当前语言并设置标题
        const langValue = localStorage.getItem('language') || 'zh';
        const allCategoriesTitle = langValue === 'en' ? 'All Categories' : '所有分类';
        
        // TODO: Implement all categories view
        displayGames(allGames, allCategoriesTitle);
        return;
    }
    
    // Filter games by category
    const filteredGames = allGames.filter(game => 
        game.category && game.category.toLowerCase() === category.toLowerCase()
    );
    
    // Get category title
    let categoryTitle = category.charAt(0).toUpperCase() + category.slice(1) + '游戏';
    if (window.getCategoryTitle) {
        categoryTitle = window.getCategoryTitle(category);
    }
    
    // Display filtered games
    displayGames(filteredGames, categoryTitle);
}

/**
 * Add game to recently played
 * @param {Object} game - Game object
 */
function addToRecentlyPlayed(game) {
    if (!game) return;
    
    // Ensure game has an ID
    const gameId = game.id || game.url;
    if (!gameId) return;
    
    // Remove game from list if it's already there
    const index = recentlyPlayed.indexOf(gameId);
    if (index !== -1) {
        recentlyPlayed.splice(index, 1);
    }
    
    // Add game to beginning of list
    recentlyPlayed.unshift(gameId);
    
    // Limit list to 20 items
    if (recentlyPlayed.length > 20) {
        recentlyPlayed.pop();
    }
    
    // Save to local storage
    saveUserData();
}

/**
 * Toggle favorite status for a game
 * @param {Object} game - Game object
 * @returns {boolean} - Whether game is now favorited
 */
function toggleFavorite(game) {
    if (!game) return false;
    
    // Ensure game has an ID
    const gameId = game.id || game.url;
    if (!gameId) return false;
    
    // Check if game is already favorited
    const index = favorites.indexOf(gameId);
    
    if (index !== -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        saveUserData();
        return false;
    } else {
        // Add to favorites
        favorites.push(gameId);
        saveUserData();
        return true;
    }
}

/**
 * Save user data to local storage
 */
function saveUserData() {
    try {
        // Save recently played
        localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
        
        // Save favorites
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
        console.error('Error saving user data:', e);
    }
}

/**
 * Load user data from local storage
 */
function loadUserData() {
    // Load recently played
        const savedRecentlyPlayed = localStorage.getItem('recentlyPlayed');
        if (savedRecentlyPlayed) {
        try {
            recentlyPlayed = JSON.parse(savedRecentlyPlayed);
        } catch (e) {
            console.error('Error parsing recently played data:', e);
            recentlyPlayed = [];
        }
        }
        
    // Load favorites
    const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
        try {
            favorites = JSON.parse(savedFavorites);
        } catch (e) {
            console.error('Error parsing favorites data:', e);
            favorites = [];
        }
    }
}

/**
 * Setup mobile sidebar
 */
function setupMobileSidebar() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content-wrapper');
    
    if (toggleBtn && sidebar && content) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            content.classList.toggle('sidebar-open');
        });
    }
}

/**
 * Get random games from array
 * @param {Array} games - Array of game objects
 * @param {number} count - Number of games to return
 * @returns {Array} - Array of random games
 */
function getRandomGames(games, count) {
    // Check if games is valid
    if (!games || !Array.isArray(games) || games.length === 0) {
        return [];
    }
    
    // If games array is smaller than count, return all games
    if (games.length <= count) {
        return [...games];
    }
    
    // Copy array to avoid modifying original
    const gamesCopy = [...games];
    
    // Shuffle array
    for (let i = gamesCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gamesCopy[i], gamesCopy[j]] = [gamesCopy[j], gamesCopy[i]];
    }
    
    // Return first n elements
    return gamesCopy.slice(0, count);
}

/**
 * 为游戏卡片添加模态框事件（点击打开模态框而不是跳转）
 * @param {HTMLElement} container - 包含游戏卡片的容器
 */
function addGameModalEvents(container) {
    container.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            const gameId = this.getAttribute('data-id');
            const gameUrl = this.getAttribute('data-url');
            const gameCategory = this.querySelector('.category-badge').textContent.toLowerCase();
            const gameName = this.querySelector('.card-title').textContent.trim();
            
            if (!gameUrl) return;
            
            // 使用伪静态URL格式
            const slugName = gameName.toLowerCase()
                .replace(/[^\w\s-]/g, '') // 移除特殊字符
                .replace(/\s+/g, '-')     // 将空格替换为连字符
                .replace(/-+/g, '-');     // 移除多余的连字符
                
            // 使用相对路径，适用于Cloudflare Pages环境
            window.location.href = `games/${gameCategory}/${slugName}.html`;
        });
    });
}

/**
 * 根据URL查找游戏
 * @param {string} url - 游戏URL
 * @returns {Object|null} - 游戏对象或null
 */
function findGameByUrl(url) {
    if (!url || !allGames || !Array.isArray(allGames)) return null;
    return allGames.find(game => game.url === url) || null;
} 