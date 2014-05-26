-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Lun 26 Mai 2014 à 20:57
-- Version du serveur: 5.5.35
-- Version de PHP: 5.4.4-14+deb7u9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `lychee`
--

-- --------------------------------------------------------

--
-- Structure de la table `lychee_albums`
--

CREATE TABLE IF NOT EXISTS `lychee_albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(1000) DEFAULT '',
  `sysdate` varchar(10) NOT NULL,
  `public` tinyint(1) DEFAULT '0',
  `password` varchar(100) DEFAULT '',
  `type` enum('name','color','size') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=64 ;

--
-- Contenu de la table `lychee_albums`
--

INSERT INTO `lychee_albums` (`id`, `title`, `description`, `sysdate`, `public`, `password`, `type`) VALUES
(1, 'petit', 'Dossier regroupant les oiseaux de petite taille', '21.05.2014', 1, '', 'size'),
(2, 'moyen', 'Dossier regroupant les oiseaux de taille moyenne', '21.05.2014', 1, '', 'size'),
(3, 'grand', 'Dossier regroupant les oiseaux de grande taille', '21.05.2014', 1, '', 'size');

-- --------------------------------------------------------

--
-- Structure de la table `lychee_photos`
--

CREATE TABLE IF NOT EXISTS `lychee_photos` (
  `id` bigint(14) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(1000) DEFAULT '',
  `url` varchar(100) NOT NULL,
  `color` varchar(20) CHARACTER SET utf8 NOT NULL,
  `birdsize` varchar(20) NOT NULL,
  `public` tinyint(1) NOT NULL,
  `type` varchar(10) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `size` varchar(20) NOT NULL,
  `sysdate` varchar(10) NOT NULL,
  `systime` varchar(8) NOT NULL,
  `iso` varchar(15) NOT NULL,
  `aperture` varchar(20) NOT NULL,
  `make` varchar(20) NOT NULL,
  `model` varchar(50) NOT NULL,
  `shutter` varchar(30) NOT NULL,
  `focal` varchar(20) NOT NULL,
  `takedate` varchar(20) NOT NULL,
  `taketime` varchar(8) NOT NULL,
  `star` tinyint(1) NOT NULL,
  `thumbUrl` varchar(50) NOT NULL,
  `album` varchar(30) NOT NULL DEFAULT '0',
  `import_name` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `lychee_rasp`
--

CREATE TABLE IF NOT EXISTS `lychee_rasp` (
  `id_rasp` int(11) NOT NULL AUTO_INCREMENT,
  `adresse` varchar(20) NOT NULL,
  `etat` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_rasp`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Structure de la table `lychee_settings`
--

CREATE TABLE IF NOT EXISTS `lychee_settings` (
  `key` varchar(50) NOT NULL DEFAULT '',
  `value` varchar(50) DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `lychee_settings`
--

INSERT INTO `lychee_settings` (`key`, `value`) VALUES
('username', 'colibri'),
('password', '6a2ab29bcea0d3e2f708dac9129597f5'),
('thumbQuality', '90'),
('checkForUpdates', '1'),
('sorting', 'ORDER BY title ASC'),
('folder', 'name');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
