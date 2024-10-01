function loadNavbar() {
    const basePath = window.location.origin;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${basePath}/navbar.html`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('navbar-placeholder').innerHTML = xhr.responseText;
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    document.querySelector('.navbar').classList.add('navbar-scrolled');
                } else {
                    document.querySelector('.navbar').classList.remove('navbar-scrolled');
                }
            });
        }
    };
    xhr.send();
}

function loadfooter() {
    const basePath = window.location.origin;
    const lfxhr = new XMLHttpRequest();
    lfxhr.open('GET', `${basePath}/footer.html`, true);
    lfxhr.onreadystatechange = function () {
        if (lfxhr.readyState === 4 && lfxhr.status === 200) {
            document.getElementById('footer-placeholder').innerHTML = lfxhr.responseText;
        }
    };
    lfxhr.send();
}

window.onload = function() {
    let path = window.location.pathname;
    let build = path.endsWith('build.html') || path.endsWith('ondevelopment');
    let map = path.endsWith('map.html');
    let addmod = path.endsWith('add_mod.html');

    if (build || map || addmod) {
        loadNavbar();
    } else {
        loadNavbar();
        loadfooter();
    }
};
