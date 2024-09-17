document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('json-form');
    const output = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Generate checkboxes dynamically
    const locations = [
        { en: "Weapon Crates", th: "กล่องอาวุธ" },
        { en: "Shadow Hound", th: "เงาพันธุ์หมา" },
        { en: "Ravenous Hunter", th: "นักล่ากระหาย" },
        { en: "Forsaken Giant", th: "ยักษ์ที่ถูกทอดทิ้ง" },
        { en: "Treant", th: "ต้นไม้ยักษ์" },
        { en: "LEA Lab", th: "ห้องทดลอง LEA" },
        { en: "Gear Crates", th: "กล่องอุปกรณ์" },
        { en: "Silo ALPHA", th: "ซิโล ALPHA" },
        { en: "Silo EX1", th: "ซิโล EX1" },
        { en: "Silo THETA", th: "ซิโล THETA" },
        { en: "Silo SIGMA", th: "ซิโล SIGMA" },
        { en: "Silo PSI", th: "ซิโล PSI" },
        { en: "Silo PHI", th: "ซิโล PHI" }
    ];

    const locationContainer = document.getElementById('location');

    locations.forEach(loc => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = loc.en;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${loc.en} (${loc.th})`));
        locationContainer.appendChild(label);
    });

    let modDataArray = [];

    function isDuplicate(newModData) {
        return modDataArray.some(modData => {
            // Check if either name.en, name.th, or imageUrl match
            const isNameMatch = modData.name.en === newModData.name.en &&
                                modData.name.th === newModData.name.th;
            const isImageUrlMatch = modData.imageUrl === newModData.imageUrl;
    
            return isNameMatch || isImageUrlMatch;
        });
    }
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let imgurl = document.getElementById('imageUrl').value;
        let imagedata = "assets/imgs/mods/" + imgurl + ".png";
        // Get form data
        const modData = {
            name: {
                en: document.getElementById('name-en').value,
                th: document.getElementById('name-th').value
            },
            gearType: document.getElementById('gearType').value,
            modType: document.getElementById('modType').value,
            stats: {
                en: document.getElementById('stats-en').value,
                th: document.getElementById('stats-th').value
            },
            location: Array.from(document.querySelectorAll('#location input:checked')).map(cb => cb.value),
            imageUrl: imagedata
        };
        
        if (isDuplicate(modData)) {
            alert('This mod data already exists!');
            return;
        }
        
        modDataArray.push(modData);

        // Convert to JSON
        const jsonData = JSON.stringify(modDataArray, null, 4);

        // Clear the output and display updated JSON
        if (output) {
            output.innerHTML = ''; // Clear existing content
            const pre = document.createElement('pre');
            pre.textContent = jsonData;
            output.appendChild(pre);
        } else {
            console.error('Output container not found');
        }
    });

    // Handle Copy Button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = output.textContent;
            if (text) {
                navigator.clipboard.writeText(text)
                    .then(() => alert('Copied to clipboard!'))
                    .catch(err => alert('Failed to copy!'));
            } else {
                alert('No data to copy!');
            }
        });
    }

    // Handle Clear Button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (output) {
                output.innerHTML = ''; // Clear existing content
            } else {
                console.error('Output container not found');
            }
        });
    }

    // Handle Download Button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const jsonData = output.textContent;
            if (jsonData) {
                const blob = new Blob([jsonData], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'mod.json';
                a.click();
                URL.revokeObjectURL(url); // Clean up
            } else {
                alert('No data to download!');
            }
        });
    }
});
