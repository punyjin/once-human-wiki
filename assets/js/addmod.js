document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('json-form');
    const output = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');

    const gearTypes = {
        "Weapon": { "en": "Weapon", "th": "อาวุธ" },
        "Helmet": { "en": "Helmet", "th": "หมวก" },
        "Mask": { "en": "Mask", "th": "หน้ากาก" },
        "Top": { "en": "Top", "th": "เสื้อ" },
        "Gloves": { "en": "Gloves", "th": "ถุงมือ" },
        "Bottoms": { "en": "Bottoms", "th": "กางเกง" },
        "Shoes": { "en": "Shoes", "th": "รองเท้า" },
        "Gear": { "en": "Gear", "th": "อุปกรณ์" }
    };
    
    const modTypes = {
        "filters": {
            "burn": { "en": "Burn", "th": "เผาไหม้" },
            "fortex": { "en": "Frost Vortex", "th": "พายุวนแห่งน้ำแข็ง" },
            "surge": { "en": "Power Surge", "th": "พลังงานสายฟ้า" },
            "unstableBomber": { "en": "Unstable Bomber", "th": "การระเบิดที่ไม่เสถียร" },
            "warfare": { "en": "Fortress Warfare", "th": "สงครามป้อมปราการ" },
            "bullEye": { "en": "The Bull's Eye", "th": "เป้ากระทิง" },
            "fastgunner": { "en": "Fast Gunner", "th": "พลปืนเร็ว" },
            "bounce": { "en": "Bounce", "th": "การกระเด้ง" },
            "shrapnel": { "en": "Shrapnel", "th": "เศษกระสุน" },
            "HP": { "en": "HP", "th": "พลังชีวิต" },
            "critrate": { "en": "Crit Rate", "th": "อัตราคริติคอล" },
            "critdmg": { "en": "Crit DMG", "th": "ดาเมจคริติคอล" },
            "statusdmg": { "en": "Status DMG", "th": "ดาเมจสถานะ" },
            "def": { "en": "Defense", "th": "ป้องกัน" },
            "firerate": { "en": "Fire Rate", "th": "อัตรายิง" },
            "condition": { "en": "Condition", "th": "เงื่อนไข" },
            "weapondmg": { "en": "Weapon DMG", "th": "ดาเมจอาวุธ" },
            "elementdmg": { "en": "Elemental DMG", "th": "ดาเมจธาตุ" },
            "magazinecapacity": { "en": "Magazine Capacity", "th": "ความจุกระสุน" },
            "dmgreduce": { "en": "Damage Reduction", "th": "ลดความเสียหาย" },
            "weakspotdmg": { "en": "Weak Spot DMG", "th": "ความเสียหายต่อจุดอ่อน" },
            "meleedmg": { "en": "Melee DMG", "th": "ดาเมจอาวุธระยะประชิด" },
        }
    };

    const locations = [
        { en: "Weapon Crates", th: "กล่องอาวุธ" },
        { en: "Gear Crates", th: "กล่องอุปกรณ์" },
        //Boss
        { en: "Shadow Hound", th: "เงาพันธุ์หมา" },
        { en: "Ravenous Hunter", th: "นักล่ากระหาย" },
        { en: "Forsaken Giant", th: "ยักษ์ที่ถูกทอดทิ้ง" },
        { en: "Treant", th: "ต้นไม้ยักษ์" },
        { en: "Arachsiam", th:"อาราคสยาม" },
        { en: "LEA Lab", th: "ห้องทดลอง LEA" },
        //Silo
        { en: "Silo ALPHA", th: "ไซโล ALPHA" },
        { en: "Silo EX1", th: "ไซโล EX1" },
        { en: "Silo THETA", th: "ไซโล THETA" },
        { en: "Silo SIGMA", th: "ไซโล SIGMA" },
        { en: "Silo PSI", th: "ไซโล PSI" },
        { en: "Silo PHI", th: "ไซโล PHI" }
    ];

    const gearTypeSelect = document.getElementById('gearType');
    const modTypeSelect = document.getElementById('modType');
    const locationContainer = document.getElementById('location');

    // Default option for Gear Type
    const defaultGearOption = document.createElement('option');
    defaultGearOption.value = ''; // ไม่มีค่า
    defaultGearOption.text = '- None (ยังไม่ได้เลือก) -';
    defaultGearOption.selected = true; // ทำให้เป็นค่าเริ่มต้น
    gearTypeSelect.add(defaultGearOption);

    // Populate gearType options
    for (const key in gearTypes) {
        const option = document.createElement('option');
        option.value = key;
        option.text = `${gearTypes[key].en} (${gearTypes[key].th})`;
        gearTypeSelect.add(option);
    }

    // Default option for Mod Type
    const defaultModOption = document.createElement('option');
    defaultModOption.value = ''; // ไม่มีค่า
    defaultModOption.text = '- None (ยังไม่ได้เลือก) -';
    defaultModOption.selected = true; // ทำให้เป็นค่าเริ่มต้น
    modTypeSelect.add(defaultModOption);

    // Populate modType options
    for (const key in modTypes.filters) {
        const option = document.createElement('option');
        option.value = key;
        option.text = `${modTypes.filters[key].en} (${modTypes.filters[key].th})`;
        modTypeSelect.add(option);
    }

    // Generate checkboxes dynamically for locations
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
    
        // แปลงค่า gearType เป็น array
        const gearTypeSelected = {
            en: gearTypes[document.getElementById('gearType').value].en,
            th: gearTypes[document.getElementById('gearType').value].th
        };
    
        // แปลงค่า modType เป็น array
        const modTypeSelected = {
            en: modTypes.filters[document.getElementById('modType').value].en,
            th: modTypes.filters[document.getElementById('modType').value].th
        };
    
        // Get form data for name, gearType, modType, and stats
        const modData = {
            name: {
                en: document.getElementById('name-en').value,
                th: document.getElementById('name-th').value
            },
            gearType: gearTypeSelected, // ใช้ array ของ gearType
            modType: modTypeSelected, // ใช้ array ของ modType
            stats: {
                en: document.getElementById('stats-en').value,
                th: document.getElementById('stats-th').value
            },
            location: Array.from(document.querySelectorAll('#location input:checked')).map(cb => {
                const loc = locations.find(loc => loc.en === cb.value);
                return { en: loc.en, th: loc.th };
            }),
            imageUrl: imagedata
        };
    
        if (isDuplicate(modData)) {
            alert('This mod data already exists!');
            return;
        }
    
        modDataArray.push(modData);
    
        // Convert to JSON and display
        const jsonData = JSON.stringify(modDataArray, null, 4);
    
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
