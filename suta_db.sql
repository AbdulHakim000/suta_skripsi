-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 27, 2024 at 01:35 PM
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
  `nama` varchar(50) NOT NULL,
  `pangkat` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jaksa`
--

INSERT INTO `jaksa` (`nip`, `nama`, `pangkat`) VALUES
('2342', 'abdul', 'Jaksa Madya');

-- --------------------------------------------------------

--
-- Table structure for table `kabupaten`
--

CREATE TABLE `kabupaten` (
  `id` int NOT NULL,
  `kabupaten` int NOT NULL,
  `id_provinsi` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(234, 'Naufal', 'Banjarmasin', 'Laki-Laki', 'mhs', 'Kalimantan Selatan', 'Kab. Banjar', 'Tatah Makmur', 'Tatah Layap', 'Indonesia');

-- --------------------------------------------------------

--
-- Table structure for table `provinsi`
--

CREATE TABLE `provinsi` (
  `id` int NOT NULL,
  `provinsi` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `provinsi`
--

INSERT INTO `provinsi` (`id`, `provinsi`) VALUES
(1, 'Kalimantan Selatan');

-- --------------------------------------------------------

--
-- Table structure for table `surat`
--

CREATE TABLE `surat` (
  `id_surat` int NOT NULL,
  `nik` bigint NOT NULL,
  `nama_tahanan` varchar(150) NOT NULL,
  `hubungan` varchar(30) NOT NULL,
  `tanggal1` date NOT NULL,
  `tanggal2` date NOT NULL,
  `pembuatan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `surat`
--

INSERT INTO `surat` (`id_surat`, `nik`, `nama_tahanan`, `hubungan`, `tanggal1`, `tanggal2`, `pembuatan`) VALUES
(1, 342, 'bebebece', 'Laki-Laki', '2024-08-02', '2024-08-02', '2024-07-27'),
(3, 3463, 'mamang garox', 'Laki-Laki', '2024-08-07', '2024-07-31', '2024-07-27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jaksa`
--
ALTER TABLE `jaksa`
  ADD PRIMARY KEY (`nip`);

--
-- Indexes for table `pembesuk`
--
ALTER TABLE `pembesuk`
  ADD PRIMARY KEY (`nik`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `provinsi`
--
ALTER TABLE `provinsi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `surat`
--
ALTER TABLE `surat`
  MODIFY `id_surat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
