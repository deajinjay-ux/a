document.addEventListener('DOMContentLoaded', () => {
    
    // --- State & Config ---
    const config = {
        skin: { stops: ['skin-stop-1', 'skin-stop-2', 'skin-stop-3'], picker: 'skin-color-picker', optionsContainer: 'skin-options', palette: ['#F1C27D', '#FFDCB1', '#E0AC69', '#C68642', '#8D5524', '#5C3A1E'] },
        hair: { stops: ['hair-stop-1', 'hair-stop-2', 'hair-stop-3'], picker: 'hair-color-picker', optionsContainer: 'hair-options', palette: ['#2d3436', '#636e72', '#b2bec3', '#d63031', '#e17055', '#fdcb6e', '#6c5ce7', '#0984e3'] },
        shirt: { stops: ['shirt-stop-1', 'shirt-stop-2'], picker: 'shirt-color-picker', optionsContainer: 'shirt-options', palette: ['#4834d4', '#686de0', '#e056fd', '#be2edd', '#eb4d4b', '#f0932b', '#badc58', '#7ed6df', '#22a6b3'] },
        pants: { stops: ['pants-stop-1', 'pants-stop-2'], picker: 'pants-color-picker', optionsContainer: 'pants-options', palette: ['#636e72', '#2d3436', '#0984e3', '#74b9ff', '#a29bfe', '#dfe6e9', '#55efc4', '#00b894'] }
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

    // --- Style Selection ---
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.parentElement.dataset.type;
            const id = btn.dataset.id;
            
            btn.parentElement.querySelectorAll('.style-btn').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');

            const stylesGroup = document.getElementById(`${type}-styles`);
            if (stylesGroup) {
                Array.from(stylesGroup.children).forEach(child => {
                    child.style.display = child.id === `${type}-style-${id}` ? 'block' : 'none';
                });
            }
        });
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
            // Clear existing swatches if any
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

    // --- Fixed Downloads ---
    function triggerDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.getElementById('download-svg-btn').addEventListener('click', () => {
        const svg = document.getElementById('avatar-svg');
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);

        // Ensure namespace
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+xmlns\:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        triggerDownload(url, "avatar.svg");
        setTimeout(() => URL.revokeObjectURL(url), 100);
    });

    document.getElementById('download-png-btn').addEventListener('click', () => {
        const svg = document.getElementById('avatar-svg');
        const serializer = new XMLSerializer();
        const svgData = serializer.serializeToString(svg);
        const img = new Image();
        
        // High quality scale
        const scale = 4;
        const width = 250 * scale;
        const height = 800 * scale;

        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            const pngUrl = canvas.toDataURL("image/png");
            triggerDownload(pngUrl, "avatar.png");
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });

});
