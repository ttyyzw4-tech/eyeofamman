const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// قاعدة البيانات للأرقام
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

app.get('/api/search', (req, res) => {
  const country = req.query.country;
  const query = req.query.query;

  if (!country || !globalDatabase[country]) {
    return res.status(400).json({ error: "اختر دولة صحيحة (oman أو saudi)" });
  }

  const results = globalDatabase[country].filter(item => 
    item.name.includes(query) || item.phone.includes(query)
  );

  res.json(results);
});

// الصفحة الرئيسية لتجربة الموقع
app.get('/', (req, res) => {
  res.send('مرحباً بك في نظام البحث السريع - عين عمان يعمل بنجاح!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
