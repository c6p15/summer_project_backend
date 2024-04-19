-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2024 at 05:28 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

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
(128, 'Broadcast Send to everyone test1', '', 'summer_sells', NULL, 'everyone', 'Summer Sells', '0000-00-00 00:00:00', 0, 5, 8),
(129, 'Broadcast Send to champ3@gmail.com test2', '', 'summer_sells', NULL, 'champ3@gmail.com', 'Summer Sells', '0000-00-00 00:00:00', 0, 5, 8),
(130, 'Broadcast Send to gold level test3', '', 'summer_sells', NULL, 'gold', 'Summer Sells', '0000-00-00 00:00:00', 0, 5, 8),
(131, 'Broadcast Send to Silver, Diamond level test3', '', 'summer_sells', NULL, 'Silver, Diamond', 'Summer Sells', '0000-00-00 00:00:00', 0, 5, 8),
(132, 'Broadcast Send to Silver, Diamond, Platinum level ', '', 'summer_sells', NULL, 'Silver, Diamond, Platinum', 'Summer Sells', '0000-00-00 00:00:00', 0, 5, 8),
(146, 'Broadcast Send to everyone', '', 'summer_sells', NULL, 'everyone', 'Summer Sells', '0000-00-00 00:00:00', 0, 5, 8);

-- --------------------------------------------------------

--
-- Table structure for table `broadcast_customer`
--

CREATE TABLE `broadcast_customer` (
  `BCID` bigint(20) NOT NULL,
  `BID` bigint(20) NOT NULL,
  `CusID` bigint(20) NOT NULL,
  `BCDatetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `broadcast_customer`
--

INSERT INTO `broadcast_customer` (`BCID`, `BID`, `CusID`, `BCDatetime`) VALUES
(18, 128, 13, '2024-04-19 21:45:47'),
(19, 128, 14, '2024-04-19 21:45:47'),
(20, 128, 16, '2024-04-19 21:45:47'),
(21, 128, 17, '2024-04-19 21:45:47'),
(22, 129, 16, '2024-04-19 21:48:54'),
(23, 130, 13, '2024-04-19 21:49:32'),
(24, 131, 14, '2024-04-19 21:49:58'),
(25, 131, 16, '2024-04-19 21:49:58'),
(26, 132, 14, '2024-04-19 21:50:25'),
(27, 132, 16, '2024-04-19 21:50:25'),
(28, 132, 17, '2024-04-19 21:50:25'),
(29, 146, 13, '2024-04-19 22:11:07'),
(30, 146, 14, '2024-04-19 22:11:07'),
(31, 146, 16, '2024-04-19 22:11:07'),
(32, 146, 17, '2024-04-19 22:11:07');

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
(13, 'Nong', 'champ@gmail.com', 'Gold', '2024-04-18 18:15:06', 0, 8),
(14, 'Mon', 'champ1@gmail.com', 'Diamond', '2024-04-18 18:15:29', 0, 8),
(15, 'Ui', 'champ2@gmail.com', 'Silver', '2024-04-18 18:15:44', 1, 8),
(16, 'Eww', 'champ3@gmail.com', 'Silver', '2024-04-18 18:15:55', 0, 8),
(17, 'Beam', 'champ4@gmail.com', 'Platinum', '2024-04-18 18:16:28', 0, 8);

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
  MODIFY `BID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `broadcast_customer`
--
ALTER TABLE `broadcast_customer`
  MODIFY `BCID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
