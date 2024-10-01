function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", function() {
    // ดึงค่าพารามิเตอร์ "news" จาก URL
    const newsFile = getQueryParam('news');

    if (newsFile) {
        // ถ้ามีพารามิเตอร์ news, ทำการโหลดไฟล์ข่าวนั้น
        fetch('news/' + newsFile)
            .then(response => response.text())
            .then(data => {
                document.getElementById('news-content').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading the HTML file:', error);
                document.getElementById('news-content').innerHTML = '<p>ไม่สามารถโหลดข้อมูลที่ต้องการได้.</p>';
            });
    } else {
        // ถ้าไม่มีพารามิเตอร์ news, แสดงข้อความ
        document.getElementById('news-content').innerHTML = '<p>ไม่พบข้อมูลที่ร้องขอมาในขณะนี้.</p>';
    }
});