document.addEventListener('DOMContentLoaded', function() {
    const carousels = {
        'thm': { index: 0, itemsPerView: 5 },
        'crypto': { index: 0, itemsPerView: 5 },
        'network': { index: 0, itemsPerView: 5 },
        'password': { index: 0, itemsPerView: 5 },
        'exploits': { index: 0, itemsPerView: 5 }
    };

    function updateCarousel(carouselId) {
        const carousel = carousels[carouselId];
        const container = document.getElementById(`${carouselId}-carousel`);
        if (!container) return;
        
        const track = container.querySelector('.carousel-track');
        const cards = track.querySelectorAll('.resource-card:not(.hidden)');
        
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // 1.5rem in pixels
        
        const offset = -(carousel.index * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        
        updateButtons(carouselId, cards.length);
    }

    function updateButtons(carouselId, totalCards) {
        const carousel = carousels[carouselId];
        const prevBtn = document.querySelector(`[data-carousel="${carouselId}"].prev`);
        const nextBtn = document.querySelector(`[data-carousel="${carouselId}"].next`);
        
        if (!prevBtn || !nextBtn) return;
        
        prevBtn.disabled = carousel.index === 0;
        nextBtn.disabled = carousel.index >= totalCards - carousel.itemsPerView;
    }

    function updateItemsPerView() {
        const width = window.innerWidth;
        let itemsPerView;
        
        if (width > 1200) {
            itemsPerView = 5;
        } else if (width > 768) {
            itemsPerView = 3;
        } else if (width > 480) {
            itemsPerView = 2;
        } else {
            itemsPerView = 1;
        }
        
        Object.keys(carousels).forEach(key => {
            carousels[key].itemsPerView = itemsPerView;
            updateCarousel(key);
        });
    }

    // Initialize all carousels
    Object.keys(carousels).forEach(carouselId => {
        const prevBtn = document.querySelector(`[data-carousel="${carouselId}"].prev`);
        const nextBtn = document.querySelector(`[data-carousel="${carouselId}"].next`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (carousels[carouselId].index > 0) {
                    carousels[carouselId].index--;
                    updateCarousel(carouselId);
                }
            });
            
            nextBtn.addEventListener('click', () => {
                const container = document.getElementById(`${carouselId}-carousel`);
                if (!container) return;
                
                const cards = container.querySelectorAll('.resource-card:not(.hidden)');
                if (carousels[carouselId].index < cards.length - carousels[carouselId].itemsPerView) {
                    carousels[carouselId].index++;
                    updateCarousel(carouselId);
                }
            });
        }
    });

    // Update on window resize
    window.addEventListener('resize', updateItemsPerView);
    
    // Initial setup
    updateItemsPerView();

    // Search functionality
    (function initSearch() {
        const searchInput = document.getElementById('resourceSearch');
        const searchResults = document.getElementById('searchResults');
        const allCards = document.querySelectorAll('.resource-card');
        const allCategories = document.querySelectorAll('.resource-category');
        let noResultsDiv = null;

        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Reset all carousels to index 0 when searching
            if (searchTerm) {
                Object.keys(carousels).forEach(key => {
                    carousels[key].index = 0;
                });
            }
            
            if (!searchTerm) {
                // Show everything if search is empty
                allCards.forEach(card => card.classList.remove('hidden'));
                allCategories.forEach(cat => cat.classList.remove('hidden'));
                searchResults.textContent = '';
                if (noResultsDiv) noResultsDiv.remove();
                
                // Reset carousels
                Object.keys(carousels).forEach(carouselId => {
                    updateCarousel(carouselId);
                });
                return;
            }

            let matchCount = 0;
            let visibleCategories = new Set();

            // Search through all cards
            allCards.forEach(card => {
                const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
                const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.classList.remove('hidden');
                    matchCount++;
                    
                    // Find parent category
                    const category = card.closest('.resource-category');
                    if (category) {
                        visibleCategories.add(category);
                    }
                } else {
                    card.classList.add('hidden');
                }
            });

            // Show/hide categories based on matches
            allCategories.forEach(cat => {
                if (visibleCategories.has(cat)) {
                    cat.classList.remove('hidden');
                } else {
                    cat.classList.add('hidden');
                }
            });

            // Update search results text
            if (matchCount > 0) {
                searchResults.textContent = `Found ${matchCount} resource${matchCount !== 1 ? 's' : ''}`;
                if (noResultsDiv) noResultsDiv.remove();
            } else {
                searchResults.textContent = 'No resources found';
                
                // Show "no results" message
                if (!noResultsDiv) {
                    noResultsDiv = document.createElement('div');
                    noResultsDiv.className = 'no-results-message';
                    noResultsDiv.innerHTML = `
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style="margin-bottom: 1rem;">
                            <circle cx="30" cy="30" r="25" stroke="#555555" stroke-width="2"/>
                            <line x1="20" y1="25" x2="28" y2="25" stroke="#555555" stroke-width="2"/>
                            <line x1="32" y1="25" x2="40" y2="25" stroke="#555555" stroke-width="2"/>
                            <path d="M22 38 Q30 33 38 38" stroke="#555555" stroke-width="2" fill="none"/>
                        </svg>
                        <p>No resources match "${searchTerm}"</p>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Try different keywords or browse all categories</p>
                    `;
                    document.querySelector('.education-section').appendChild(noResultsDiv);
                }
            }

            // Update carousels after filtering
            Object.keys(carousels).forEach(carouselId => {
                const container = document.getElementById(`${carouselId}-carousel`);
                if (container && !container.closest('.resource-category').classList.contains('hidden')) {
                    updateCarousel(carouselId);
                }
            });
        });

        // Clear search with Escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        });
    })();
});