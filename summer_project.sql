-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: summer_project
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `AID` bigint NOT NULL AUTO_INCREMENT,
  `AEmail` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `AUsername` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `APassword` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`AID`),
  UNIQUE KEY `AUsername` (`AUsername`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin01@gmail.com','Admin01','12345'),(2,'admin02@gmail.com','Admin02','12345'),(5,'test3@gmail.com','testtest3','$2b$10$cJmbw3AmT3UwLvd3/9102O8cxg7CUcidaSddOjkHbwk'),(6,'test3@gmail.com','testtest4','$2b$10$RW4KKgFhH.QZbrIDamC3oeGfl0V/dlDnlDg8BI0UVmr'),(7,'test3@gmail.com','testtest5','$2b$10$ZVv1Cl0a.WBeFr8iKxm5e.REIvbJi1f2xN5F4GCZG4JST8rCyrKYO'),(8,'EditAdminFromPM2@gmail.com','testtest7','$2b$10$J9ha3lMJP.5VvRssF6gASemnCshq12FR8iWOkhj7D0Kqxyz3v9T8O'),(9,'test3@gmail.com','testtest9','$2b$10$w8x26.PQue7iwAhQs9br4.1kCoq6JbDlc817LsjI.QYM3rHnbGlre'),(10,'champ849245@gmail.com','champ','$2b$10$sZBmq7JqK2SPm2/pbhh4COwiTk4rFwPNvY2q2.my3MuGeTU/7okNa'),(11,'admin03@gmail.com','admin03','$2b$10$EzAazS/.obP/I0mC3hWOLe0zngkqktRG2MNFYhRh6o3.0DTA3rkm.');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `broadcast_customer`
--

DROP TABLE IF EXISTS `broadcast_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `broadcast_customer` (
  `BCID` bigint NOT NULL AUTO_INCREMENT,
  `BID` bigint NOT NULL,
  `CusID` bigint NOT NULL,
  `BCDatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BCID`),
  KEY `FK__broadcasts` (`BID`),
  KEY `FK__customers` (`CusID`),
  CONSTRAINT `FK__broadcasts` FOREIGN KEY (`BID`) REFERENCES `broadcasts` (`BID`),
  CONSTRAINT `FK__customers` FOREIGN KEY (`CusID`) REFERENCES `customers` (`CusID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `broadcast_customer`
--

LOCK TABLES `broadcast_customer` WRITE;
/*!40000 ALTER TABLE `broadcast_customer` DISABLE KEYS */;
INSERT INTO `broadcast_customer` VALUES (18,128,13,'2024-04-19 21:45:47'),(19,128,14,'2024-04-19 21:45:47'),(20,128,16,'2024-04-19 21:45:47'),(21,128,17,'2024-04-19 21:45:47'),(22,129,16,'2024-04-19 21:48:54'),(23,130,13,'2024-04-19 21:49:32'),(24,131,14,'2024-04-19 21:49:58'),(25,131,16,'2024-04-19 21:49:58'),(26,132,14,'2024-04-19 21:50:25'),(27,132,16,'2024-04-19 21:50:25'),(28,132,17,'2024-04-19 21:50:25'),(29,146,13,'2024-04-19 22:11:07'),(30,146,14,'2024-04-19 22:11:07'),(31,146,16,'2024-04-19 22:11:07'),(32,146,17,'2024-04-19 22:11:07');
/*!40000 ALTER TABLE `broadcast_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `broadcasts`
--

DROP TABLE IF EXISTS `broadcasts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `broadcasts` (
  `BID` bigint NOT NULL AUTO_INCREMENT,
  `BName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Untitle',
  `BStatus` enum('Draft','Sent','Schedule') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Draft',
  `BSchedule` date DEFAULT NULL,
  `BTag` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BFrom` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'Anonymous',
  `BRecipient` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `BSubject` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BUpdate` datetime NOT NULL,
  `BIsDelete` tinyint(1) NOT NULL DEFAULT '0',
  `TID` bigint DEFAULT NULL,
  `AID` bigint NOT NULL,
  PRIMARY KEY (`BID`),
  UNIQUE KEY `BName` (`BName`),
  KEY `FK_broadcasts_templates` (`TID`),
  KEY `FK_broadcasts_admins` (`AID`),
  CONSTRAINT `FK_broadcasts_admins` FOREIGN KEY (`AID`) REFERENCES `admins` (`AID`),
  CONSTRAINT `FK_broadcasts_templates` FOREIGN KEY (`TID`) REFERENCES `templates` (`TID`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `broadcasts`
--

LOCK TABLES `broadcasts` WRITE;
/*!40000 ALTER TABLE `broadcasts` DISABLE KEYS */;
INSERT INTO `broadcasts` VALUES (128,'Broadcast Send to everyone test1','Draft',NULL,'summer_sells',NULL,'everyone','Summer Sells','0000-00-00 00:00:00',0,5,11),(129,'Broadcast Send to champ3@gmail.com test2','Draft',NULL,'summer_sells',NULL,'champ3@gmail.com','Summer Sells','0000-00-00 00:00:00',0,5,11),(130,'Broadcast Send to gold level test3','Draft',NULL,'summer_sells',NULL,'gold','Summer Sells','0000-00-00 00:00:00',0,5,11),(131,'Broadcast Send to Silver, Diamond level test3','Draft',NULL,'summer_sells',NULL,'Silver, Diamond','Summer Sells','0000-00-00 00:00:00',0,5,11),(132,'Broadcast Send to Silver, Diamond, Platinum level ','Draft',NULL,'summer_sells',NULL,'Silver, Diamond, Platinum','Summer Sells','0000-00-00 00:00:00',0,5,11),(146,'Broadcast Send to everyone','Draft',NULL,'summer_sells',NULL,'everyone','Summer Sells','0000-00-00 00:00:00',0,5,11);
/*!40000 ALTER TABLE `broadcasts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `CusID` bigint NOT NULL AUTO_INCREMENT,
  `CusName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `CusEmail` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `CusLevel` enum('Silver','Gold','Platinum','Diamond') COLLATE utf8mb4_general_ci NOT NULL,
  `CusUpdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `CusIsDelete` tinyint(1) NOT NULL DEFAULT '0',
  `AID` bigint NOT NULL,
  PRIMARY KEY (`CusID`),
  KEY `FK_customers_admins` (`AID`),
  CONSTRAINT `FK_customers_admins` FOREIGN KEY (`AID`) REFERENCES `admins` (`AID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Skoon','sknowk@gmail.com','Gold','2024-04-05 16:44:11',0,11),(2,'Chaomop','chchamp@gmail.com','Platinum','2024-04-05 16:44:52',0,11),(3,'Boboss','bobob@gmail.com','Gold','2024-04-05 16:45:23',0,11),(11,'Customer from Postman','cusfromPost@gmail.com','Diamond',NULL,1,11),(12,'Edit Customer from Postman2','cusfromPost@gmail.com','Platinum','2024-04-06 16:34:30',1,11),(13,'Nong','champ@gmail.com','Gold','2024-04-18 18:15:06',0,11),(14,'Mon','champ1@gmail.com','Diamond','2024-04-18 18:15:29',0,11),(15,'Ui','champ2@gmail.com','Silver','2024-04-18 18:15:44',1,11),(16,'Eww','champ3@gmail.com','Silver','2024-04-18 18:15:55',0,11),(17,'Beam','champ4@gmail.com','Platinum','2024-04-18 18:16:28',0,11);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `templates` (
  `TID` bigint NOT NULL AUTO_INCREMENT,
  `TName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Untitle',
  `TContent` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `TIsDelete` tinyint(1) NOT NULL DEFAULT '0',
  `AID` bigint NOT NULL,
  PRIMARY KEY (`TID`),
  UNIQUE KEY `TName` (`TName`),
  KEY `FK_templates_admins` (`AID`),
  CONSTRAINT `FK_templates_admins` FOREIGN KEY (`AID`) REFERENCES `admins` (`AID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (1,'template 1','<html>\r\nxxxx\r\n</html>',0,11),(2,'template 2','<html>\r\nxxxx\r\n</html>\r\n',0,11),(5,'Template on postman','<html>xxxx</html>',0,11),(6,'Template on postman2','<html>xxxx</html>',0,11),(7,'Edit template from Postman','<http>\nchanged-content\n</http>',1,11);
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-05 16:25:08
