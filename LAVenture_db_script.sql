-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: aa1bsd9i8xumf8s.ccwudqpljmzy.us-east-2.rds.amazonaws.com    Database: ebdb
-- ------------------------------------------------------
-- Server version	8.0.20
CREATE database test;
USE test;

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `Activities`
--

DROP TABLE IF EXISTS `Activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Activities` (
  `ActivityID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(30) NOT NULL,
  `Title` varchar(50) NOT NULL,
  `Image` longtext,
  `Description` varchar(350) NOT NULL,
  `Longitude` double NOT NULL,
  `Latitude` double NOT NULL,
  `Town` varchar(256) NOT NULL,
  `Rating` double NOT NULL,
  `RatingCount` int NOT NULL,
  `RSVPCount` int NOT NULL,
  `MaxRSVPs` int NOT NULL,
  `Adventure` tinyint(1) NOT NULL,
  `Beach` tinyint(1) NOT NULL,
  `Books` tinyint(1) NOT NULL,
  `Entertainment` tinyint(1) NOT NULL,
  `Exercise` tinyint(1) NOT NULL,
  `Games` tinyint(1) NOT NULL,
  `Music` tinyint(1) NOT NULL,
  `NightLife` tinyint(1) NOT NULL,
  `Outdoors` tinyint(1) NOT NULL,
  `Relax` tinyint(1) NOT NULL,
  `Shopping` tinyint(1) NOT NULL,
  `Sports` tinyint(1) NOT NULL,
  `Time` varchar(20) NOT NULL,
  `Date` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ActivityID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `RSVPs`
--

DROP TABLE IF EXISTS `RSVPs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RSVPs` (
  `RSVPID` int NOT NULL AUTO_INCREMENT,
  `ActivityID` int NOT NULL,
  `UserID` int NOT NULL,
  `QueuePos` int NOT NULL,
  PRIMARY KEY (`RSVPID`),
  KEY `fk1` (`ActivityID`),
  KEY `fk2` (`UserID`),
  CONSTRAINT `RSVPs_ibfk_1` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`),
  CONSTRAINT `RSVPs_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reviews` (
  `ReviewNum` int NOT NULL AUTO_INCREMENT,
  `ActivityID` int NOT NULL,
  `UserID` int NOT NULL,
  `RatingVal` double NOT NULL,
  `ReviewText` varchar(350) NOT NULL,
  PRIMARY KEY (`ReviewNum`),
  KEY `fk1` (`ActivityID`),
  KEY `fk2` (`UserID`),
  CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`ActivityID`) REFERENCES `Activities` (`ActivityID`),
  CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Password` varchar(64) DEFAULT NULL,
  `FacebookUser` tinyint(1) NOT NULL,
  `ActivityID1` int DEFAULT NULL,
  `ActivityID2` int DEFAULT NULL,
  `ActivityID3` int DEFAULT NULL,
  `ActivityID4` int DEFAULT NULL,
  `ActivityID5` int DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  KEY `fk1` (`ActivityID1`),
  KEY `fk2` (`ActivityID2`),
  KEY `fk3` (`ActivityID3`),
  KEY `fk4` (`ActivityID4`),
  KEY `fk5` (`ActivityID5`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-28 22:29:54
