const router = require('express').Router();
const pengajuanController = require('../controllers/pengajuanController');

router.get('/', pengajuanController.index);
router.get('/admin', pengajuanController.indexAdmin);
router.get('/admin/belum-diproses', pengajuanController.indexAdminBelum);
router.get('/admin/diterima', pengajuanController.indexAdminTerima);
router.get('/admin/ditolak', pengajuanController.indexAdminTolak);
router.post('/add',pengajuanController.addFoto, pengajuanController.add);
router.post('/edit',pengajuanController.addFoto, pengajuanController.update);
router.post('/edit/admin',pengajuanController.addFoto, pengajuanController.updateAdmin);
router.get('/detail/:id',pengajuanController.detail);
router.get('/edit/:id',pengajuanController.edit);
router.get('/delete/:id',pengajuanController.delete);

router.get('/cetak', (req, res) => {
    console.log('Route accessed');
    pengajuanController.cetakLaporanPengajuan(req, res);
});
router.get('/belum/cetak', (req, res) => {
    console.log('Route accessed');
    pengajuanController.cetakLaporanPengajuanBelum(req, res);
});
router.get('/terima/cetak', (req, res) => {
    console.log('Route accessed');
    pengajuanController.cetakLaporanPengajuanTerima(req, res);
});
router.get('/tolak/cetak', (req, res) => {
    console.log('Route accessed');
    pengajuanController.cetakLaporanPengajuanTolak(req, res);
});

router.get('/cetak/:id', (req, res) => {
    console.log('Route accessed');
     pengajuanController.cetakPDFSurat(req, res);
});

    // Rute untuk Approve
    router.get('/approve/:id', (req, res) => {
        const pengajuanId = req.params.id;

        pengajuanController.approvePengajuan(req.db, pengajuanId, (err, result) => {
            if (err) {
                console.error('Error updating status:', err);
                req.flash('error', 'Failed to approve the request');
                return res.redirect('/pengajuan/admin');
            }
            req.flash('success', 'Request approved successfully');
            res.redirect('/pengajuan/admin');
        });
    });
    router.get('/reject/:id', (req, res) => {
        const pengajuanId = req.params.id;

        pengajuanController.rejectPengajuan(req.db, pengajuanId, (err, result) => {
            if (err) {
                console.error('Error updating status:', err);
                req.flash('error', 'Failed to reject the request');
                return res.redirect('/pengajuan/admin');
            }
            req.flash('success', 'Request Reject successfully');
            res.redirect('/pengajuan/admin');
        });
    });

    router.get('/download-excel', pengajuanController.downloadExcel);

module.exports = router;