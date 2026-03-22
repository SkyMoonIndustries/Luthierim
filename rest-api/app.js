const express = require('express');
const app = express();

app.use(express.json()); // JSON verilerini okuyabilmek için

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});