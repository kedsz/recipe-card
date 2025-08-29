class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    getAttributeOrDefault(attributeName, defaultValue = '') {
        return this.hasAttribute(attributeName) ? this.getAttribute(attributeName) : defaultValue;
    }

    getSlotJson(slotName) {
        const slot = this.querySelector(`[slot="${slotName}"]`);
        if (slot && slot.textContent) {
            try {
                return JSON.parse(slot.textContent);
            } catch (e) {
                console.error(`Error parsing JSON from slot "${slotName}":`, e);
                return [];
            }
        }
        return [];
    }

    getSlotHtml(slotName) {
        const slot = this.querySelector(`[slot="${slotName}"]`);
        return slot ? slot.innerHTML : '';
    }

    render() {
        const title = this.getAttributeOrDefault('data-title', 'Recipe Title');
        const subtitle = this.getAttributeOrDefault('data-subtitle', 'A delicious recipe');
        const servings = this.getAttributeOrDefault('data-servings', 'N/A');
        const time = this.getAttributeOrDefault('data-time', 'N/A');
        const sourceType = this.getAttributeOrDefault('data-source-type', 'link');
        const sourceText = this.getAttributeOrDefault('data-source-text', 'Source');
        const imageSrc = this.getAttributeOrDefault('data-image-src', 'https://placehold.co/800x600/cccccc/ffffff?text=Recipe+Image');
        const theme = this.getAttributeOrDefault('theme', '');

        const ingredients = this.getSlotJson('ingredients');
        const directions = this.getSlotJson('directions');
        const notes = this.getSlotHtml('notes');

        let sourceIconClass = 'fa-solid fa-link'; // Default icon
        switch (sourceType) {
            case 'youtube':
                sourceIconClass = 'fa-brands fa-youtube';
                break;
            case 'instagram':
                sourceIconClass = 'fa-brands fa-instagram';
                break;
            case 'book-open':
                sourceIconClass = 'fa-solid fa-book-open';
                break;
            case 'users':
                sourceIconClass = 'fa-solid fa-users';
                break;
        }

        this.shadowRoot.innerHTML = `
            <!-- Link to external stylesheets -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
            <link href="css/styles.css" rel="stylesheet" />

            <div class="recipe-card-wrapper ${theme ? `theme-${theme}` : ''}">
                <article class="recipe-card">
                    <header class="recipe-header">
                        <h1 class="recipe-title">${title}</h1>
                        <p class="recipe-subtitle">${subtitle}</p>
                        <div class="recipe-meta">
                            <div class="meta-item">
                                <i class="fa-solid fa-utensils"></i>
                                <span>${servings}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fa-regular fa-clock"></i>
                                <span>${time}</span>
                            </div>
                            <div class="meta-item">
                                <i class="${sourceIconClass}"></i>
                                <span>${sourceText}</span>
                            </div>
                        </div>
                    </header>

                    <div class="recipe-body">
                        <div class="recipe-image-container">
                            <img src="${imageSrc}" alt="${title}" class="recipe-image" onerror="this.src='https://placehold.co/800x600/cccccc/ffffff?text=Image+Not+Found'; this.onerror=null;">
                        </div>

                        <div class="recipe-ingredients">
                            <h2 class="section-title">Ingredients</h2>
                            <ul class="ingredient-list">
                                ${ingredients.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="recipe-directions">
                            <h2 class="section-title">Directions</h2>
                            <ol class="directions-list">
                                ${directions.map(item => `<li>${item}</li>`).join('')}
                            </ol>
                        </div>
                                
                        ${notes ? `
                        <div class="recipe-notes">
                            <h2 class="section-title">Notes</h2>
                            <div class="notes-content">${notes}</div>
                        </div>
                        ` : ''}

                    </div>
                </article>
            </div>
        `;
    }
}

// Define the custom element so the browser knows about <recipe-card>
customElements.define('recipe-card', RecipeCard);