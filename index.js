const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const globalDatabase = {
  "oman": [
    { name: "محمد سعيد الغافري", phone: "96891111111" },
    { name: "راشد راشد المعمري", phone: "96892222222" },
    { name: "فهد العجمي", phone: "96893333333" }
  ],
  "saudi": [
    { name: "محمد عبد الله القحطاني", phone: "96650111111" },
    { name: "سعد فهد الدوسري", phone: "96650222222" }
  ]
};

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>عين عمان - بحث واتساب</title>
        <style>
            body { font-family: sans-serif; background: #f0f2f5; padding: 20px; text-align: center; }
            .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: auto; }
            input, select { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
            .res-card { background: #fff; padding: 15px; margin: 10px 0; border: 1px solid #eee; border-radius: 10px; text-align: right; }
            .btns { display: flex; gap: 10px; margin-top: 10px; }
            button { flex: 1; padding: 8px; border: none; border-radius: 5px; cursor: pointer; color: white; }
            .btn-wa { background: #25d366; }
            .btn-copy { background: #007bff; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>بحث عين عمان</h2>
            <select id="country" onchange="search()">
                <option value="oman">سلطنة عمان</option>
                <option value="saudi">السعودية</option>
            </select>
            <input type="text" id="query" placeholder="ابحث بالاسم..." oninput="search()">
            <div id="results"></div>
        </div>

        <script>
            async function search() {
                const country = document.getElementById('country').value;
                const query = document.getElementById('query').value;
                const res = await fetch(\`/api/search?country=\${country}&query=\${query}\`);
                const data = await res.json();
                const container = document.getElementById('results');
                container.innerHTML = '';
                data.forEach(item => {
                    container.innerHTML += \`
                        <div class="res-card">
                            <strong>\${item.name}</strong><br>
                            <small>\${item.phone}</small>
                            <div class="btns">
                                <button class="btn-wa" onclick="window.open('https://wa.me/\${item.phone}')">واتساب</button>
                                <button class="btn-copy" onclick="copyPhone('\${item.phone}')">نسخ</button>
                            </div>
                        </div>\`;
                });
            }
            function copyPhone(phone) {
                navigator.clipboard.writeText(phone);
                alert('تم نسخ الرقم: ' + phone);
            }
            search();
        </script>
    </body>
    </html>
  `);
});

app.get('/api/search', (req, res) => {
  const { country, query } = req.query;
  const list = globalDatabase[country] || [];
  res.json(list.filter(i => i.name.includes(query || '')));
});

app.listen(port);
