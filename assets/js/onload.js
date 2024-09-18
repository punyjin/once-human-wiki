function loadNavbar() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'navbar.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('navbar-placeholder').innerHTML = xhr.responseText;
            // เพิ่มการตรวจสอบการเลื่อนหน้า
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) { // เปลี่ยน 50 เป็นความสูงที่คุณต้องการ
                    document.querySelector('.navbar').classList.add('navbar-scrolled');
                } else {
                    document.querySelector('.navbar').classList.remove('navbar-scrolled');
                }
            });
        }
    };
    xhr.send();
}

window.onload = loadNavbar;
