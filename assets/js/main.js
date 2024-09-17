document.addEventListener('DOMContentLoaded', function() {
    const jsonDataUrl = 'assets/json_data/main.json'; // Path to your language JSON

    // Load navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            setupLanguageSwitcher(); // Setup language switcher after loading navbar
            loadSavedLanguage(); // Load saved language setting
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Setup language switcher
    function setupLanguageSwitcher() {
        document.querySelectorAll('[data-lang]').forEach(element => {
            element.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                switchLanguage(selectedLang);
            });
        });
    }

    // Function to switch language
    function switchLanguage(lang) {
        // Fetch the JSON data for languages
        fetch(jsonDataUrl)
            .then(response => response.json())
            .then(data => {
                const langData = data[lang];
                updateLanguage(langData);
                // Save the selected language to localStorage
                localStorage.setItem('selectedLanguage', lang);
            })
            .catch(error => console.error('Error loading JSON:', error));
    }

    // Function to update page content based on the selected language
    function updateLanguage(langData) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });
    }

    // Function to load the saved language from localStorage
    function loadSavedLanguage() {
        const savedLang = localStorage.getItem('selectedLanguage') || 'th'; // Default to 'en' if no language is saved
        switchLanguage(savedLang); // Apply the saved language
    }
});
