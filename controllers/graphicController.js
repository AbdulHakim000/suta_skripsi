const db = require('../database/conn'); 
const mysql = require('mysql');
const { promisify } = require('util');

// Buat koneksi dan promisify query
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'suta_db'
});

const query = promisify(connection.query).bind(connection);

module.exports = {
    getPersentasePerkara : async (req, res) => {
        try {
            const result = await query(`
                SELECT perkara, COUNT(*) as total 
                FROM tahanan 
                GROUP BY perkara
            `);

            console.log(result); // Pastikan ini mengembalikan array

            if (Array.isArray(result) && result.length > 0) {
                const totalTahanan = result.reduce((acc, row) => acc + row.total, 0);

                const data = result.map(row => ({
                    label: row.perkara,
                    value: (row.total / totalTahanan) * 100
                }));

                res.json(data);
            } else {
                res.json([]); // Jika result tidak berisi data
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },

    getTahananNarkotikaPerProvinsi: async (req, res) => {
        try {
            const result = await query(`
                SELECT provinsi, COUNT(*) as jumlah 
                FROM tahanan 
                WHERE perkara = 'Narkotika / Enz.2' 
                GROUP BY provinsi
            `);

            console.log(result); // Pastikan ini mengembalikan array

            if (Array.isArray(result) && result.length > 0) {
                const data = result.map(row => ({
                    provinsi: row.provinsi,
                    jumlah: row.jumlah
                }));

                res.json(data);
            } else {
                res.json([]); // Jika result tidak berisi data
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },

    getTahananOhardaPerProvinsi: async (req, res) => {
        try {
            const result = await query(`
                SELECT provinsi, COUNT(*) as jumlah 
                FROM tahanan 
                WHERE perkara = 'Orang dan Harta Benda / Eoh.2' 
                GROUP BY provinsi
            `);

            console.log(result); // Pastikan ini mengembalikan array

            if (Array.isArray(result) && result.length > 0) {
                const data = result.map(row => ({
                    provinsi: row.provinsi,
                    jumlah: row.jumlah
                }));

                res.json(data);
            } else {
                res.json([]); // Jika result tidak berisi data
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },

        getTahananKamtibumPerProvinsi: async (req, res) => {
        try {
            const result = await query(`
                SELECT provinsi, COUNT(*) as jumlah 
                FROM tahanan 
                WHERE perkara = 'Keamanan dan Ketertiban Umum / Eku.2' 
                GROUP BY provinsi
            `);

            console.log(result); // Pastikan ini mengembalikan array

            if (Array.isArray(result) && result.length > 0) {
                const data = result.map(row => ({
                    provinsi: row.provinsi,
                    jumlah: row.jumlah
                }));

                res.json(data);
            } else {
                res.json([]); // Jika result tidak berisi data
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },

    getTahananUmurNarkotika: async (req, res) => {
        try {
            // Ambil tanggal lahir tahanan narkotika
            const result = await query(`
                SELECT tgl_lahir 
                FROM tahanan 
                WHERE perkara = 'Narkotika / Enz.2'
            `);

            console.log(result); // Pastikan ini mengembalikan array

            if (Array.isArray(result) && result.length > 0) {
                // Kategorikan umur ke dalam rentang umur
                const ageRanges = {
                    '<18': 0,
                    '18-25': 0,
                    '25-35': 0,
                    '35-45': 0,
                    '>50': 0
                };

                const now = new Date();

                result.forEach(item => {
                    const dob = new Date(item.tgl_lahir);
                    let age = now.getFullYear() - dob.getFullYear();
                    let m = now.getMonth() - dob.getMonth();

                    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
                        age--;
                    }

                    if (age < 18) {
                        ageRanges['<18']++;
                    } else if (age >= 18 && age <= 25) {
                        ageRanges['18-25']++;
                    } else if (age > 25 && age <= 35) {
                        ageRanges['25-35']++;
                    } else if (age > 35 && age <= 45) {
                        ageRanges['35-45']++;
                    } else if (age > 50) {
                        ageRanges['>50']++;
                    }
                });

                const data = {
                    '<18': ageRanges['<18'],
                    '18-25': ageRanges['18-25'],
                    '25-35': ageRanges['25-35'],
                    '35-45': ageRanges['35-45'],
                    '>50': ageRanges['>50']
                };

                res.json(data);
            } else {
                res.json({}); // Jika result tidak berisi data
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },

    getTahananUmurOharda: async (req, res) => {
        try {
            // Ambil tanggal lahir tahanan oahrda
            const result = await query(`
                SELECT tgl_lahir 
                FROM tahanan 
                WHERE perkara = 'Orang dan Harta Benda / Eoh.2'
            `);

            console.log(result); // Pastikan ini mengembalikan array

            if (Array.isArray(result) && result.length > 0) {
                // Kategorikan umur ke dalam rentang umur
                const ageRanges = {
                    '<18': 0,
                    '18-25': 0,
                    '25-35': 0,
                    '35-45': 0,
                    '>50': 0
                };

                const now = new Date();

                result.forEach(item => {
                    const dob = new Date(item.tgl_lahir);
                    let age = now.getFullYear() - dob.getFullYear();
                    let m = now.getMonth() - dob.getMonth();

                    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
                        age--;
                    }

                    if (age < 18) {
                        ageRanges['<18']++;
                    } else if (age >= 18 && age <= 25) {
                        ageRanges['18-25']++;
                    } else if (age > 25 && age <= 35) {
                        ageRanges['25-35']++;
                    } else if (age > 35 && age <= 45) {
                        ageRanges['35-45']++;
                    } else if (age > 50) {
                        ageRanges['>50']++;
                    }
                });

                const data = {
                    '<18': ageRanges['<18'],
                    '18-25': ageRanges['18-25'],
                    '25-35': ageRanges['25-35'],
                    '35-45': ageRanges['35-45'],
                    '>50': ageRanges['>50']
                };

                res.json(data);
            } else {
                res.json({}); // Jika result tidak berisi data
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },

        getTahananUmurKamtibum: async (req, res) => {
        try {
            // Ambil tanggal lahir tahanan kamtibum
            const result = await query(`
                SELECT tgl_lahir 
                FROM tahanan 
                WHERE perkara = 'Keamanan dan Ketertiban Umum / Eku.2'
            `);

            console.log(result); // Pastikan ini mengembalikan array

            if (Array.isArray(result) && result.length > 0) {
                // Kategorikan umur ke dalam rentang umur
                const ageRanges = {
                    '<18': 0,
                    '18-25': 0,
                    '25-35': 0,
                    '35-45': 0,
                    '>50': 0
                };

                const now = new Date();

                result.forEach(item => {
                    const dob = new Date(item.tgl_lahir);
                    let age = now.getFullYear() - dob.getFullYear();
                    let m = now.getMonth() - dob.getMonth();

                    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
                        age--;
                    }

                    if (age < 18) {
                        ageRanges['<18']++;
                    } else if (age >= 18 && age <= 25) {
                        ageRanges['18-25']++;
                    } else if (age > 25 && age <= 35) {
                        ageRanges['25-35']++;
                    } else if (age > 35 && age <= 45) {
                        ageRanges['35-45']++;
                    } else if (age > 50) {
                        ageRanges['>50']++;
                    }
                });

                const data = {
                    '<18': ageRanges['<18'],
                    '18-25': ageRanges['18-25'],
                    '25-35': ageRanges['25-35'],
                    '35-45': ageRanges['35-45'],
                    '>50': ageRanges['>50']
                };

                res.json(data);
            } else {
                res.json({}); // Jika result tidak berisi data
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching data');
        }
    },

    getPengajuanPerTanggal: async (req, res) => {
        const month = req.query.month;
    const year = req.query.year;

    console.log('Month:', month);
    console.log('Year:', year);

    const query = `
        SELECT DAY(tgl_pengajuan) as day, COUNT(*) as count
        FROM pengajuan_surat
        WHERE MONTH(tgl_pengajuan) = ? AND YEAR(tgl_pengajuan) = ?
        GROUP BY DAY(tgl_pengajuan)
        ORDER BY DAY(tgl_pengajuan)
    `;

    connection.query(query, [month, year], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Error fetching data' });
        }

        console.log('Rows from DB:', results);

        if (!results || results.length === 0) {
            console.log('No data returned from the query.');
            return res.status(404).json({ error: 'No data found for the selected month and year.' });
        }

        const labels = Array.from({ length: 31 }, (_, i) => i + 1); // Dates 1-31
        const data = new Array(31).fill(0); // Initialize array with zeros

        results.forEach(row => {
            data[row.day - 1] = row.count;
        });

        res.json({ labels, data });
    });
},

    getPengajuanPerBulan : async (req, res) => {
        try {
                // Ambil jumlah pengajuan per bulan yang ada di database
                const result = await query(`
                    SELECT MONTH(tgl_pengajuan) as month, YEAR(tgl_pengajuan) as year, COUNT(*) as count
                    FROM pengajuan_surat
                    GROUP BY YEAR(tgl_pengajuan), MONTH(tgl_pengajuan)
                    ORDER BY YEAR(tgl_pengajuan), MONTH(tgl_pengajuan)
                `);

                // Inisialisasi data dengan 0 untuk semua bulan
                const currentYear = new Date().getFullYear(); // Atau tahun yang Anda inginkan
                const months = Array.from({ length: 12 }, (_, i) => ({
                    month: i + 1,
                    year: currentYear,
                    count: 0
                }));

                // Gabungkan data yang ada dengan data yang sudah diinisialisasi
                result.forEach(row => {
                    const monthIndex = months.findIndex(m => m.month === row.month && m.year === row.year);
                    if (monthIndex !== -1) {
                        months[monthIndex].count = row.count;
                    }
                });

                res.json(months);
            } catch (error) {
                console.error(error);
                res.status(500).send('Error fetching data');
            }
        },

    getPersentaseJenisKelamin : async (req, res) => {
            try {
                const result = await query(`
                    SELECT jns_kelamin, COUNT(*) as total 
                    FROM tahanan 
                    GROUP BY jns_kelamin
                `);

                if (Array.isArray(result) && result.length > 0) {
                    const totalTahanan = result.reduce((acc, row) => acc + row.total, 0);

                    const data = result.map(row => ({
                        label: row.jns_kelamin,
                        value: (row.total / totalTahanan) * 100
                    }));

                    res.json(data);
                } else {
                    res.json([]); // Jika result tidak berisi data
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Error fetching data');
            }
        },

}