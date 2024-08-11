-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 11, 2024 at 05:33 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `suta_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `jaksa`
--

CREATE TABLE `jaksa` (
  `nip` varchar(30) NOT NULL,
  `nama` varchar(60) NOT NULL,
  `pangkat` varchar(30) NOT NULL,
  `gambar_jaksa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jaksa`
--

INSERT INTO `jaksa` (`nip`, `nama`, `pangkat`, `gambar_jaksa`) VALUES
('197707121999031003', 'Herry Setiawan, SH.MH', 'Jaksa Utama Pratama', ''),
('197609242001121002', 'Akhmady Rakhmat Manullang, SH', 'Jaksa Pratama', ''),
('197804232002122006', 'Ernawati, SH', 'Jaksa Madya', ''),
('197705052002121008', 'I Wayan Sutije , SH', 'Jaksa Madya', ''),
('197810202002122004', 'Nonie Ervina Rais, SH.MH', 'Jaksa Madya', ''),
('19780115200012200122123', 'Abdul Hakimmm musang', 'Jaksa Utama Pratama', '1723279647378-bioskooopefds-0182.jpg'),
('197801152000122212', 'Fitriansyah', 'Jaksa Utama Pratama', '1723269341736-foto saye.jpg'),
('142342342334644443', 'azai', 'Jaksa Utama Pratama', '1723274334361-posudfsete.jpg'),
('1243243342346342334344', 'mamat', 'Jaksa Pratama', '1723279748011-Untitled-1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `kabupaten`
--

CREATE TABLE `kabupaten` (
  `id` int NOT NULL,
  `id_kabupaten` varchar(30) NOT NULL,
  `nama_kabupaten` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id_provinsi` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kabupaten`
--

INSERT INTO `kabupaten` (`id`, `id_kabupaten`, `nama_kabupaten`, `id_provinsi`) VALUES
(2, 'kab_banjar', 'Kabupaten Banjar', 'kalsel'),
(3, 'kab_tapin', 'Kabupaten Tapin', 'kalsel'),
(4, 'kab_hss', 'Kabupaten Hulu Sungai Selatan', 'kalsel'),
(5, 'kab_hst', 'Kabupaten Hulu Sungai Tengah', 'kalsel'),
(6, 'Kab_kotabaru', 'Kabupaten Kotabaru', 'kalsel'),
(7, 'Kab_baritoSel', 'Kabupaten Barito Selatan', 'kalteng'),
(8, 'Kab_kapuas', 'Kabupaten Kapuas', 'kalteng'),
(9, 'Kab_kutaiKartanegara', 'Kabupaten Kutai Kartanegara', 'kaltim');

-- --------------------------------------------------------

--
-- Table structure for table `kecamatan`
--

CREATE TABLE `kecamatan` (
  `id` int NOT NULL,
  `kecamatan` int NOT NULL,
  `id_kabupaten` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembesuk`
--

CREATE TABLE `pembesuk` (
  `nik` bigint NOT NULL,
  `nama_pembesuk` varchar(100) NOT NULL,
  `tmp_lahir` varchar(40) NOT NULL,
  `jns_kelamin` varchar(20) NOT NULL,
  `pekerjaan` varchar(30) NOT NULL,
  `provinsi` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kabupaten` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kecamatan` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kelurahan` varchar(60) NOT NULL,
  `kewarganegaraan` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pembesuk`
--

INSERT INTO `pembesuk` (`nik`, `nama_pembesuk`, `tmp_lahir`, `jns_kelamin`, `pekerjaan`, `provinsi`, `kabupaten`, `kecamatan`, `kelurahan`, `kewarganegaraan`) VALUES
(12, 'MAULIDAN jar', 'Banjarmasin', 'Laki-Laki', 'KARYAWAN SWASTA', 'Kalimantan Timur', 'Kab. Kota Baru', 'Aranion', 'Desa', 'Indonesia'),
(123, 'Abdullah', 'banjarmaisn', 'Laki-Laki', 'mahasiswa', 'Kalimantan Timur', 'Kab. Barito Kuala', 'Aranion', 'Laya Baru', 'Indonesia'),
(234, 'Naufal', 'Banjarmasin', 'Laki-Laki', 'mhs', 'Kalimantan Selatan', 'Kab. Banjar', 'Tatah Makmur', 'Tatah Layap', 'Indonesia'),
(36342, 'Zaini azai', 'Banjarmasin', 'Laki-Laki', 'PELAJAR / MAHASISWA', 'Kalimantan Selatan', 'Kab. Tanah Laut', 'Tatah Makmur', 'Desa', 'Indonesia'),
(1231412414141212, 'MAULIDAN', 'Banjarmasin', 'Laki-Laki', 'BELUM / TIDAK BEKERJA', 'Kalimantan Utara', 'Kab. Kota Baru', 'Aluh-aluh', 'Desa', 'Indonesia');

-- --------------------------------------------------------

--
-- Table structure for table `pengajuan`
--

CREATE TABLE `pengajuan` (
  `id_pengajuan` int NOT NULL,
  `nik_pembesuk` bigint NOT NULL,
  `nama_pembesuk` varchar(60) NOT NULL,
  `tmp_lahir_pembesuk` varchar(100) NOT NULL,
  `jns_kelamin_pembesuk` varchar(30) NOT NULL,
  `pekerjaan_pembesuk` varchar(60) NOT NULL,
  `provinsi` varchar(40) NOT NULL,
  `kabupaten` varchar(40) NOT NULL,
  `kecamatan` varchar(40) NOT NULL,
  `kelurahan` varchar(100) NOT NULL,
  `kewarganegaraan` varchar(30) NOT NULL,
  `registrasi_tahanan` varchar(30) NOT NULL,
  `nama_tahanan` varchar(100) NOT NULL,
  `hubungan` varchar(40) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `gambar_ktp` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengajuan`
--

INSERT INTO `pengajuan` (`id_pengajuan`, `nik_pembesuk`, `nama_pembesuk`, `tmp_lahir_pembesuk`, `jns_kelamin_pembesuk`, `pekerjaan_pembesuk`, `provinsi`, `kabupaten`, `kecamatan`, `kelurahan`, `kewarganegaraan`, `registrasi_tahanan`, `nama_tahanan`, `hubungan`, `status`, `gambar_ktp`) VALUES
(1, 1231234, 'Abdul Hakim', 'Banjarmasin', 'Laki laki', 'mahasiswa', 'kalimantan selatan', 'kabupaten banjar', 'tatah makmur', 'desa layap baru rt 06', 'Indoensia', '123', 'asdasfsf', 'Saudara / saudari', 'Belum Diproses', ''),
(2, 342, 'Abdul qosim', '2024-07-19', 'Laki-Laki', 'sdagarehb', 'Kalimantan Selatan', 'Banjarmasin', 'Banjarmasin Utara', 'walah', 'Indonesia', 'RT-9234/BJRMS/07/2024', 'BUDIANOR Als BUDI Bin MAHAT (Alm)', 'Saudara / saudari', 'Belum Diproses', ''),
(4, 23324634, 'mamat', 'banjarmasin', '-', 'nganggur', 'Kalimantan Selatan', 'Banjarmasin', 'Banjarmasin Selatan', 'geh', 'Indonesia', 'RT-9247/BJRMS/08/2024', 'test', 'Teman', 'Belum Diproeses', ''),
(5, 4124124, 'Faisal lai jas mas', 'banjarmasin', 'Laki-Laki', 'sdagarehb', 'Kalimantan Selatan', 'Banjarmasin', 'Kapuas Timur', 'sd', 'Indonesia', 'RT-9234/BJRMS/07/2024', 'MUHAMMAD NASIR Als NASIR Bin ALFIAN', 'Orang Tua', 'Belum Diproeses', ''),
(6, 3642134, 'yanto basna', 'banjarmasin', 'Laki-Laki', 'sdagarehb', 'Kalimantan Tengah', 'Banjarmasin', 'Banjarmasin Utara', 'df', 'Indonesia', 'RT-9245/BJRMS/08/2024', 'Sekolah Lanjutan Tingkat Atas / Sederajat', 'Anak', 'Belum Diproeses', '1723283757612-sotry.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `pengelolaan`
--

CREATE TABLE `pengelolaan` (
  `id` int NOT NULL,
  `registrasi_perkara` varchar(40) NOT NULL,
  `registrasi_tahanan` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kronologi` varchar(1000) NOT NULL,
  `jaksa1` varchar(60) NOT NULL,
  `jaksa2` varchar(60) NOT NULL,
  `jaksa3` varchar(60) NOT NULL,
  `jaksa4` varchar(60) NOT NULL,
  `barang_bukti` varchar(100) NOT NULL,
  `gambar_barbuk` varchar(255) DEFAULT NULL,
  `melanggar_pasal` varchar(500) NOT NULL,
  `lapas` varchar(100) NOT NULL,
  `durasi_penahanan` varchar(20) NOT NULL,
  `tgl_penuntutan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengelolaan`
--

INSERT INTO `pengelolaan` (`id`, `registrasi_perkara`, `registrasi_tahanan`, `kronologi`, `jaksa1`, `jaksa2`, `jaksa3`, `jaksa4`, `barang_bukti`, `gambar_barbuk`, `melanggar_pasal`, `lapas`, `durasi_penahanan`, `tgl_penuntutan`) VALUES
(1, '1231', 'RT-9234/BJRMS/07/2024', 'jadi gini', 'Herry Setiawan, SH.MH', 'Herry Setiawan, SH.MH', 'Herry Setiawan, SH.MH', 'Herry Setiawan, SH.MH', 'b', NULL, 'a', 'cd', '202 hari', '2024-08-30'),
(3, '4666', 'RT-9245/BJRMS/08/2024', 'jadi gini', 'Akhmady Rakhmat Manullang, SH', 'Akhmady Rakhmat Manullang, SH', 'Akhmady Rakhmat Manullang, SH', 'Akhmady Rakhmat Manullang, SH', 'wah', NULL, 'asa', 'a', '21 hari', '2024-08-30'),
(4, '43214', 'RT-9250/BJRMS/08/2024', 'walah', 'Herry Setiawan, SH.MH', 'Akhmady Rakhmat Manullang, SH', 'Ernawati, SH', 'I Wayan Sutije , SH', 'hehe', NULL, 'haha', 'a', '21 hari', '2024-08-30'),
(5, '123', 'RT-9250/BJRMS/08/2024', 'was', 'Herry Setiawan, SH.MH', 'Ernawati, SH', 'Akhmady Rakhmat Manullang, SH', 'Herry Setiawan, SH.MH', 'was', NULL, 'was', 'a', '212 hari', '2024-08-09'),
(6, '466664', 'RT-9250/BJRMS/08/2024', 'wah ga tau juga saya mas', 'Herry Setiawan, SH.MH', 'Abdul Hakimmm musang', 'I Wayan Sutije , SH', 'Herry Setiawan, SH.MH', 'dd', '1723285223423-download.png', 'dd', 'a', '2 hari', '2024-08-21');

-- --------------------------------------------------------

--
-- Table structure for table `provinsi`
--

CREATE TABLE `provinsi` (
  `id` int NOT NULL,
  `id_provinsi` varchar(20) NOT NULL,
  `nama_provinsi` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `provinsi`
--

INSERT INTO `provinsi` (`id`, `id_provinsi`, `nama_provinsi`) VALUES
(2, 'kalbar', 'Kalimantan Barat'),
(3, 'kaltim', 'Kalimantan Timur'),
(4, 'kaltara', 'Kalimantan Utara'),
(5, 'kalteng', 'Kalimantan Tengah'),
(6, 'kalsel', 'Kalimantan Selatan');

-- --------------------------------------------------------

--
-- Table structure for table `surat`
--

CREATE TABLE `surat` (
  `id_surat` int NOT NULL,
  `nik` bigint NOT NULL,
  `registrasi_tahanan` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `hubungan` varchar(30) NOT NULL,
  `tanggal1` varchar(100) NOT NULL,
  `tanggal2` date NOT NULL,
  `pembuatan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `surat`
--

INSERT INTO `surat` (`id_surat`, `nik`, `registrasi_tahanan`, `hubungan`, `tanggal1`, `tanggal2`, `pembuatan`) VALUES
(3, 123, 'RT-9245/BJRMS/08/2024', 'Anak', '2024-07-26', '2024-08-30', '2024-08-02'),
(4, 234, 'RT-9234/BJRMS/07/2024', 'Teman', '2024-08-22', '2024-08-29', '2024-08-02'),
(5, 234, 'RT-9247/BJRMS/08/2024', 'Anak', '2024-08-30', '2024-08-23', '2024-08-02'),
(6, 123, '231', 'Teman', '2024-08-29', '2024-08-29', '2024-08-09');

-- --------------------------------------------------------

--
-- Table structure for table `tahanan`
--

CREATE TABLE `tahanan` (
  `id` int NOT NULL,
  `registrasi_tahanan` varchar(30) NOT NULL,
  `nama_tahanan` varchar(100) NOT NULL,
  `tgl_lahir` date NOT NULL,
  `tmp_lahir` varchar(40) NOT NULL,
  `provinsi` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `kabupaten` varchar(40) NOT NULL,
  `kecamatan` varchar(40) NOT NULL,
  `kelurahan` varchar(100) NOT NULL,
  `agama` varchar(20) NOT NULL,
  `jns_kelamin` varchar(30) NOT NULL,
  `pekerjaan` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pendidikan` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `perkara` varchar(50) NOT NULL,
  `kewarganegaraan` varchar(25) NOT NULL,
  `tgl_surat_tuntutan` date NOT NULL,
  `gambar_tahanan` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tahanan`
--

INSERT INTO `tahanan` (`id`, `registrasi_tahanan`, `nama_tahanan`, `tgl_lahir`, `tmp_lahir`, `provinsi`, `kabupaten`, `kecamatan`, `kelurahan`, `agama`, `jns_kelamin`, `pekerjaan`, `pendidikan`, `perkara`, `kewarganegaraan`, `tgl_surat_tuntutan`, `gambar_tahanan`) VALUES
(3, 'RT-9234/BJRMS/07/2024', 'BUDIANOR Als BUDI Bin MAHAT (Alm) ', '2024-09-06', 'prindavan', 'Kalimantan Selatan', 'Banjarmasin', 'Banjarmasin Utara', 'sdfsd', 'Islam', 'Laki-Laki', 'asdfa', 'Sekolah Lanjutan Tingkat Atas / Sederajat', 'Narkotika', 'Indonesia', '2024-08-29', '1723284037526-Screenshot 2023-11-20 at 09-15-21 BATAS SELAT HILIR KUALA KAPUAS - Google My Map1s copy.png'),
(5, 'RT-9250/BJRMS/08/2024', 'Rahmani Als Mandor Bin H. Marudin', '1997-12-22', 'Anjir', 'Kalimantan Selatan', 'Barito Kuala', 'Anjir Pasar', 'Desa Anjir Seberang Pasar II RT.002', 'Islam', 'Laki-Laki', 'PELAJAR / MAHASISWA', 'SLTA', 'Oharda', 'Indonesia', '2024-08-09', NULL),
(6, 'RT-9247/BJRMS/08/2024', 'Sadik Als Sadik Bin Hujaji (Alm)', '1982-06-15', 'Anjir Sarapat', 'Kalimantan Tengah', 'Kapuas', 'Kapuas Timur', 'Desa Anjir Serapat Barat Rt.001 Kel. Desa Anjir\r\nSerapat Barat', 'Islam', 'Laki-Laki', 'Buruh Harian Lepas', 'SMP', 'Narkotika', 'Indonesia', '2024-08-01', NULL),
(7, 'RT-9247/BJRMS/08/2024', 'Rahmat Hidayat Als Dayat bin Abdul Muin Ali (Alm)', '1971-11-29', 'Banjarmasin', 'Kalimantan Selatan', 'Kota Banjarmasin', 'Banjarmasin Selatan', 'Jl. Kelayan A Gg. Aliyah Ujung No.40 Rt/Rw\r\n005/001 Kel. Kelayan Dalam', 'Islam', 'Laki-Laki', 'Wiraswasta', 'Sekolah Lanjutan Tingkat Atas / Sederajat', 'Narkotika', 'Indonesia', '2024-08-01', NULL),
(8, 'RT-9245/BJRMS/08/2024', 'Supianoor Als Febriyan Als Iyan Als Iyan Negro Bin Hasan', '1984-04-04', 'Banjarmasin', 'Kalimantan Selatan', 'Kota Banjarmasin', 'Banjarmasin Selatan', 'Jl.Kelayan A No. 003 Rt. 022 Rw. 002 Kel.\r\nMurung Raya', 'Islam', 'Laki-Laki', 'Buruh Harian Lepas', 'Sekolah Dasar / Sederajat', 'Narkotika', 'Indonesia', '2024-08-01', NULL),
(10, '231', 'wawan ninja', '2024-08-22', 'Banjarmasin', 'Kalimantan Selatan', 'Banjarmasin', 'Banjarmasin Selatan', 's', 'Islam', 'Laki-Laki', 'PELAJAR / MAHASISWA', 'Sekolah Lanjutan Tingkat Atas / Sederajat', 'Oharda', 'Indonesia', '2024-08-09', NULL),
(11, 'RT-9247/BJRMS/08/20242', 'bambang pamungkas', '2024-08-15', 'Martapura', 'Kalimantan Selatan', 'Banjarmasin', 'Anjir Pasar', 'ss', 'ss', 'Laki-Laki', 'ss', 'ss', 'ss', 'Indonesia', '2024-08-29', '1723280305485-Untitled-1.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kabupaten`
--
ALTER TABLE `kabupaten`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pembesuk`
--
ALTER TABLE `pembesuk`
  ADD PRIMARY KEY (`nik`);

--
-- Indexes for table `pengajuan`
--
ALTER TABLE `pengajuan`
  ADD PRIMARY KEY (`id_pengajuan`);

--
-- Indexes for table `pengelolaan`
--
ALTER TABLE `pengelolaan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provinsi`
--
ALTER TABLE `provinsi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `surat`
--
ALTER TABLE `surat`
  ADD PRIMARY KEY (`id_surat`);

--
-- Indexes for table `tahanan`
--
ALTER TABLE `tahanan`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kabupaten`
--
ALTER TABLE `kabupaten`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pengajuan`
--
ALTER TABLE `pengajuan`
  MODIFY `id_pengajuan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pengelolaan`
--
ALTER TABLE `pengelolaan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `provinsi`
--
ALTER TABLE `provinsi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `surat`
--
ALTER TABLE `surat`
  MODIFY `id_surat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tahanan`
--
ALTER TABLE `tahanan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
