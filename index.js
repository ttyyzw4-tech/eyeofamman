const express = require('express');
const app = express();
app.use(express.json());

const globalDatabase = {
  "oman": [
    { name: 'محمد سعيد الهنائي', phone: '+96891111111' },
    { name: 'سعد راشد المعمري', phone: '+96892222222' },
    { name: 'محمد علي البلوشي', phone: '+96893333333' }
  ],
  "saudi": [
    { name: 'محمد عبد الله القحطاني', phone: '+966501111111' },
    { name: 'سعد فهد الدوسري', phone: '+966502222222' }
  ]
};

app.get('/api/search', (req, res) => {
  const country = req.query.country;
  const query = req.query.query ? req.query.query.toLowerCase() : '';

  if (!country || !globalDatabase[country]) {
    return res.status(400).json({ error: 'الرجاء اختيار دولة صحيحة (oman, saudi)' });
  }

  const contacts = globalDatabase[country];

  const results = contacts.filter(contact => {
    const nameMatch = contact.name.toLowerCase().includes(query);
    const phoneMatch = contact.phone.includes(query);
    return nameMatch || phoneMatch;
  });

  const formattedResults = results.map(contact => ({
    name: contact.name,
    phone: contact.phone,
    whatsappLink: `https://wa.me/${contact.phone.replace('+', '')}`
  }));

  res.json({
    totalResults: formattedResults.length,
    country: country,
    data: formattedResults
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`سيرفر البحث العميق يعمل بنجاح على المنفذ ${PORT}`);
});
