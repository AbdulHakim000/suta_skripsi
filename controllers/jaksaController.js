const jaksa = require('../models/jaksaModel');

module.exports = {
    index: (req, res) => {
     jaksa.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('jaksa/index', { data:''})
        } else {
            res.render('jaksa/index', { 
                layout: 'layout/main',
                title: 'Halaman jaksa',
                jaksas: rows})
        }
    });
    },

    detail: (req, res) => {
     jaksa.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('jaksa/detail_modal', { data:''})
        } else {
            const nip = req.params.nip;
            const jaksa = rows.find(jaksa => jaksa.nip === nip);
            res.render('jaksa/detail_modal', { 
                layout: 'layout/main',
                title: 'Halaman jaksa',
                jaksa, 
                jaksas: rows})
        }
    });
    },

    edit: (req, res) => {
     jaksa.fetchData(req.db, (err, rows) => {
        if (err) {
            req.flash('error', err.message); 
            res.render('jaksa/edit_modal', { data:''})
        } else {
            const nip = req.params.nip;

            console.log(nip);
            const jaksa = rows.find(j => j.nip === nip);
            res.render('jaksa/edit_modal', { 
                layout: 'layout/main',
                title: 'Halaman jaksa',
                jaksa, 
                jaksas: rows})
        }
    });

    
}  ,



add: (req, res) => {
    const {nip, nama, pangkat} = req.body;
    const form_jaksa = {
        nip,
        nama,
        pangkat,
    }
    
    console.log(form_jaksa);

        jaksa.insertData(req.db, form_jaksa, (err, result) => {
            if (err) {
                req.flash('Error Ketika Memasukkan Data', err.message);
                res.redirect('/jaksa');   
            } else {
                req.flash('success', 'Data berhasil dimasukkan ke database');
                res.redirect('/jaksa');    
            }
        })
    },
    
    
    
update: (req, res) => {
    const {nip, nama, pangkat} = req.body;
    const form_jaksa = {
            nip,
            nama,
            pangkat,
        }
    
    console.log(form_jaksa);
    jaksa.updateData(req.db, nip, form_jaksa, (err, result) => {
            if (err) {
                req.flash('error','Error Ketika Memasukkan Data', err.message);
                res.redirect('/jaksa');
            } else {
                req.flash('succes','Data Berhasil diUpdate');
                res.redirect('/jaksa');
            }
        })
    },


    delete : (req, res) => {
        const nip = req.params.nip; // Mengambil nip dari parameter URL
        console.log(nip);
        jaksa.deleteData(req.db, nip, (err, result) => {
        if (err) {
            req.flash('error','Error Ketika Memasukkan Data', err.message);
            res.redirect('/jaksa');
        } else {
            req.flash('succes','Data Berhasil diUpdate');
            res.redirect('/jaksa');
        }
    })
    },
}