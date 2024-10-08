const router = require('express').Router();
const tahananController = require('../controllers/tahananController');

router.get('/', tahananController.index);
router.get('/narkotika', tahananController.indexNarkotika);
router.get('/oharda', tahananController.indexOharda);
router.get('/kamtibum', tahananController.indexKamtibum);
router.get('/tambah', tahananController.tambah);
router.post('/add', tahananController.addTahanan, tahananController.add);
router.post('/edit',tahananController.addTahanan, tahananController.update);
router.get('/detail/:id',tahananController.detail);
router.get('/edit/:id',tahananController.edit);
router.get('/delete/:id',tahananController.delete);
router.get('/cetak', (req, res) => {
    console.log('Route accessed');
    tahananController.cetakLaporanTahanan(req, res);
});
router.get('/cetak/narkotika', (req, res) => {
    console.log('Route accessed');
    tahananController.cetakLaporanTahananNarkotika(req, res);
});
router.get('/cetak/oharda', (req, res) => {
    console.log('Route accessed');
    tahananController.cetakLaporanTahananOharda(req, res);
});
router.get('/cetak/kamtibum', (req, res) => {
    console.log('Route accessed');
    tahananController.cetakLaporanTahananKamtibum(req, res);
});

router.get('/cetak/:id', (req, res) => {
    console.log('Route accessed');
    tahananController.cetakPDFTahanan(req, res);
});

router.get('/download-excel',tahananController.downloadExcel);
router.get('/download-CSV',tahananController.downloadCSV);
router.get('/api-data',tahananController.apiData);

router.get('/jumlah-tahanan', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS jumlah FROM tahanan');
        res.json({ jumlah: rows[0].jumlah });
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;