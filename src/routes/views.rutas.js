const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home',  { 
        layout: 'main',
        title: 'home | Productos normales'
    });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        layout: 'main',
        title: 'Productos en Tiempo Real'
    });
});

module.exports = router;