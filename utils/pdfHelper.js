const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createPDFReport(outputPath, jaksaData) {
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    doc.pipe(fs.createWriteStream(outputPath));

    // Header (misalnya, Kop Surat Kejaksaan)
    const logoPath = path.join(__dirname, '../public/images/logo-kejaksaan.png'); // Sesuaikan path logo
    doc.image(logoPath, 50, 45, { width: 50 })
       .fontSize(16)
       .text('KEJAKSAAN NEGERI', 110, 57)
       .moveDown();

    doc.fontSize(12)
       .text('Jl. Contoh Alamat No. 123, Kota, Provinsi', { align: 'center' })
       .moveDown(2);

    // Konten utama
    doc.fontSize(12)
       .text('Laporan Data Jaksa', { align: 'center' })
       .moveDown();

    // Data Jaksa
    jaksaData.forEach(jaksa => {
        doc.fontSize(12).text(`Nama: ${jaksa.nama}, Jabatan: ${jaksa.jabatan}, NIP: ${jaksa.nip}`);
    });

    // Footer dengan tanggal saat ini
    const currentDate = new Date().toLocaleDateString();
    doc.fontSize(10)
       .text(`Tanggal: ${currentDate}`, { align: 'right', margin: { top: 50 } });

    doc.end();
}

module.exports = createPDFReport;