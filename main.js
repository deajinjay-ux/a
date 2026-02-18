// DCOING - 오늘 뭐 먹지? - main.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const langToggleButton = document.getElementById('lang-toggle-btn');
    const pickFoodButton = document.getElementById('pick-food-btn');
    const appTitle = document.getElementById('app-title');
    const appDescription = document.getElementById('app-description');

    const translations = {
        ko: {
            title: '오늘 뭐 먹지?',
            description: '버튼을 눌러 메뉴를 추천받으세요!',
            pickBtn: '메뉴 추천받기',
            darkTheme: '🌙 다크 모드',
            lightTheme: '☀️ 라이트 모드',
            foodList: ['피자', '치킨', '햄버거', '떡볶이', '초밥', '파스타', '삼겹살', '김치찌개', '된장찌개', '부대찌개', '라면', '돈까스']
        },
        en: {
            title: "What's for Today?",
            description: 'Click the button to get a menu recommendation!',
            pickBtn: 'Get Recommendation',
            darkTheme: '🌙 Dark Mode',
            lightTheme: '☀️ Light Mode',
            foodList: ['Pizza', 'Chicken', 'Burger', 'Tteokbokki', 'Sushi', 'Pasta', 'Pork Belly', 'Kimchi Stew', 'Soybean Stew', 'Budae Jjigae', 'Ramen', 'Cutlet']
        }
    };

    let currentLang = localStorage.getItem('lang') || 'ko';

    const updateUI = () => {
        const t = translations[currentLang];
        appTitle.textContent = t.title;
        appDescription.textContent = t.description;
        pickFoodButton.textContent = t.pickBtn;
        
        const theme = document.documentElement.getAttribute('data-theme');
        themeToggleButton.textContent = theme === 'dark' ? t.lightTheme : t.darkTheme;
        langToggleButton.textContent = currentLang === 'ko' ? 'English' : '한국어';
    };

    // 테마 설정
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        theme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateUI();
    });

    // 언어 설정
    langToggleButton.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        localStorage.setItem('lang', currentLang);
        updateUI();
        // Clear previous suggestion on lang change to avoid mix-up
        const foodSuggestionElement = document.querySelector('food-suggestion');
        if (foodSuggestionElement) foodSuggestionElement.setFood('');
    });

    // 음식 추천 기능
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
    
    if (!customElements.get('food-suggestion')) {
        customElements.define('food-suggestion', FoodSuggestion);
    }

    pickFoodButton.addEventListener('click', () => {
        const foodSuggestionElement = document.querySelector('food-suggestion');
        const list = translations[currentLang].foodList;
        const randomIndex = Math.floor(Math.random() * list.length);
        const randomFood = list[randomIndex];
        foodSuggestionElement.setFood(randomFood);
    });

    updateUI();
});