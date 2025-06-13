/**
 * Game Loader - Handles loading and displaying game data on the game detail page
 */

// Store current game data
let currentGame = null;
let allGames = [];

// DOM loaded event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game page loaded');
    
    // Get game ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) {
        // No game ID provided, redirect to home page
        window.location.href = 'index.html';
        return;
    }
    
    // Load game data
    loadGameData(gameId);
    
    // Setup mobile sidebar
    setupMobileSidebar();
    
    // Setup fullscreen button
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame) {
            if (gameFrame.requestFullscreen) {
                gameFrame.requestFullscreen();
            } else if (gameFrame.webkitRequestFullscreen) {
                gameFrame.webkitRequestFullscreen();
            } else if (gameFrame.msRequestFullscreen) {
                gameFrame.msRequestFullscreen();
            }
        }
    });
    
    // Setup favorite button
    document.getElementById('favoriteBtn').addEventListener('click', function() {
        if (currentGame) {
            const isFavorited = toggleFavorite(currentGame);
            updateFavoriteButton(isFavorited);
        }
    });
    
    // Setup fullscreen button in game frame
    document.querySelector('.fullscreen-btn').addEventListener('click', function() {
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame) {
            if (gameFrame.requestFullscreen) {
                gameFrame.requestFullscreen();
            } else if (gameFrame.webkitRequestFullscreen) {
                gameFrame.webkitRequestFullscreen();
            } else if (gameFrame.msRequestFullscreen) {
                gameFrame.msRequestFullscreen();
            }
        }
    });
});

/**
 * Load game data from JSON file
 * @param {string} gameId - ID of the game to load
 */
function loadGameData(gameId) {
    fetch('games_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store all games
            allGames = data;
            
            // Find game by ID or URL
            const game = data.find(g => g.id === gameId || g.url === gameId);
            
            if (!game) {
                throw new Error('Game not found');
            }
            
            // Store current game
            currentGame = game;
            
            // Update page with game data
            updateGamePage(game);
            
            // Load related games
            loadRelatedGames(game);
            
            // Add to recently played
            addToRecentlyPlayed(game);
            
            // Check if game is favorited
            checkIfFavorited(game);
        })
        .catch(error => {
            console.error('Failed to load game data:', error);
            
            const errorMessage = window.i18n ? 
                window.i18n.translate('error_loading') : 
                'Failed to load game data. Please try again later.';
            
            document.getElementById('gameDescription').textContent = errorMessage;
            
            // Show error message
            showErrorMessage(errorMessage);
        });
}

/**
 * Update page with game data
 * @param {Object} game - Game object
 */
function updateGamePage(game) {
    // Update page title
    document.title = `${game.name} - Game Center`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', game.description || `Play ${game.name} online for free. No downloads required, play directly in your browser!`);
    }
    
    // Update game frame
    const gameFrame = document.getElementById('gameFrame');
    if (gameFrame) {
        if (game.embed_url) {
            gameFrame.src = game.embed_url;
        } else if (game.url) {
            // Try to construct embed URL
            if (game.url.includes('crazygames.com')) {
                const gameSlug = game.url.split('/').pop();
                gameFrame.src = `https://www.crazygames.com/embed/${gameSlug}`;
            } else {
                gameFrame.src = game.url;
            }
        }
        
        // Add cross-origin attributes
        gameFrame.setAttribute('allow', 'fullscreen; autoplay; cross-origin; gamepad *;');
        gameFrame.setAttribute('referrerpolicy', 'no-referrer');
        gameFrame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
    }
    
    // Update game title
    document.getElementById('gameTitle').textContent = game.name;
    
    // Update game category
    document.getElementById('gameCategory').textContent = game.category || 'Other';
    
    // Update game developer
    const developerElem = document.getElementById('gameDeveloper');
    if (developerElem) {
        developerElem.textContent = game.developer || 'Unknown Developer';
    }
    
    // Update game description
    document.getElementById('gameDescription').textContent = game.description || 'No description available for this game.';
    
    // Update game tags
    const tagsContainer = document.getElementById('gameTags');
    if (tagsContainer && game.tags && game.tags.length > 0) {
        tagsContainer.innerHTML = game.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    } else if (tagsContainer) {
        tagsContainer.innerHTML = `<span class="tag">${game.category || 'Other'}</span>`;
    }
    
    // Update game controls (if available)
    updateGameControls(game);
}

/**
 * Update game controls
 * @param {Object} game - Game object
 */
function updateGameControls(game) {
    // This would require specific control data for each game
    // For now, we'll use generic controls based on category
    const controlsList = document.getElementById('gameControls');
    if (!controlsList) return;
    
    let controls = [];
    
    // Set default controls based on category
    switch(game.category?.toLowerCase()) {
        case 'racing':
            controls = [
                { icon: 'arrow-up', text: 'Accelerate' },
                { icon: 'arrow-down', text: 'Brake / Reverse' },
                { icon: 'arrow-left', text: 'Turn Left' },
                { icon: 'arrow-right', text: 'Turn Right' },
                { icon: 'space-bar', text: 'Handbrake / Drift' }
            ];
            break;
        case 'shooting':
            controls = [
                { icon: 'arrow-up', text: 'Move Forward' },
                { icon: 'arrow-down', text: 'Move Backward' },
                { icon: 'arrow-left', text: 'Move Left' },
                { icon: 'arrow-right', text: 'Move Right' },
                { icon: 'mouse', text: 'Aim' },
                { icon: 'mouse-pointer', text: 'Shoot' }
            ];
            break;
        case 'puzzle':
            controls = [
                { icon: 'mouse', text: 'Select / Move' },
                { icon: 'mouse-pointer', text: 'Click to Interact' }
            ];
            break;
        case 'adventure':
            controls = [
                { icon: 'arrow-up', text: 'Move Forward / Jump' },
                { icon: 'arrow-down', text: 'Move Backward / Duck' },
                { icon: 'arrow-left', text: 'Move Left' },
                { icon: 'arrow-right', text: 'Move Right' },
                { icon: 'mouse', text: 'Look Around' },
                { icon: 'mouse-pointer', text: 'Interact' }
            ];
            break;
        default:
            controls = [
                { icon: 'arrow-up', text: 'Move Up / Jump' },
                { icon: 'arrow-left', text: 'Move Left' },
                { icon: 'arrow-right', text: 'Move Right' },
                { icon: 'arrow-down', text: 'Move Down / Duck' },
                { icon: 'mouse', text: 'Aim / Interact' }
            ];
    }
    
    // Translate control text if i18n is available
    if (window.i18n) {
        controls = controls.map(control => {
            return {
                icon: control.icon,
                text: window.i18n.translate(`control_${control.icon}`) || control.text
            };
        });
    }
    
    // Generate HTML for controls
    controlsList.innerHTML = controls.map(control => `
        <div class="control-item">
            <i class="fas fa-${control.icon}"></i>
            <span>${control.text}</span>
        </div>
    `).join('');
}

/**
 * Load related games
 * @param {Object} game - Current game
 */
function loadRelatedGames(game) {
    const container = document.getElementById('relatedGamesContainer');
    if (!container || !allGames || !game) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Find related games based on category and tags
    let relatedGames = allGames.filter(g => {
        // Skip current game
        if (g.url === game.url) return false;
        
        // Match by category
        if (g.category && game.category && g.category === game.category) {
            return true;
        }
        
        // Match by tags
        if (g.tags && game.tags && Array.isArray(g.tags) && Array.isArray(game.tags)) {
            for (const tag of game.tags) {
                if (g.tags.includes(tag)) {
                    return true;
                }
            }
        }
        
        return false;
    });
    
    // If not enough related games, add random games
    if (relatedGames.length < 6) {
        const randomGames = getRandomGames(
            allGames.filter(g => g.url !== game.url && !relatedGames.includes(g)),
            6 - relatedGames.length
        );
        relatedGames = [...relatedGames, ...randomGames];
    }
    
    // Limit to 6 games
    relatedGames = relatedGames.slice(0, 6);
    
    // Create game cards
    relatedGames.forEach(game => {
        const card = createGameCard(game);
        container.appendChild(card);
    });
    
    // Add event listeners to game cards
    addGameCardEvents(container);
}

/**
 * Create a game card element
 * @param {Object} game - Game object
 * @returns {HTMLElement} - Game card element
 */
function createGameCard(game) {
    const column = document.createElement('div');
    column.className = 'col-6 col-md-4 mb-4';
    
    column.innerHTML = `
        <div class="game-card" data-id="${game.id}" data-url="${game.url}">
            <img src="${game.cover || 'img/placeholder.jpg'}" class="card-img-top" alt="${game.name}">
            <div class="card-body">
                <h5 class="card-title">${game.name}</h5>
                <span class="category-badge">${game.category || 'Other'}</span>
            </div>
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
            
            // Navigate to game page
            window.location.href = `game.html?id=${encodeURIComponent(gameUrl)}`;
        });
    });
}

/**
 * Add game to recently played
 * @param {Object} game - Game object
 */
function addToRecentlyPlayed(game) {
    // Ensure game has an ID
    const gameId = game.id || game.url;
    
    // Get recently played from local storage
    let recentlyPlayed = [];
    try {
        const savedRecentlyPlayed = localStorage.getItem('recentlyPlayed');
        if (savedRecentlyPlayed) {
            recentlyPlayed = JSON.parse(savedRecentlyPlayed);
        }
    } catch (e) {
        console.error('Error parsing recently played data:', e);
    }
    
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
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
}

/**
 * Toggle favorite status for a game
 * @param {Object} game - Game object
 * @returns {boolean} - Whether game is now favorited
 */
function toggleFavorite(game) {
    // Ensure game has an ID
    const gameId = game.id || game.url;
    
    // Get favorites from local storage
    let favorites = [];
    try {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            favorites = JSON.parse(savedFavorites);
        }
    } catch (e) {
        console.error('Error parsing favorites data:', e);
    }
    
    // Check if game is already favorited
    const index = favorites.indexOf(gameId);
    
    if (index !== -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        return false;
    } else {
        // Add to favorites
        favorites.push(gameId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        return true;
    }
}

/**
 * Check if game is favorited
 * @param {Object} game - Game object
 */
function checkIfFavorited(game) {
    // Ensure game has an ID
    const gameId = game.id || game.url;
    
    // Get favorites from local storage
    let favorites = [];
    try {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            favorites = JSON.parse(savedFavorites);
        }
    } catch (e) {
        console.error('Error parsing favorites data:', e);
    }
    
    // Check if game is favorited
    const isFavorited = favorites.includes(gameId);
    
    // Update favorite button
    updateFavoriteButton(isFavorited);
}

/**
 * Update favorite button state
 * @param {boolean} isFavorited - Whether game is favorited
 */
function updateFavoriteButton(isFavorited) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (!favoriteBtn) return;
    
    if (isFavorited) {
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = `<i class="fas fa-heart"></i> <span data-i18n="remove_from_favorites">${window.i18n ? window.i18n.translate('remove_from_favorites') : 'Remove from Favorites'}</span>`;
    } else {
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = `<i class="far fa-heart"></i> <span data-i18n="add_to_favorites">${window.i18n ? window.i18n.translate('add_to_favorites') : 'Add to Favorites'}</span>`;
    }
}

/**
 * Open a game
 * @param {string} gameId - Game ID
 */
function openGame(gameId) {
    window.location.href = `game.html?id=${encodeURIComponent(gameId)}`;
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.textContent = message;
    
    // Add to page
    const container = document.querySelector('.game-frame-container');
    if (container) {
        container.appendChild(errorDiv);
    }
}

/**
 * Get random games from array
 * @param {Array} games - Array of game objects
 * @param {number} count - Number of games to return
 * @returns {Array} - Array of random games
 */
function getRandomGames(games, count) {
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