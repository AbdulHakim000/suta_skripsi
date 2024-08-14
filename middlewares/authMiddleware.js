module.exports = {
    isAuthenticated: (req, res, next) => {
        console.log('isAuthenticated middleware called');
        if (req.session.user) {
            return next();
        } else {
            // Jika belum login, arahkan ke halaman login
            req.session.message = {
                type: 'error',
                text: 'Silakan login terlebih dahulu untuk mengakses halaman ini'
            };
            return res.redirect('/login');
        }
    }
};