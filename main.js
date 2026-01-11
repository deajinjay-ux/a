// DCOING - 오늘 뭐 먹지? - main.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const pickFoodButton = document.getElementById('pick-food-btn');

    // 테마 설정
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            theme = 'dark';
        } else {
            theme = 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // 음식 추천 기능 (기존 기능 유지)
    class FoodSuggestion extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
                <style>
                    .food-name {
                        font-size: 1.8rem;
                        font-weight: bold;
                        color: var(--primary-color, #333);
                        animation: fadeIn 0.5s ease-in-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                </style>
                <div class="food-name"></div>
            `;
            this.foodNameElement = this.shadowRoot.querySelector('.food-name');
        }

        setFood(foodName) {
            this.foodNameElement.textContent = foodName;
        }
    }
    customElements.define('food-suggestion', FoodSuggestion);


    const foodList = [
        '피자', '치킨', '햄버거', '떡볶이', '초밥', '파스타',
        '삼겹살', '김치찌개', '된장찌개', '부대찌개', '라면', '돈까스'
    ];

    pickFoodButton.addEventListener('click', () => {
        const foodSuggestionElement = document.querySelector('food-suggestion');
        const randomIndex = Math.floor(Math.random() * foodList.length);
        const randomFood = foodList[randomIndex];
        foodSuggestionElement.setFood(randomFood);
    });
});