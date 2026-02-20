
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration ---
    const config = {
        skin: {
            stops: ['skin-stop-1', 'skin-stop-2', 'skin-stop-3'],
            picker: 'skin-color-picker',
            optionsContainer: 'skin-options',
            // Base colors to generate swatches from
            palette: ['#F1C27D', '#FFDCB1', '#E0AC69', '#C68642', '#8D5524', '#5C3A1E']
        },
        hair: {
            stops: ['hair-stop-1', 'hair-stop-2', 'hair-stop-3'],
            picker: 'hair-color-picker',
            optionsContainer: 'hair-options',
            palette: ['#2d3436', '#636e72', '#b2bec3', '#d63031', '#e17055', '#fdcb6e', '#ffeaa7', '#6c5ce7', '#0984e3']
        },
        shirt: {
            stops: ['shirt-stop-1', 'shirt-stop-2'], // Linear gradient top-down
            picker: 'shirt-color-picker',
            optionsContainer: 'shirt-options',
            palette: ['#4834d4', '#686de0', '#e056fd', '#be2edd', '#eb4d4b', '#f0932b', '#badc58', '#7ed6df', '#22a6b3']
        },
        pants: {
            stops: ['pants-stop-1', 'pants-stop-2'],
            picker: 'pants-color-picker',
            optionsContainer: 'pants-options',
            palette: ['#636e72', '#2d3436', '#0984e3', '#74b9ff', '#a29bfe', '#dfe6e9', '#55efc4', '#00b894']
        },
        shoes: {
            stops: ['shoe-stop-1', 'shoe-stop-2'],
            picker: 'shoe-color-picker',
            optionsContainer: 'shoe-options',
            palette: ['#000000', '#ffffff', '#d63031', '#0984e3', '#fdcb6e']
        }
    };

    // --- Helper Functions ---

    // Convert Hex to RGB
    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Convert RGB to Hex
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Adjust brightness of a color (percent: -1.0 to 1.0)
    function shadeColor(color, percent) {
        let f = parseInt(color.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = f >> 8 & 0x00FF,
            B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    // Apply color to a specific part
    function applyColor(partName, baseColor) {
        const partConfig = config[partName];
        if (!partConfig) return;

        // Update Picker UI
        const picker = document.getElementById(partConfig.picker);
        if (picker && picker.value !== baseColor) {
            picker.value = baseColor;
        }

        // Logic for gradients
        if (partName === 'skin') {
            // Radial: Light -> Medium -> Dark
            updateStop(partConfig.stops[0], baseColor);
            updateStop(partConfig.stops[1], shadeColor(baseColor, -0.1));
            updateStop(partConfig.stops[2], shadeColor(baseColor, -0.4));
        } else if (partName === 'hair') {
            // Linear Horizontal: Dark -> Light -> Dark (Volume)
            updateStop(partConfig.stops[0], shadeColor(baseColor, -0.1));
            updateStop(partConfig.stops[1], shadeColor(baseColor, 0.2)); 
            updateStop(partConfig.stops[2], shadeColor(baseColor, -0.2));
        } else if (partName === 'shirt' || partName === 'pants') {
            // Linear Vertical: Light -> Dark (Top to Bottom)
            updateStop(partConfig.stops[0], baseColor);
            updateStop(partConfig.stops[1], shadeColor(baseColor, -0.2));
        } else if (partName === 'shoes') {
            // Linear Horizontal: Dark -> Light
             updateStop(partConfig.stops[0], baseColor);
             updateStop(partConfig.stops[1], shadeColor(baseColor, 0.3));
        }
    }

    function updateStop(id, color) {
        const el = document.getElementById(id);
        if (el) el.setAttribute('stop-color', color);
    }

    // Initialize UI
    Object.keys(config).forEach(part => {
        const conf = config[part];
        const container = document.getElementById(conf.optionsContainer);
        
        // Create Swatches
        conf.palette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.addEventListener('click', () => {
                applyColor(part, color);
                // Highlight active
                container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
            container.appendChild(swatch);
        });

        // Bind Color Picker
        const picker = document.getElementById(conf.picker);
        picker.addEventListener('input', (e) => {
            applyColor(part, e.target.value);
            container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        });
    });


    // --- Download Functionality ---

    document.getElementById('download-svg-btn').addEventListener('click', () => {
        const svgData = document.getElementById('avatar-svg').outerHTML;
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "avatar.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById('download-png-btn').addEventListener('click', () => {
        const svg = document.getElementById('avatar-svg');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get SVG data
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        
        // Define canvas size (high res)
        canvas.width = 1000;
        canvas.height = 3200; // Aspect ratio of 250:800

        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            ctx.fillStyle = "transparent"; // or white if preferred
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = "avatar.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });

});
