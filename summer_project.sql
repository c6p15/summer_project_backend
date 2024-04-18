-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2024 at 05:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `summer_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `AID` bigint(20) NOT NULL,
  `AEmail` varchar(50) NOT NULL,
  `AUsername` varchar(50) NOT NULL,
  `APassword` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`AID`, `AEmail`, `AUsername`, `APassword`) VALUES
(1, 'admin01@gmail.com', 'Admin01', '12345'),
(2, 'admin02@gmail.com', 'Admin02', '12345'),
(5, 'test3@gmail.com', 'testtest3', '$2b$10$cJmbw3AmT3UwLvd3/9102O8cxg7CUcidaSddOjkHbwk'),
(6, 'test3@gmail.com', 'testtest4', '$2b$10$RW4KKgFhH.QZbrIDamC3oeGfl0V/dlDnlDg8BI0UVmr'),
(7, 'test3@gmail.com', 'testtest5', '$2b$10$ZVv1Cl0a.WBeFr8iKxm5e.REIvbJi1f2xN5F4GCZG4JST8rCyrKYO'),
(8, 'EditAdminFromPM2@gmail.com', 'testtest7', '$2b$10$J9ha3lMJP.5VvRssF6gASemnCshq12FR8iWOkhj7D0Kqxyz3v9T8O'),
(9, 'test3@gmail.com', 'testtest9', '$2b$10$w8x26.PQue7iwAhQs9br4.1kCoq6JbDlc817LsjI.QYM3rHnbGlre'),
(10, 'champ849245@gmail.com', 'champ', '$2b$10$sZBmq7JqK2SPm2/pbhh4COwiTk4rFwPNvY2q2.my3MuGeTU/7okNa');

-- --------------------------------------------------------

--
-- Table structure for table `broadcasts`
--

CREATE TABLE `broadcasts` (
  `BID` bigint(20) NOT NULL,
  `BName` varchar(50) NOT NULL DEFAULT 'Untitle',
  `BStatus` enum('Draft','Sent','Schedule') NOT NULL DEFAULT 'Draft',
  `BTag` varchar(50) DEFAULT NULL,
  `BFrom` varchar(255) DEFAULT 'Anonymous',
  `BRecipient` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `BSubject` varchar(50) DEFAULT NULL,
  `BUpdate` datetime NOT NULL,
  `BIsDelete` tinyint(1) NOT NULL DEFAULT 0,
  `TID` bigint(20) DEFAULT NULL,
  `AID` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `broadcasts`
--

INSERT INTO `broadcasts` (`BID`, `BName`, `BStatus`, `BTag`, `BFrom`, `BRecipient`, `BSubject`, `BUpdate`, `BIsDelete`, `TID`, `AID`) VALUES
(1, 'Broadcast 1', 'Draft', 'summer_sells', NULL, '{\'Platinum\'}', NULL, '2024-04-05 16:41:06', 0, 1, 8),
(2, 'Broadcast 2', 'Sent', 'winter_sells', NULL, '{\'Gold\'}', NULL, '2024-04-05 16:41:20', 0, 2, 1),
(17, 'Untitle', 'Draft', 'summer_sells', 'Anonymous', '{\'Gold\'}', 'Summer Sells', '2024-04-06 12:11:37', 0, 5, 8),
(18, 'Edit Broadcast from Postman2', 'Draft', 'summer_sells', NULL, '{\'Gold\'}', 'Summer Sells', '0000-00-00 00:00:00', 0, 5, 8),
(21, 'Untitle_duplicate', 'Draft', 'summer_sells', 'Anonymous', '{\'Gold\'}', 'Summer Sells', '0000-00-00 00:00:00', 1, 5, 8),
(22, 'Edit Broadcast from Postman2_duplicate', 'Draft', 'summer_sells', NULL, '{\'Gold\'}', 'Summer Sells', '0000-00-00 00:00:00', 1, 5, 8),
(24, 'Tour', '', 'Sea', 'champ', 'Gold', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(25, 'TourSong', '', 'Sea', 'champ', 'Gold', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(26, 'TourSam', '', 'Sea', 'champ', 'Gold', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(27, 'TourSee', '', 'Sea', 'champ', 'Gold,Silver', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(28, 'TourHha', '', 'Sea', 'champ', 'Gold,Silver', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(29, 'TourHok', '', 'Sea', 'champ', 'Gold,Silver', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(31, 'TourJed', '', 'Sea', 'champ', 'Gold,Silver', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(32, 'TourPad', '', 'Sea', 'champ', 'Gold,Silver', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(33, 'TourKhaw', '', 'Sea', 'champ', 'Gold,Silver', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10),
(34, 'TourSib', '', 'Sea', 'champ', 'Gold,Silver', 'Summer Tour', '0000-00-00 00:00:00', 0, 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `broadcast_customer`
--

CREATE TABLE `broadcast_customer` (
  `BCID` bigint(20) NOT NULL,
  `BID` bigint(20) DEFAULT NULL,
  `CusID` bigint(20) DEFAULT NULL,
  `BCDatetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `broadcast_customer`
--

INSERT INTO `broadcast_customer` (`BCID`, `BID`, `CusID`, `BCDatetime`) VALUES
(1, 2, 2, '2024-04-18 21:57:58'),
(2, 28, 1, '2024-04-18 21:57:58'),
(3, 28, 3, '2024-04-18 21:57:58'),
(4, 28, 13, '2024-04-18 21:57:58'),
(5, 28, 15, '2024-04-18 21:57:58'),
(6, 28, 16, '2024-04-18 21:57:58'),
(9, 32, 1, '2024-04-18 21:57:58'),
(10, 32, 3, '2024-04-18 21:57:58'),
(11, 32, 13, '2024-04-18 21:57:58'),
(12, 32, 15, '2024-04-18 21:57:58'),
(13, 32, 16, '2024-04-18 21:57:58'),
(16, 33, 13, '2024-04-18 21:57:58'),
(17, 33, 15, '2024-04-18 21:57:58'),
(18, 33, 16, '2024-04-18 21:57:58'),
(19, 34, 13, '2024-04-18 21:57:58'),
(20, 34, 16, '2024-04-18 21:57:58');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CusID` bigint(20) NOT NULL,
  `CusName` varchar(50) NOT NULL,
  `CusEmail` varchar(50) NOT NULL,
  `CusLevel` enum('Silver','Gold','Platinum','Diamond') NOT NULL,
  `CusUpdate` datetime DEFAULT current_timestamp(),
  `CusIsDelete` tinyint(1) NOT NULL DEFAULT 0,
  `AID` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CusID`, `CusName`, `CusEmail`, `CusLevel`, `CusUpdate`, `CusIsDelete`, `AID`) VALUES
(1, 'Skoon', 'sknowk@gmail.com', 'Gold', '2024-04-05 16:44:11', 0, 1),
(2, 'Chaomop', 'chchamp@gmail.com', 'Platinum', '2024-04-05 16:44:52', 0, 1),
(3, 'Boboss', 'bobob@gmail.com', 'Gold', '2024-04-05 16:45:23', 0, 2),
(11, 'Customer from Postman', 'cusfromPost@gmail.com', 'Diamond', NULL, 1, 8),
(12, 'Edit Customer from Postman2', 'cusfromPost@gmail.com', 'Platinum', '2024-04-06 16:34:30', 1, 8),
(13, 'Nong', 'champ@gmail.com', 'Gold', '2024-04-18 18:15:06', 0, 10),
(14, 'Mon', 'champ@gmail.com', 'Diamond', '2024-04-18 18:15:29', 0, 10),
(15, 'Ui', 'champ@gmail.com', 'Silver', '2024-04-18 18:15:44', 1, 10),
(16, 'Eww', 'champ@gmail.com', 'Silver', '2024-04-18 18:15:55', 0, 10),
(17, 'Beam', 'champ@gmail.com', 'Platinum', '2024-04-18 18:16:28', 0, 10);

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `TID` bigint(20) NOT NULL,
  `TName` varchar(50) NOT NULL DEFAULT 'Untitle',
  `TContent` longtext NOT NULL,
  `TIsDelete` tinyint(1) NOT NULL DEFAULT 0,
  `AID` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` (`TID`, `TName`, `TContent`, `TIsDelete`, `AID`) VALUES
(1, 'template 1', '<html>\r\nxxxx\r\n</html>', 0, 1),
(2, 'template 2', '<html>\r\nxxxx\r\n</html>\r\n', 0, 2),
(5, 'Template on postman', '<html>xxxx</html>', 0, 8),
(6, 'Template on postman2', '<html>xxxx</html>', 0, 8),
(7, 'Edit template from Postman', '<http>\nchanged-content\n</http>', 1, 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`AID`),
  ADD UNIQUE KEY `AUsername` (`AUsername`);

--
-- Indexes for table `broadcasts`
--
ALTER TABLE `broadcasts`
  ADD PRIMARY KEY (`BID`),
  ADD UNIQUE KEY `BName` (`BName`),
  ADD KEY `FK_broadcasts_templates` (`TID`),
  ADD KEY `FK_broadcasts_admins` (`AID`);

--
-- Indexes for table `broadcast_customer`
--
ALTER TABLE `broadcast_customer`
  ADD PRIMARY KEY (`BCID`),
  ADD KEY `FK__broadcasts` (`BID`),
  ADD KEY `FK__customers` (`CusID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CusID`),
  ADD KEY `FK_customers_admins` (`AID`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`TID`),
  ADD UNIQUE KEY `TName` (`TName`),
  ADD KEY `FK_templates_admins` (`AID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `AID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `broadcasts`
--
ALTER TABLE `broadcasts`
  MODIFY `BID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `broadcast_customer`
--
ALTER TABLE `broadcast_customer`
  MODIFY `BCID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CusID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `TID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `broadcasts`
--
ALTER TABLE `broadcasts`
  ADD CONSTRAINT `FK_broadcasts_admins` FOREIGN KEY (`AID`) REFERENCES `admins` (`AID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_broadcasts_templates` FOREIGN KEY (`TID`) REFERENCES `templates` (`TID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `broadcast_customer`
--
ALTER TABLE `broadcast_customer`
  ADD CONSTRAINT `FK__broadcasts` FOREIGN KEY (`BID`) REFERENCES `broadcasts` (`BID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK__customers` FOREIGN KEY (`CusID`) REFERENCES `customers` (`CusID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `FK_customers_admins` FOREIGN KEY (`AID`) REFERENCES `admins` (`AID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `templates`
--
ALTER TABLE `templates`
  ADD CONSTRAINT `FK_templates_admins` FOREIGN KEY (`AID`) REFERENCES `admins` (`AID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
