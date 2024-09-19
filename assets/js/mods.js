// Path to the JSON file
const jsonDataUrl = 'assets/json_data/mods.json';
const mainDataUrl = 'assets/json_data/filter.json';

// Global variable for mods data
let mods = [];

// Fetch JSON data and initialize filter
fetch(jsonDataUrl)
    .then(response => response.json())
    .then(data => {
        mods = data; // Store mods data globally
        populateTable(data, 'th'); // Load Thai Language by default

        // Load filter options from main.json
        loadFilterOptions('en', 'th'); // Load both English and Thai filter options

        // Add event listeners for search and filter
        const searchInput = document.getElementById('search-input');
        const filterSelect = document.getElementById('filter-select'); // modType select
        const gearTypeSelect = document.getElementById('gear-type-filter'); // gearType select

        // Add event listener to search input
        if (searchInput) {
            searchInput.addEventListener('input', () => applyFilters());
        } else {
            console.error('Search input element not found.');
        }

        // Add event listener to filter select (modType)
        if (filterSelect) {
            filterSelect.addEventListener('change', () => applyFilters());
        } else {
            console.error('Filter select element not found.');
        }

        // Add event listener to gear type select (gearType)
        if (gearTypeSelect) {
            gearTypeSelect.addEventListener('change', () => applyFilters());
        } else {
            console.error('Gear type filter select element not found.');
        }
    })
    .catch(error => console.error('Error loading JSON:', error));

// ฟังก์ชันสำหรับแปลง gearType ระหว่างภาษาไทยและอังกฤษ
function translateGearType(gearType) {
    const gearTypeTranslations = {
        "Weapon": "อาวุธ",
        "Helmet": "หมวกนิรภัย",
        "Mask": "หน้ากาก",
        "Top": "เสื้อ",
        "Bottom": "กางเกง",
        "Gloves": "ถุงมือ",
        "Shoes": "รองเท้า"
    };
    return gearTypeTranslations[gearType] || Object.keys(gearTypeTranslations).find(key => gearTypeTranslations[key] === gearType);
}
// ฟังก์ชันสำหรับแปลง modType ระหว่างภาษาไทยและอังกฤษ
function translateModType(modType) {
    const filterTranslations = {
        "all": "ทั้งหมด",
        "burn": "การเผาไหม้",
        "fortex": "พายุวนแห่งน้ำแข็ง",
        "surge": "พลังงานสายฟ้า",
        "unstableBomber": "การระเบิดที่ไม่เสถียร",
        "warfare": "สงครามป้อมปราการ",
        "bullEye": "เป้ากระทิง",
        "fastgunner": "พลปืนเร็ว",
        "bounce": "การกระเด้ง",
        "shrapnel": "เศษกระสุน",
        "HP": "พลังชีวิต",
        "critrate": "อัตราคริติคอล",
        "critdmg": "ดาเมจคริติคอล",
        "statusdmg": "ดาเมจสถานะ",
        "def": "ป้องกัน",
        "firerate": "อัตรายิง",
        "condition": "เงื่อนไข",
        "weapondmg": "ดาเมจอาวุธ",
        "elementdmg": "ดาเมจธาตุ",
        "magazinecapacity": "ความจุกระสุน",
        "dmgreduce": "ลดความเสียหาย",
        "weakspotdmg": "ความเสียหายต่อจุดอ่อน",
        "meleedmg": "ดาเมจอาวุธระยะประชิด"
    };
    return filterTranslations[modType] || Object.keys(filterTranslations).find(key => filterTranslations[key] === modType);
}

// Function to apply search and filters
function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('filter-select')?.value || 'all';
    const gearTypeValue = document.getElementById('gear-type-filter')?.value || 'all';

    if (!mods) {
        console.error('Mods data is not loaded.');
        return;
    }

    const translatedFilterValue = translateModType(filterValue);
    const translatedGearTypeValue = translateGearType(gearTypeValue);

    const filteredMods = mods.filter(mod => {
        const matchesSearch = mod.name.th.toLowerCase().includes(searchTerm) || mod.name.en.toLowerCase().includes(searchTerm);
        
        const matchesFilter = filterValue === 'all' ||
            mod.modType.en.toLowerCase() === filterValue.toLowerCase() ||
            mod.modType.th.toLowerCase() === filterValue.toLowerCase() ||
            mod.modType.en.toLowerCase() === translatedFilterValue.toLowerCase() ||
            mod.modType.th.toLowerCase() === translatedFilterValue.toLowerCase();
        
        const matchesGearType = gearTypeValue === 'all' ||
            mod.gearType.en.toLowerCase() === gearTypeValue.toLowerCase() ||
            mod.gearType.th.toLowerCase() === gearTypeValue.toLowerCase() ||
            mod.gearType.en.toLowerCase() === translatedGearTypeValue.toLowerCase() ||
            mod.gearType.th.toLowerCase() === translatedGearTypeValue.toLowerCase();
        
        return matchesSearch && matchesFilter && matchesGearType;
    });
    populateTable(filteredMods, 'th'); 
}





function populateTable(mods, lang) {
    const tableBody = document.querySelector('#mods-table tbody');
    if (!tableBody) {
        console.error('Table body element not found.');
        return;
    }
    
    tableBody.innerHTML = ''; // Clear table body

    mods.forEach(mod => {
        const row = document.createElement('tr');

        // Image column
        const imageCell = document.createElement('td');
        const imgElement = document.createElement('img');
        imgElement.src = mod.imageUrl;
        imgElement.alt = mod.name[lang];
        imgElement.style.width = '60px';
        imgElement.style.height = '60px';
        imgElement.style.objectFit = 'cover';
        imageCell.appendChild(imgElement);
        row.appendChild(imageCell);

        // Name column
        const nameCell = document.createElement('td');
        nameCell.textContent = `${mod.name.th} (${mod.name.en})`;
        row.appendChild(nameCell);

        // Stats column
        const statsCell = document.createElement('td');
        statsCell.textContent = mod.stats[lang];
        statsCell.classList.add('stats');
        row.appendChild(statsCell);

        // Gear Type column
        const gearTypeCell = document.createElement('td');
        gearTypeCell.textContent = mod.gearType[lang];
        gearTypeCell.classList.add('gear-type');
        row.appendChild(gearTypeCell);

        // Mod Type column
        const modTypeCell = document.createElement('td');
        modTypeCell.textContent = `${mod.modType.th} (${mod.modType.en})`;
        modTypeCell.classList.add('mod-type');
        row.appendChild(modTypeCell);

        // Location column
        const locationCell = document.createElement('td');
        locationCell.classList.add('location');
        mod.location.forEach(loc => {
            const locElement = document.createElement('div');
            
            const linkElement = document.createElement('a');
            // linkElement.href = `#${loc['en']}`; 
            linkElement.textContent = `• ${loc['en']}`;
            
            locElement.appendChild(linkElement);
            locationCell.appendChild(locElement);
        });
        row.appendChild(locationCell);

        // Append row to the table body
        tableBody.appendChild(row);
    });
}

function loadFilterOptions(lang1, lang2) {
    fetch(mainDataUrl)
        .then(response => response.json())
        .then(data => {
            const filters = data.filters;
            const filterSelect = document.getElementById('filter-select');
            const gearTypeFilterSelect = document.getElementById('gear-type-filter');

            // Clear existing options
            filterSelect.innerHTML = '';
            gearTypeFilterSelect.innerHTML = '';

            // Add "All" option first
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = `- ${filters.all[lang1]} (${filters.all[lang2]}) -`;
            filterSelect.appendChild(allOption);

            const allGearTypeOption = document.createElement('option');
            allGearTypeOption.value = 'all';
            allGearTypeOption.textContent = `- ${filters.all[lang1]} (${filters.all[lang2]}) -`;
            gearTypeFilterSelect.appendChild(allGearTypeOption);

            // Add modType filter options
            for (const [key, value] of Object.entries(filters)) {
                if (key !== 'all' && key !== 'geartypes') {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = `${value[lang1]} (${value[lang2]})`;
                    filterSelect.appendChild(option);
                }
            }

            // Add gearType filter options
            const gearTypes = filters.geartypes;
            for (const [key, value] of Object.entries(gearTypes)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${value[lang1]} (${value[lang2]})`;
                gearTypeFilterSelect.appendChild(option);
            }
        })
        .catch(error => console.error('Error loading filter options:', error));
}