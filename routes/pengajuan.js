const router = require('express').Router();
const pengajuanController = require('../controllers/pengajuanController');

router.get('/', pengajuanController.index);
router.get('/admin', pengajuanController.indexAdmin);
router.post('/add',pengajuanController.addFoto, pengajuanController.add);
router.post('/edit',pengajuanController.addFoto, pengajuanController.update);
router.get('/detail/:id',pengajuanController.detail);
router.get('/edit/:id',pengajuanController.edit);
router.get('/delete/:id',pengajuanController.delete);

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

module.exports = router;