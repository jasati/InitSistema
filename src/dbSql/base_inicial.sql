-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 27-Jun-2017 às 15:51
-- Versão do servidor: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `base_inicial`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `empresas`
--

CREATE TABLE IF NOT EXISTS `empresas` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `cpf_cnpj` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `endereco` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `responsavel` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `data_cad` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cel` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL,
  `tel1` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tel2` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `slogan` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cidade` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_galeria` int(11) DEFAULT NULL,
  `fantasia` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cad_confirm` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Campo que identifica o codigo de confirmação do cadastro no getResponse. o valor é o id do contato no getResponse',
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `cpf_cnpj` (`cpf_cnpj`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=31 ;

--
-- Extraindo dados da tabela `empresas`
--

INSERT INTO `empresas` (`id_empresa`, `nome`, `cpf_cnpj`, `endereco`, `responsavel`, `data_cad`, `email`, `cel`, `status`, `tel1`, `tel2`, `slogan`, `cidade`, `id_galeria`, `fantasia`, `estado`, `cad_confirm`) VALUES
(1, 'Teste', '11.111.225/0001', 'Rua Teste', 'Teste', '2016-08-31 14:07:06', 'teste@teste.com', '99556622', 1, '3262553585', '32625585', 'Empresa teste', 'Conceição do Coité', 43, 'Novo', 'BA', '5vas2'),
(21, 'Jasati', '98247387549', 'teste', 'alan', '2017-03-01 08:09:25', 'jalan.alves@gmail.com', NULL, 1, '8888888888888', NULL, NULL, 'coite', NULL, 'Jasati', 'BA', 'jalan.alves@gmail.com'),
(28, 'Empresa', '65285465', NULL, 'emp', '2017-04-03 17:36:46', 'emp@email.com', NULL, 1, NULL, NULL, NULL, 'coite', NULL, 'teste', 'BA', '5vas2'),
(30, 'loja Locdress', '985258545', 'teste', 'locdress', '2017-05-17 13:48:08', 'teste@email.com', '982585', 1, NULL, NULL, 'teste', 'teste', NULL, 'locdress', 'CE', 'teste@email.com');

-- --------------------------------------------------------

--
-- Estrutura da tabela `modulos`
--

CREATE TABLE IF NOT EXISTS `modulos` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `id_mg` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_modulo`),
  KEY `id_mg` (`id_mg`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=25 ;

--
-- Extraindo dados da tabela `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nome`, `id_mg`) VALUES
(1, 'Acesso ao modulo de usuários', 1),
(2, 'Permitir incluir novos usuários', 1),
(3, 'Permitir alterar usuários', 1),
(4, 'Permitir excluir usuários', 1),
(5, 'Acesso ao perfil dos usuários', 1),
(6, 'Acesso ao modulo de configurações', 2),
(7, 'Acesso ao modulo de trajes', 3),
(8, 'Permitir cadastrar novo traje', 3),
(9, 'Permitir alterar traje', 3),
(10, 'Permitir excluir traje', 3),
(11, 'Permitir cadastrar categorias', 3),
(12, 'Permitir cadastrar subcategorias', 3),
(13, 'Acesso ao modulo de clientes', 4),
(14, 'Permitir cadastrar novo cliente', 4),
(15, 'Permitir alterar cliente', 4),
(16, 'Permitir excluir cliente', 4),
(17, 'Acesso ao modulo de reservas de trajes', 5),
(18, 'Permitir reservar traje', 5),
(19, 'Acesso ao modulo de recebimentos', 6),
(20, 'Permitir fazer recebimentos avulso', 6),
(21, 'Permitir alterar recebimentos', 6),
(22, 'Permitir excluir recebimentos', 6),
(23, 'Permitir alterar reservas', 5),
(24, 'Permitir excluir reservas', 5);

-- --------------------------------------------------------

--
-- Estrutura da tabela `modulos_grupo`
--

CREATE TABLE IF NOT EXISTS `modulos_grupo` (
  `id_mg` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id_mg`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `modulos_grupo`
--

INSERT INTO `modulos_grupo` (`id_mg`, `descricao`) VALUES
(1, 'Usuarios'),
(2, 'Configurações'),
(3, 'Trajes'),
(4, 'Clientes'),
(5, 'Reservas'),
(6, 'Recebimentos');

-- --------------------------------------------------------

--
-- Estrutura da tabela `perfils`
--

CREATE TABLE IF NOT EXISTS `perfils` (
  `id_perfil` int(11) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(11) NOT NULL,
  `nome` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id_perfil`),
  KEY `id_prefeitura` (`id_empresa`),
  KEY `id_empresa` (`id_empresa`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=51 ;

--
-- Extraindo dados da tabela `perfils`
--

INSERT INTO `perfils` (`id_perfil`, `id_empresa`, `nome`) VALUES
(1, 1, 'Administrador'),
(2, 1, 'Operador'),
(31, 21, 'Administrador'),
(32, 21, 'Operador'),
(45, 28, 'Operador'),
(46, 28, 'Administrador'),
(49, 30, 'Operador'),
(50, 30, 'Administrador');

-- --------------------------------------------------------

--
-- Estrutura da tabela `perfil_modulos`
--

CREATE TABLE IF NOT EXISTS `perfil_modulos` (
  `id_pm` int(11) NOT NULL AUTO_INCREMENT,
  `id_modulo` int(11) NOT NULL,
  `id_perfil` int(11) NOT NULL,
  PRIMARY KEY (`id_pm`),
  KEY `id_prefeitura` (`id_modulo`,`id_perfil`),
  KEY `id_modulo` (`id_modulo`),
  KEY `id_perfil` (`id_perfil`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=992 ;

--
-- Extraindo dados da tabela `perfil_modulos`
--

INSERT INTO `perfil_modulos` (`id_pm`, `id_modulo`, `id_perfil`) VALUES
(35, 1, 0),
(1, 1, 1),
(68, 1, 6),
(101, 1, 7),
(134, 1, 9),
(167, 1, 11),
(200, 1, 13),
(233, 1, 15),
(266, 1, 17),
(301, 1, 20),
(333, 1, 21),
(365, 1, 23),
(398, 1, 25),
(431, 1, 27),
(467, 1, 29),
(501, 1, 31),
(530, 1, 33),
(662, 1, 33),
(563, 1, 35),
(695, 1, 35),
(729, 1, 36),
(596, 1, 37),
(770, 1, 38),
(629, 1, 39),
(803, 1, 40),
(836, 1, 42),
(869, 1, 44),
(894, 1, 46),
(927, 1, 48),
(960, 1, 50),
(36, 2, 0),
(4, 2, 1),
(70, 2, 6),
(104, 2, 7),
(136, 2, 9),
(168, 2, 11),
(202, 2, 13),
(234, 2, 15),
(268, 2, 17),
(302, 2, 20),
(335, 2, 21),
(366, 2, 23),
(400, 2, 25),
(432, 2, 27),
(469, 2, 29),
(503, 2, 31),
(532, 2, 33),
(663, 2, 33),
(566, 2, 35),
(697, 2, 35),
(731, 2, 36),
(598, 2, 37),
(771, 2, 38),
(631, 2, 39),
(804, 2, 40),
(837, 2, 42),
(870, 2, 44),
(895, 2, 46),
(928, 2, 48),
(962, 2, 50),
(37, 3, 0),
(5, 3, 1),
(72, 3, 6),
(106, 3, 7),
(138, 3, 9),
(169, 3, 11),
(204, 3, 13),
(235, 3, 15),
(270, 3, 17),
(304, 3, 20),
(337, 3, 21),
(367, 3, 23),
(402, 3, 25),
(433, 3, 27),
(470, 3, 29),
(505, 3, 31),
(534, 3, 33),
(664, 3, 33),
(567, 3, 35),
(699, 3, 35),
(734, 3, 36),
(600, 3, 37),
(772, 3, 38),
(633, 3, 39),
(805, 3, 40),
(838, 3, 42),
(871, 3, 44),
(897, 3, 46),
(930, 3, 48),
(964, 3, 50),
(38, 4, 0),
(6, 4, 1),
(74, 4, 6),
(108, 4, 7),
(140, 4, 9),
(171, 4, 11),
(205, 4, 13),
(236, 4, 15),
(272, 4, 17),
(306, 4, 20),
(339, 4, 21),
(368, 4, 23),
(404, 4, 25),
(434, 4, 27),
(472, 4, 29),
(507, 4, 31),
(536, 4, 33),
(665, 4, 33),
(569, 4, 35),
(701, 4, 35),
(737, 4, 36),
(602, 4, 37),
(773, 4, 38),
(635, 4, 39),
(806, 4, 40),
(839, 4, 42),
(872, 4, 44),
(899, 4, 46),
(933, 4, 48),
(965, 4, 50),
(39, 5, 0),
(2, 5, 1),
(76, 5, 6),
(110, 5, 7),
(142, 5, 9),
(173, 5, 11),
(207, 5, 13),
(237, 5, 15),
(274, 5, 17),
(308, 5, 20),
(341, 5, 21),
(369, 5, 23),
(406, 5, 25),
(435, 5, 27),
(474, 5, 29),
(509, 5, 31),
(538, 5, 33),
(666, 5, 33),
(571, 5, 35),
(703, 5, 35),
(739, 5, 36),
(604, 5, 37),
(774, 5, 38),
(637, 5, 39),
(807, 5, 40),
(840, 5, 42),
(873, 5, 44),
(901, 5, 46),
(934, 5, 48),
(967, 5, 50),
(40, 6, 0),
(7, 6, 1),
(78, 6, 6),
(112, 6, 7),
(144, 6, 9),
(175, 6, 11),
(209, 6, 13),
(238, 6, 15),
(276, 6, 17),
(310, 6, 20),
(343, 6, 21),
(370, 6, 23),
(408, 6, 25),
(436, 6, 27),
(476, 6, 29),
(511, 6, 31),
(540, 6, 33),
(667, 6, 33),
(573, 6, 35),
(705, 6, 35),
(740, 6, 36),
(606, 6, 37),
(775, 6, 38),
(639, 6, 39),
(808, 6, 40),
(841, 6, 42),
(874, 6, 44),
(903, 6, 46),
(936, 6, 48),
(969, 6, 50),
(41, 7, 0),
(59, 7, 0),
(8, 7, 1),
(26, 7, 2),
(69, 7, 5),
(80, 7, 6),
(114, 7, 7),
(102, 7, 8),
(146, 7, 9),
(135, 7, 10),
(177, 7, 11),
(170, 7, 12),
(211, 7, 13),
(201, 7, 14),
(239, 7, 15),
(240, 7, 16),
(278, 7, 17),
(267, 7, 18),
(299, 7, 19),
(313, 7, 20),
(345, 7, 21),
(332, 7, 22),
(371, 7, 23),
(373, 7, 24),
(410, 7, 25),
(399, 7, 26),
(438, 7, 27),
(437, 7, 28),
(478, 7, 29),
(464, 7, 30),
(512, 7, 31),
(497, 7, 32),
(542, 7, 33),
(668, 7, 33),
(531, 7, 34),
(675, 7, 34),
(575, 7, 35),
(707, 7, 35),
(728, 7, 35),
(564, 7, 36),
(696, 7, 36),
(742, 7, 36),
(608, 7, 37),
(761, 7, 37),
(597, 7, 38),
(776, 7, 38),
(641, 7, 39),
(794, 7, 39),
(630, 7, 40),
(809, 7, 40),
(827, 7, 41),
(842, 7, 42),
(860, 7, 43),
(875, 7, 44),
(893, 7, 45),
(905, 7, 46),
(926, 7, 47),
(938, 7, 48),
(959, 7, 49),
(971, 7, 50),
(42, 8, 0),
(9, 8, 1),
(82, 8, 6),
(116, 8, 7),
(148, 8, 9),
(179, 8, 11),
(214, 8, 13),
(241, 8, 15),
(280, 8, 17),
(314, 8, 20),
(347, 8, 21),
(372, 8, 23),
(412, 8, 25),
(440, 8, 27),
(480, 8, 29),
(513, 8, 31),
(544, 8, 33),
(669, 8, 33),
(577, 8, 35),
(709, 8, 35),
(743, 8, 36),
(610, 8, 37),
(777, 8, 38),
(643, 8, 39),
(810, 8, 40),
(843, 8, 42),
(876, 8, 44),
(907, 8, 46),
(940, 8, 48),
(973, 8, 50),
(43, 9, 0),
(10, 9, 1),
(85, 9, 6),
(118, 9, 7),
(150, 9, 9),
(181, 9, 11),
(215, 9, 13),
(243, 9, 15),
(282, 9, 17),
(316, 9, 20),
(349, 9, 21),
(374, 9, 23),
(414, 9, 25),
(442, 9, 27),
(481, 9, 29),
(514, 9, 31),
(546, 9, 33),
(670, 9, 33),
(579, 9, 35),
(711, 9, 35),
(745, 9, 36),
(612, 9, 37),
(778, 9, 38),
(645, 9, 39),
(811, 9, 40),
(844, 9, 42),
(877, 9, 44),
(909, 9, 46),
(942, 9, 48),
(975, 9, 50),
(44, 10, 0),
(11, 10, 1),
(86, 10, 6),
(119, 10, 7),
(152, 10, 9),
(183, 10, 11),
(217, 10, 13),
(245, 10, 15),
(284, 10, 17),
(317, 10, 20),
(350, 10, 21),
(376, 10, 23),
(416, 10, 25),
(444, 10, 27),
(482, 10, 29),
(515, 10, 31),
(548, 10, 33),
(671, 10, 33),
(581, 10, 35),
(712, 10, 35),
(746, 10, 36),
(614, 10, 37),
(779, 10, 38),
(647, 10, 39),
(812, 10, 40),
(845, 10, 42),
(878, 10, 44),
(911, 10, 46),
(944, 10, 48),
(977, 10, 50),
(45, 11, 0),
(12, 11, 1),
(87, 11, 6),
(120, 11, 7),
(153, 11, 9),
(185, 11, 11),
(219, 11, 13),
(247, 11, 15),
(285, 11, 17),
(318, 11, 20),
(351, 11, 21),
(378, 11, 23),
(417, 11, 25),
(446, 11, 27),
(483, 11, 29),
(516, 11, 31),
(549, 11, 33),
(672, 11, 33),
(582, 11, 35),
(714, 11, 35),
(747, 11, 36),
(615, 11, 37),
(780, 11, 38),
(648, 11, 39),
(813, 11, 40),
(846, 11, 42),
(879, 11, 44),
(912, 11, 46),
(945, 11, 48),
(978, 11, 50),
(46, 12, 0),
(13, 12, 1),
(88, 12, 6),
(121, 12, 7),
(154, 12, 9),
(187, 12, 11),
(220, 12, 13),
(249, 12, 15),
(286, 12, 17),
(319, 12, 20),
(352, 12, 21),
(380, 12, 23),
(418, 12, 25),
(449, 12, 27),
(484, 12, 29),
(517, 12, 31),
(550, 12, 33),
(673, 12, 33),
(583, 12, 35),
(715, 12, 35),
(748, 12, 36),
(616, 12, 37),
(781, 12, 38),
(649, 12, 39),
(814, 12, 40),
(847, 12, 42),
(880, 12, 44),
(913, 12, 46),
(946, 12, 48),
(979, 12, 50),
(47, 13, 0),
(60, 13, 0),
(14, 13, 1),
(27, 13, 2),
(71, 13, 5),
(89, 13, 6),
(122, 13, 7),
(103, 13, 8),
(155, 13, 9),
(137, 13, 10),
(188, 13, 11),
(172, 13, 12),
(221, 13, 13),
(203, 13, 14),
(251, 13, 15),
(242, 13, 16),
(287, 13, 17),
(269, 13, 18),
(300, 13, 19),
(320, 13, 20),
(353, 13, 21),
(334, 13, 22),
(382, 13, 23),
(375, 13, 24),
(419, 13, 25),
(401, 13, 26),
(451, 13, 27),
(439, 13, 28),
(485, 13, 29),
(465, 13, 30),
(518, 13, 31),
(498, 13, 32),
(551, 13, 33),
(674, 13, 33),
(533, 13, 34),
(677, 13, 34),
(584, 13, 35),
(716, 13, 35),
(730, 13, 35),
(565, 13, 36),
(698, 13, 36),
(749, 13, 36),
(617, 13, 37),
(762, 13, 37),
(599, 13, 38),
(782, 13, 38),
(650, 13, 39),
(795, 13, 39),
(632, 13, 40),
(815, 13, 40),
(828, 13, 41),
(848, 13, 42),
(861, 13, 43),
(881, 13, 44),
(896, 13, 45),
(914, 13, 46),
(929, 13, 47),
(947, 13, 48),
(961, 13, 49),
(980, 13, 50),
(48, 14, 0),
(61, 14, 0),
(15, 14, 1),
(28, 14, 2),
(73, 14, 5),
(90, 14, 6),
(123, 14, 7),
(105, 14, 8),
(156, 14, 9),
(139, 14, 10),
(189, 14, 11),
(174, 14, 12),
(222, 14, 13),
(206, 14, 14),
(253, 14, 15),
(244, 14, 16),
(288, 14, 17),
(271, 14, 18),
(303, 14, 19),
(321, 14, 20),
(354, 14, 21),
(336, 14, 22),
(384, 14, 23),
(377, 14, 24),
(420, 14, 25),
(403, 14, 26),
(453, 14, 27),
(441, 14, 28),
(486, 14, 29),
(466, 14, 30),
(519, 14, 31),
(499, 14, 32),
(552, 14, 33),
(676, 14, 33),
(535, 14, 34),
(680, 14, 34),
(585, 14, 35),
(717, 14, 35),
(732, 14, 35),
(568, 14, 36),
(700, 14, 36),
(750, 14, 36),
(618, 14, 37),
(763, 14, 37),
(601, 14, 38),
(783, 14, 38),
(651, 14, 39),
(796, 14, 39),
(634, 14, 40),
(816, 14, 40),
(829, 14, 41),
(849, 14, 42),
(862, 14, 43),
(882, 14, 44),
(898, 14, 45),
(915, 14, 46),
(931, 14, 47),
(948, 14, 48),
(963, 14, 49),
(981, 14, 50),
(49, 15, 0),
(62, 15, 0),
(16, 15, 1),
(29, 15, 2),
(75, 15, 5),
(91, 15, 6),
(124, 15, 7),
(107, 15, 8),
(157, 15, 9),
(141, 15, 10),
(190, 15, 11),
(176, 15, 12),
(223, 15, 13),
(208, 15, 14),
(255, 15, 15),
(246, 15, 16),
(289, 15, 17),
(273, 15, 18),
(305, 15, 19),
(322, 15, 20),
(355, 15, 21),
(338, 15, 22),
(386, 15, 23),
(379, 15, 24),
(421, 15, 25),
(405, 15, 26),
(454, 15, 27),
(443, 15, 28),
(487, 15, 29),
(468, 15, 30),
(520, 15, 31),
(500, 15, 32),
(553, 15, 33),
(678, 15, 33),
(537, 15, 34),
(682, 15, 34),
(586, 15, 35),
(718, 15, 35),
(733, 15, 35),
(570, 15, 36),
(702, 15, 36),
(751, 15, 36),
(619, 15, 37),
(764, 15, 37),
(603, 15, 38),
(784, 15, 38),
(652, 15, 39),
(797, 15, 39),
(636, 15, 40),
(817, 15, 40),
(830, 15, 41),
(850, 15, 42),
(863, 15, 43),
(883, 15, 44),
(900, 15, 45),
(916, 15, 46),
(932, 15, 47),
(949, 15, 48),
(966, 15, 49),
(982, 15, 50),
(50, 16, 0),
(17, 16, 1),
(92, 16, 6),
(125, 16, 7),
(158, 16, 9),
(191, 16, 11),
(224, 16, 13),
(257, 16, 15),
(290, 16, 17),
(323, 16, 20),
(356, 16, 21),
(388, 16, 23),
(422, 16, 25),
(455, 16, 27),
(488, 16, 29),
(521, 16, 31),
(554, 16, 33),
(679, 16, 33),
(587, 16, 35),
(719, 16, 35),
(752, 16, 36),
(620, 16, 37),
(785, 16, 38),
(653, 16, 39),
(818, 16, 40),
(851, 16, 42),
(884, 16, 44),
(917, 16, 46),
(950, 16, 48),
(983, 16, 50),
(51, 17, 0),
(63, 17, 0),
(18, 17, 1),
(30, 17, 2),
(77, 17, 5),
(93, 17, 6),
(126, 17, 7),
(109, 17, 8),
(159, 17, 9),
(143, 17, 10),
(192, 17, 11),
(178, 17, 12),
(225, 17, 13),
(210, 17, 14),
(258, 17, 15),
(248, 17, 16),
(291, 17, 17),
(275, 17, 18),
(307, 17, 19),
(324, 17, 20),
(357, 17, 21),
(340, 17, 22),
(390, 17, 23),
(381, 17, 24),
(423, 17, 25),
(407, 17, 26),
(456, 17, 27),
(445, 17, 28),
(489, 17, 29),
(471, 17, 30),
(522, 17, 31),
(502, 17, 32),
(555, 17, 33),
(681, 17, 33),
(539, 17, 34),
(684, 17, 34),
(588, 17, 35),
(720, 17, 35),
(735, 17, 35),
(572, 17, 36),
(704, 17, 36),
(753, 17, 36),
(621, 17, 37),
(765, 17, 37),
(605, 17, 38),
(786, 17, 38),
(654, 17, 39),
(798, 17, 39),
(638, 17, 40),
(819, 17, 40),
(831, 17, 41),
(852, 17, 42),
(864, 17, 43),
(885, 17, 44),
(902, 17, 45),
(918, 17, 46),
(935, 17, 47),
(951, 17, 48),
(968, 17, 49),
(984, 17, 50),
(52, 18, 0),
(64, 18, 0),
(19, 18, 1),
(31, 18, 2),
(79, 18, 5),
(94, 18, 6),
(127, 18, 7),
(111, 18, 8),
(160, 18, 9),
(145, 18, 10),
(193, 18, 11),
(180, 18, 12),
(226, 18, 13),
(212, 18, 14),
(259, 18, 15),
(250, 18, 16),
(292, 18, 17),
(277, 18, 18),
(309, 18, 19),
(325, 18, 20),
(358, 18, 21),
(342, 18, 22),
(391, 18, 23),
(383, 18, 24),
(424, 18, 25),
(409, 18, 26),
(457, 18, 27),
(447, 18, 28),
(490, 18, 29),
(473, 18, 30),
(523, 18, 31),
(504, 18, 32),
(556, 18, 33),
(683, 18, 33),
(541, 18, 34),
(686, 18, 34),
(589, 18, 35),
(721, 18, 35),
(736, 18, 35),
(574, 18, 36),
(706, 18, 36),
(754, 18, 36),
(622, 18, 37),
(766, 18, 37),
(607, 18, 38),
(787, 18, 38),
(655, 18, 39),
(799, 18, 39),
(640, 18, 40),
(820, 18, 40),
(832, 18, 41),
(853, 18, 42),
(865, 18, 43),
(886, 18, 44),
(904, 18, 45),
(919, 18, 46),
(937, 18, 47),
(952, 18, 48),
(970, 18, 49),
(985, 18, 50),
(53, 19, 0),
(65, 19, 0),
(22, 19, 1),
(33, 19, 2),
(81, 19, 5),
(95, 19, 6),
(128, 19, 7),
(113, 19, 8),
(161, 19, 9),
(147, 19, 10),
(194, 19, 11),
(182, 19, 12),
(227, 19, 13),
(213, 19, 14),
(260, 19, 15),
(252, 19, 16),
(293, 19, 17),
(279, 19, 18),
(311, 19, 19),
(326, 19, 20),
(359, 19, 21),
(344, 19, 22),
(392, 19, 23),
(385, 19, 24),
(425, 19, 25),
(411, 19, 26),
(458, 19, 27),
(448, 19, 28),
(491, 19, 29),
(475, 19, 30),
(524, 19, 31),
(506, 19, 32),
(557, 19, 33),
(685, 19, 33),
(543, 19, 34),
(688, 19, 34),
(590, 19, 35),
(722, 19, 35),
(738, 19, 35),
(576, 19, 36),
(708, 19, 36),
(755, 19, 36),
(623, 19, 37),
(767, 19, 37),
(609, 19, 38),
(788, 19, 38),
(656, 19, 39),
(800, 19, 39),
(642, 19, 40),
(821, 19, 40),
(833, 19, 41),
(854, 19, 42),
(866, 19, 43),
(887, 19, 44),
(906, 19, 45),
(920, 19, 46),
(939, 19, 47),
(953, 19, 48),
(972, 19, 49),
(986, 19, 50),
(54, 20, 0),
(66, 20, 0),
(23, 20, 1),
(34, 20, 2),
(83, 20, 5),
(96, 20, 6),
(129, 20, 7),
(115, 20, 8),
(162, 20, 9),
(149, 20, 10),
(195, 20, 11),
(184, 20, 12),
(228, 20, 13),
(216, 20, 14),
(261, 20, 15),
(254, 20, 16),
(294, 20, 17),
(281, 20, 18),
(312, 20, 19),
(327, 20, 20),
(360, 20, 21),
(346, 20, 22),
(393, 20, 23),
(387, 20, 24),
(426, 20, 25),
(413, 20, 26),
(459, 20, 27),
(450, 20, 28),
(492, 20, 29),
(477, 20, 30),
(525, 20, 31),
(508, 20, 32),
(558, 20, 33),
(687, 20, 33),
(545, 20, 34),
(690, 20, 34),
(591, 20, 35),
(723, 20, 35),
(741, 20, 35),
(578, 20, 36),
(710, 20, 36),
(756, 20, 36),
(624, 20, 37),
(768, 20, 37),
(611, 20, 38),
(789, 20, 38),
(657, 20, 39),
(801, 20, 39),
(644, 20, 40),
(822, 20, 40),
(834, 20, 41),
(855, 20, 42),
(867, 20, 43),
(888, 20, 44),
(908, 20, 45),
(921, 20, 46),
(941, 20, 47),
(954, 20, 48),
(974, 20, 49),
(987, 20, 50),
(55, 21, 0),
(24, 21, 1),
(97, 21, 6),
(130, 21, 7),
(163, 21, 9),
(196, 21, 11),
(229, 21, 13),
(262, 21, 15),
(295, 21, 17),
(328, 21, 20),
(361, 21, 21),
(394, 21, 23),
(427, 21, 25),
(460, 21, 27),
(493, 21, 29),
(526, 21, 31),
(559, 21, 33),
(689, 21, 33),
(592, 21, 35),
(724, 21, 35),
(757, 21, 36),
(625, 21, 37),
(790, 21, 38),
(658, 21, 39),
(823, 21, 40),
(856, 21, 42),
(889, 21, 44),
(922, 21, 46),
(955, 21, 48),
(988, 21, 50),
(56, 22, 0),
(25, 22, 1),
(98, 22, 6),
(131, 22, 7),
(164, 22, 9),
(197, 22, 11),
(230, 22, 13),
(263, 22, 15),
(296, 22, 17),
(329, 22, 20),
(362, 22, 21),
(395, 22, 23),
(428, 22, 25),
(461, 22, 27),
(494, 22, 29),
(527, 22, 31),
(560, 22, 33),
(691, 22, 33),
(593, 22, 35),
(725, 22, 35),
(758, 22, 36),
(626, 22, 37),
(791, 22, 38),
(659, 22, 39),
(824, 22, 40),
(857, 22, 42),
(890, 22, 44),
(923, 22, 46),
(956, 22, 48),
(989, 22, 50),
(57, 23, 0),
(67, 23, 0),
(20, 23, 1),
(32, 23, 2),
(84, 23, 5),
(99, 23, 6),
(132, 23, 7),
(117, 23, 8),
(165, 23, 9),
(151, 23, 10),
(198, 23, 11),
(186, 23, 12),
(231, 23, 13),
(218, 23, 14),
(264, 23, 15),
(256, 23, 16),
(297, 23, 17),
(283, 23, 18),
(315, 23, 19),
(330, 23, 20),
(363, 23, 21),
(348, 23, 22),
(396, 23, 23),
(389, 23, 24),
(429, 23, 25),
(415, 23, 26),
(462, 23, 27),
(452, 23, 28),
(495, 23, 29),
(479, 23, 30),
(528, 23, 31),
(510, 23, 32),
(561, 23, 33),
(693, 23, 33),
(547, 23, 34),
(692, 23, 34),
(594, 23, 35),
(726, 23, 35),
(744, 23, 35),
(580, 23, 36),
(713, 23, 36),
(759, 23, 36),
(627, 23, 37),
(769, 23, 37),
(613, 23, 38),
(792, 23, 38),
(660, 23, 39),
(802, 23, 39),
(646, 23, 40),
(825, 23, 40),
(835, 23, 41),
(858, 23, 42),
(868, 23, 43),
(891, 23, 44),
(910, 23, 45),
(924, 23, 46),
(943, 23, 47),
(957, 23, 48),
(976, 23, 49),
(990, 23, 50),
(58, 24, 0),
(21, 24, 1),
(100, 24, 6),
(133, 24, 7),
(166, 24, 9),
(199, 24, 11),
(232, 24, 13),
(265, 24, 15),
(298, 24, 17),
(331, 24, 20),
(364, 24, 21),
(397, 24, 23),
(430, 24, 25),
(463, 24, 27),
(496, 24, 29),
(529, 24, 31),
(562, 24, 33),
(694, 24, 33),
(595, 24, 35),
(727, 24, 35),
(760, 24, 36),
(628, 24, 37),
(793, 24, 38),
(661, 24, 39),
(826, 24, 40),
(859, 24, 42),
(892, 24, 44),
(925, 24, 46),
(958, 24, 48),
(991, 24, 50);

-- --------------------------------------------------------

--
-- Estrutura da tabela `plano`
--

CREATE TABLE IF NOT EXISTS `plano` (
  `id_plano` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `dias_lic` int(11) NOT NULL COMMENT 'quantidade de dias de licença para usar o sistema',
  `visivel` tinyint(1) NOT NULL COMMENT 'Se será visivel no sistema',
  `valor` decimal(15,2) NOT NULL COMMENT 'valor do plano',
  `detalhes` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `link_checkout` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'link para o chekout do pagamento',
  `referencia` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `vitalicio` tinyint(1) NOT NULL COMMENT '1 plano vitalicio 0 = quantidade de dias',
  PRIMARY KEY (`id_plano`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='plano de licença para usar o sistema' AUTO_INCREMENT=5 ;

--
-- Extraindo dados da tabela `plano`
--

INSERT INTO `plano` (`id_plano`, `descricao`, `dias_lic`, `visivel`, `valor`, `detalhes`, `link_checkout`, `referencia`, `vitalicio`) VALUES
(1, 'Avaliação', 15, 0, '0.00', 'Acesso completo ao sistema para ser avaliado durante 15 dias', NULL, '', 0),
(2, 'Plano Mensal', 30, 1, '119.47', 'Acesso completo ao sistema durante 30 dias', 'https://pay.hotmart.com/T5602087G?off=utnnqp1j', '', 0),
(3, 'Plano Anual', 365, 1, '1197.00', 'Acesso completo ao sistema durante 365 dias', 'https://pay.hotmart.com/T5602087G?off=nk6upf5p', '', 0),
(4, 'Teste do sistema', 0, 0, '0.00', 'Acesso completo somente para avaliação e testes', NULL, '', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(11) NOT NULL,
  `nome` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `senha` text COLLATE utf8_unicode_ci,
  `status` int(11) NOT NULL COMMENT '0 intativo 1 ativo',
  `email` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_perfil` int(11) DEFAULT NULL,
  `data_acess` datetime DEFAULT NULL,
  `ip_acess` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_perfil` (`id_perfil`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=17 ;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_empresa`, `nome`, `senha`, `status`, `email`, `id_perfil`, `data_acess`, `ip_acess`) VALUES
(1, 1, 'Administrador', '1111', 1, 'admin@admin.com', 1, '2017-05-17 15:44:01', '127.0.0.1'),
(2, 1, 'Val', 'atraente01', 1, 'val@email.com', NULL, '2016-09-28 14:33:00', '127.0.0.1'),
(7, 21, 'alan', '12345', 1, 'jalan.alves@gmail.com', 31, '2017-05-17 11:33:27', '127.0.0.1'),
(14, 28, 'emp', '12345', 1, 'emp@email.com', 46, '2017-05-17 11:41:04', '127.0.0.1'),
(16, 30, 'locdress', '12345', 1, 'teste@email.com', 50, '2017-05-17 11:14:54', '127.0.0.1');

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `modulos`
--
ALTER TABLE `modulos`
  ADD CONSTRAINT `FkGMod` FOREIGN KEY (`id_mg`) REFERENCES `modulos_grupo` (`id_mg`);

--
-- Limitadores para a tabela `perfils`
--
ALTER TABLE `perfils`
  ADD CONSTRAINT `FkPerEmp` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `FkPerUse` FOREIGN KEY (`id_perfil`) REFERENCES `perfils` (`id_perfil`),
  ADD CONSTRAINT `FkUserEmp` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;