-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 01, 2024 at 11:46 AM
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
  `pangkat` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jaksa`
--

INSERT INTO `jaksa` (`nip`, `nama`, `pangkat`) VALUES
('197707121999031003', 'Herry Setiawan, SH.MH', 'Jaksa Utama Pratama'),
('197609242001121002', 'Akhmady Rakhmat Manullang, SH', 'Jaksa Pratama'),
('197804232002122006', 'Ernawati, SH', 'Jaksa Madya'),
('197705052002121008', 'I Wayan Sutije , SH', 'Jaksa Madya'),
('197810202002122004', 'Nonie Ervina Rais, SH.MH', 'Jaksa Madya');

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
(123, 'Abdullah', 'banjarmaisn', 'Laki-Laki', 'mahasiswa', 'Kalimantan Timur', 'Kab. Barito Kuala', 'Aranion', 'Laya Baru', 'Indonesia'),
(234, 'Naufal', 'Banjarmasin', 'Laki-Laki', 'mhs', 'Kalimantan Selatan', 'Kab. Banjar', 'Tatah Makmur', 'Tatah Layap', 'Indonesia'),
(36342, 'Zaini azai', 'Banjarmasin', 'Laki-Laki', 'PELAJAR / MAHASISWA', 'Kalimantan Selatan', 'Kab. Tanah Laut', 'Tatah Makmur', 'Desa', 'Indonesia');

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
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengajuan`
--

INSERT INTO `pengajuan` (`id_pengajuan`, `nik_pembesuk`, `nama_pembesuk`, `tmp_lahir_pembesuk`, `jns_kelamin_pembesuk`, `pekerjaan_pembesuk`, `provinsi`, `kabupaten`, `kecamatan`, `kelurahan`, `kewarganegaraan`, `registrasi_tahanan`, `nama_tahanan`, `hubungan`, `status`) VALUES
(1, 1231234, 'Abdul Hakim', 'Banjarmasin', 'Laki laki', 'mahasiswa', 'kalimantan selatan', 'kabupaten banjar', 'tatah makmur', 'desa layap baru rt 06', 'Indoensia', '123', 'asdasfsf', 'Saudara / saudari', 'Belum Diproses'),
(2, 342, 'Abdul qosim', '2024-07-19', 'Laki-Laki', 'sdagarehb', 'Kalimantan Selatan', 'Banjarmasin', 'Banjarmasin Utara', 'walah', 'Indonesia', 'RT-9234/BJRMS/07/2024', 'BUDIANOR Als BUDI Bin MAHAT (Alm)', 'Saudara / saudari', 'Belum Diproses');

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
  `melanggar_pasal` varchar(500) NOT NULL,
  `lapas` varchar(100) NOT NULL,
  `durasi_penahanan` varchar(20) NOT NULL,
  `tgl_penuntutan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengelolaan`
--

INSERT INTO `pengelolaan` (`id`, `registrasi_perkara`, `registrasi_tahanan`, `kronologi`, `jaksa1`, `jaksa2`, `jaksa3`, `jaksa4`, `barang_bukti`, `melanggar_pasal`, `lapas`, `durasi_penahanan`, `tgl_penuntutan`) VALUES
(1, '1231', '124342', 'jadi gini', 'a', 'b', 'c', 'd', 'b', 'a', 'cd', '20 hari', '2024-08-29');

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
  `nama_tahanan` varchar(150) NOT NULL,
  `hubungan` varchar(30) NOT NULL,
  `tanggal1` varchar(100) NOT NULL,
  `tanggal2` date NOT NULL,
  `pembuatan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `surat`
--

INSERT INTO `surat` (`id_surat`, `nik`, `nama_tahanan`, `hubungan`, `tanggal1`, `tanggal2`, `pembuatan`) VALUES
(3, 3463, 'mamang garox coy', 'Laki-Laki', '2024-07-26', '2024-07-26', '2024-07-31');

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
  `tgl_surat_tuntutan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tahanan`
--

INSERT INTO `tahanan` (`id`, `registrasi_tahanan`, `nama_tahanan`, `tgl_lahir`, `tmp_lahir`, `provinsi`, `kabupaten`, `kecamatan`, `kelurahan`, `agama`, `jns_kelamin`, `pekerjaan`, `pendidikan`, `perkara`, `kewarganegaraan`, `tgl_surat_tuntutan`) VALUES
(3, 'RT-9234/BJRMS/07/2024', 'BUDIANOR Als BUDI Bin MAHAT (Alm) ', '2024-08-14', 'fdsaasdfa', 'Kalimantan Selatan', 'Banjarmasin', 'Banjarmasin Utara', 'sdfsd', 'Islam', 'Laki-Laki', 'asdfa', 'Sekolah Lanjutan Tingkat Atas / Sederajat', 'Narkotika', 'Indonesia', '2024-08-01'),
(5, 'RT-9250/BJRMS/08/2024', 'Rahmani Als Mandor Bin H. Marudin', '1997-12-22', 'Anjir', 'Kalimantan Selatan', 'Barito Kuala', 'Anjir Pasar', 'Desa Anjir Seberang Pasar II RT.002', 'Islam', 'Laki-Laki', 'PELAJAR / MAHASISWA', 'SLTA', 'Oharda', 'Indonesia', '2024-08-09'),
(6, 'RT-9247/BJRMS/08/2024', 'Sadik Als Sadik Bin Hujaji (Alm)', '1982-06-15', 'Anjir Sarapat', 'Kalimantan Tengah', 'Kapuas', 'Kapuas Timur', 'Desa Anjir Serapat Barat Rt.001 Kel. Desa Anjir\r\nSerapat Barat', 'Islam', 'Laki-Laki', 'Buruh Harian Lepas', 'SMP', 'Narkotika', 'Indonesia', '2024-08-01'),
(7, 'RT-9247/BJRMS/08/2024', 'Rahmat Hidayat Als Dayat bin Abdul Muin Ali (Alm)', '1971-11-29', 'Banjarmasin', 'Kalimantan Selatan', 'Kota Banjarmasin', 'Banjarmasin Selatan', 'Jl. Kelayan A Gg. Aliyah Ujung No.40 Rt/Rw\r\n005/001 Kel. Kelayan Dalam', 'Islam', 'Laki-Laki', 'Wiraswasta', 'Sekolah Lanjutan Tingkat Atas / Sederajat', 'Narkotika', 'Indonesia', '2024-08-01'),
(8, 'RT-9245/BJRMS/08/2024', 'Supianoor Als Febriyan Als Iyan Als Iyan Negro Bin Hasan', '1984-04-04', 'Banjarmasin', 'Kalimantan Selatan', 'Kota Banjarmasin', 'Banjarmasin Selatan', 'Jl.Kelayan A No. 003 Rt. 022 Rw. 002 Kel.\r\nMurung Raya', 'Islam', 'Laki-Laki', 'Buruh Harian Lepas', 'Sekolah Dasar / Sederajat', 'Narkotika', 'Indonesia', '2024-08-01');

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
  MODIFY `id_pengajuan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pengelolaan`
--
ALTER TABLE `pengelolaan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `provinsi`
--
ALTER TABLE `provinsi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `surat`
--
ALTER TABLE `surat`
  MODIFY `id_surat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tahanan`
--
ALTER TABLE `tahanan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
