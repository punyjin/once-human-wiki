
fetch('../assets/json_data/news.json')
    .then(response => response.json())
    .then(data => {
        const newsTableBody = document.querySelector('#news-table tbody');
        
        data.news.forEach(item => {
            // สร้างแถวใหม่ในตารางสำหรับข่าวแต่ละรายการ
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <label class="badge bg-success text-light">อัปเดต</label>
                    <a href="news.html?news=${item.file}" target="_self">[${item.date}] ${item.title}</a>
                </td>
                <td class="text-end text-danger">*</td>
            `;
            
            newsTableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading the news:', error));
