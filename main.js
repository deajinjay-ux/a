document.addEventListener('DOMContentLoaded', () => {
    
    // --- State ---
    let currentGender = 'male';

    // --- Theme Management ---
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');
    
    function toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcons(isDark);
    }

    function updateThemeIcons(isDark) {
        if (isDark) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        updateThemeIcons(true);
    }

    themeToggle.addEventListener('click', toggleTheme);

    // --- State & Config ---
    const config = {
        skin: { stops: ['skin-stop-1', 'skin-stop-2', 'skin-stop-3'], picker: 'skin-color-picker', optionsContainer: 'skin-options', palette: ['#F1C27D', '#FFDCB1', '#E0AC69', '#C68642', '#8D5524', '#5C3A1E'] },
        hair: { stops: ['hair-stop-1', 'hair-stop-2', 'hair-stop-3'], picker: 'hair-color-picker', optionsContainer: 'hair-options', palette: ['#2d3436', '#636e72', '#b2bec3', '#d63031', '#e17055', '#fdcb6e', '#6c5ce7', '#0984e3'] },
        shirt: { stops: ['shirt-stop-1', 'shirt-stop-2'], picker: 'shirt-color-picker', optionsContainer: 'shirt-options', palette: ['#4834d4', '#686de0', '#e056fd', '#be2edd', '#eb4d4b', '#f0932b', '#badc58', '#7ed6df', '#22a6b3'] },
        pants: { stops: ['pants-stop-1', 'pants-stop-2'], picker: 'pants-color-picker', optionsContainer: 'pants-options', palette: ['#636e72', '#2d3436', '#0984e3', '#74b9ff', '#a29bfe', '#dfe6e9', '#55efc4', '#00b894'] }
    };

    const hairStyles = {
        male: [
            { id: 1, name: '기본', icon: 'user' },
            { id: 2, name: '클래식', icon: 'star' },
            { id: 3, name: '스파이키', icon: 'zap' },
            { id: 4, name: '숏컷', icon: 'scissors' }
        ],
        female: [
            { id: 5, name: '긴 생머리', icon: 'arrow-down' },
            { id: 6, name: '포니테일', icon: 'frown' },
            { id: 7, name: '보브컷', icon: 'smile' },
            { id: 8, name: '양갈래', icon: 'heart' }
        ]
    };

    // --- Tab Switching ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(`${btn.dataset.tab}-content`);
            if (target) target.classList.add('active');
        });
    });

    // --- Gender Management ---
    function updateGender(gender) {
        currentGender = gender;
        const hairOptionsContainer = document.querySelector('.style-options[data-type="hair"]');
        hairOptionsContainer.innerHTML = '';
        
        hairStyles[gender].forEach((style, index) => {
            const btn = document.createElement('button');
            btn.className = `style-btn ${index === 0 ? 'active' : ''}`;
            btn.dataset.id = style.id;
            btn.innerHTML = `<i data-lucide="${style.icon}"></i> <span>${style.name}</span>`;
            btn.addEventListener('click', () => selectStyle('hair', style.id, btn));
            hairOptionsContainer.appendChild(btn);
        });
        
        lucide.createIcons();
        // Trigger first style selection
        selectStyle('hair', hairStyles[gender][0].id, hairOptionsContainer.firstChild);

        // Auto-select bottom style based on gender
        const bottomBtn = document.querySelector(`.style-options[data-type="bottom"] .style-btn[data-id="${gender === 'female' ? 'skirt' : 'pants'}"]`);
        if (bottomBtn) bottomBtn.click();
    }

    // --- Style Selection ---
    function selectStyle(type, id, btn) {
        if (btn) {
            btn.parentElement.querySelectorAll('.style-btn').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
        }

        const stylesGroup = document.getElementById(`${type}-styles`);
        if (stylesGroup) {
            Array.from(stylesGroup.children).forEach(child => {
                child.style.display = child.id === `${type}-style-${id}` ? 'block' : 'none';
            });
        }
    }

    document.querySelectorAll('.style-options').forEach(group => {
        const type = group.dataset.type;
        if (type === 'gender') {
            group.querySelectorAll('.style-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    group.querySelectorAll('.style-btn').forEach(s => s.classList.remove('active'));
                    btn.classList.add('active');
                    updateGender(btn.dataset.id);
                });
            });
        } else if (type !== 'hair') { // Hair is handled by gender update
            group.querySelectorAll('.style-btn').forEach(btn => {
                btn.addEventListener('click', () => selectStyle(type, btn.dataset.id, btn));
            });
        }
    });

    // --- Color Customization ---
    function shadeColor(color, percent) {
        let f = parseInt(color.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    function applyColor(partName, baseColor) {
        const partConfig = config[partName];
        if (!partConfig) return;
        const picker = document.getElementById(partConfig.picker);
        if (picker) picker.value = baseColor;

        if (partName === 'skin') {
            updateStop(partConfig.stops[0], baseColor);
            updateStop(partConfig.stops[1], shadeColor(baseColor, -0.1));
            updateStop(partConfig.stops[2], shadeColor(baseColor, -0.4));
        } else if (partName === 'hair') {
            updateStop(partConfig.stops[0], shadeColor(baseColor, -0.1));
            updateStop(partConfig.stops[1], shadeColor(baseColor, 0.2)); 
            updateStop(partConfig.stops[2], shadeColor(baseColor, -0.2));
        } else {
            updateStop(partConfig.stops[0], baseColor);
            updateStop(partConfig.stops[1], shadeColor(baseColor, -0.2));
        }
    }

    function updateStop(id, color) {
        const el = document.getElementById(id);
        if (el) el.setAttribute('stop-color', color);
    }

    Object.keys(config).forEach(part => {
        const conf = config[part];
        const container = document.getElementById(conf.optionsContainer);
        if (container) {
            container.innerHTML = '';
            conf.palette.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = color;
                swatch.addEventListener('click', () => {
                    applyColor(part, color);
                    container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                });
                container.appendChild(swatch);
            });
        }
        const picker = document.getElementById(conf.picker);
        if (picker) {
            picker.addEventListener('input', (e) => applyColor(part, e.target.value));
        }
    });

    // Randomize function
    document.querySelector('.btn-header.random').addEventListener('click', () => {
        // Randomize gender first
        const genders = ['male', 'female'];
        const randomGender = genders[Math.floor(Math.random() * genders.length)];
        const genderBtn = document.querySelector(`.style-options[data-type="gender"] .style-btn[data-id="${randomGender}"]`);
        if (genderBtn) genderBtn.click();

        ['eye', 'mouth', 'bottom'].forEach(type => {
            const options = document.querySelectorAll(`.style-options[data-type="${type}"] .style-btn`);
            if (options.length > 0) options[Math.floor(Math.random() * options.length)].click();
        });
        
        // Randomize hair for the new gender
        const hairOptions = document.querySelectorAll(`.style-options[data-type="hair"] .style-btn`);
        if (hairOptions.length > 0) hairOptions[Math.floor(Math.random() * hairOptions.length)].click();

        Object.keys(config).forEach(part => {
            const palette = config[part].palette;
            applyColor(part, palette[Math.floor(Math.random() * palette.length)]);
        });
    });

    // --- Fixed Downloads ---
    function triggerDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Improved SVG Download
    document.getElementById('download-svg-btn').addEventListener('click', () => {
        const svg = document.getElementById('avatar-svg').cloneNode(true);
        svg.setAttribute('width', '250');
        svg.setAttribute('height', '800');
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);
        if (!source.match(/^<\?xml/)) {
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        }
        const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        triggerDownload(url, "avatar.svg");
        setTimeout(() => URL.revokeObjectURL(url), 100);
    });

    // Improved PNG Download
    document.getElementById('download-png-btn').addEventListener('click', () => {
        const svg = document.getElementById('avatar-svg');
        const serializer = new XMLSerializer();
        const svgData = serializer.serializeToString(svg);
        const canvas = document.createElement('canvas');
        const scale = 4;
        canvas.width = 250 * scale;
        canvas.height = 800 * scale;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(svgBlob);
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngUrl = canvas.toDataURL("image/png");
            triggerDownload(pngUrl, "avatar.png");
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });

    // Initialize with default gender
    updateGender('male');

});
