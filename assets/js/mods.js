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
        const filterSelect = document.getElementById('filter-select');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => applyFilters());
        } else {
            console.error('Search input element not found.');
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', () => applyFilters());
        } else {
            console.error('Filter select element not found.');
        }
    })
    .catch(error => console.error('Error loading JSON:', error));

// ฟังก์ชันสำหรับแปลง modType ระหว่างภาษาไทยและอังกฤษ
function translateModType(modType) {
    const filterTranslations = {
        "all": "ทั้งหมด",
        "burn": "เผาไหม้",
        "fortex": "ฟอร์เท็กซ์",
        "surge": "เซิร์จ",
        "unstableBomber": "บอมเบอร์ไม่เสถียร",
        "warfare": "สงคราม",
        "bullEye": "บูลอาย",
        "fastgunner": "ฟาสต์กันเนอร์",
        "bounce": "บาวน์ซ",
        "shrapnel": "เศษระเบิด"
    };
    return filterTranslations[modType] || Object.keys(filterTranslations).find(key => filterTranslations[key] === modType);
}

// Function to apply search and filters
function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('filter-select')?.value || 'all';

    if (!mods) {
        console.error('Mods data is not loaded.');
        return;
    }

    const translatedFilterValue = translateModType(filterValue);

    const filteredMods = mods.filter(mod => {
        const matchesSearch = mod.name.th.toLowerCase().includes(searchTerm) || mod.name.en.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' || mod.modType === filterValue || mod.modType === translatedFilterValue;
        return matchesSearch && matchesFilter;
    });

    populateTable(filteredMods, 'th'); 
}

// Function to populate table based on the data
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
        modTypeCell.textContent = mod.modType[lang];
        modTypeCell.classList.add('mod-type');
        row.appendChild(modTypeCell);

        // Location column
        const locationCell = document.createElement('td');
        locationCell.classList.add('location');
        mod.location.forEach(loc => {
            const locElement = document.createElement('div');
            locElement.textContent = loc[lang];
            locationCell.appendChild(locElement);
        });
        row.appendChild(locationCell);

        // Append row to the table body
        tableBody.appendChild(row);
    });
}

// Function to load filter options in both languages
function loadFilterOptions(lang1, lang2) {
    fetch(mainDataUrl)
        .then(response => response.json())
        .then(data => {
            const filters = data.filters;
            const filterSelect = document.getElementById('filter-select');
            
            // Clear existing options
            filterSelect.innerHTML = '';

            // Add "All" option first
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = `${filters.all[lang1]} (${filters.all[lang2]})`;
            filterSelect.appendChild(allOption);

            // Add other filter options
            for (const [key, value] of Object.entries(filters)) {
                if (key !== 'all') {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = `${value[lang1]} (${value[lang2]})`;
                    filterSelect.appendChild(option);
                }
            }
        })
        .catch(error => console.error('Error loading filter options:', error));
}
