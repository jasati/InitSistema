-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 08-Set-2017 às 19:55
-- Versão do servidor: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `psclse`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `empresas`
--

CREATE TABLE IF NOT EXISTS `empresas` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,
  `id_galeria` int(11) DEFAULT NULL COMMENT 'Logomarca da empresa',
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
  `fantasia` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cad_confirm` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Campo que identifica o codigo de confirmação do cadastro no getResponse. o valor é o id do contato no getResponse',
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `cpf_cnpj` (`cpf_cnpj`),
  KEY `id_galeria` (`id_galeria`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `empresas`
--

INSERT INTO `empresas` (`id_empresa`, `id_galeria`, `nome`, `cpf_cnpj`, `endereco`, `responsavel`, `data_cad`, `email`, `cel`, `status`, `tel1`, `tel2`, `slogan`, `cidade`, `fantasia`, `estado`, `cad_confirm`) VALUES
(1, NULL, 'Teste', '11.111.225/0001', 'Rua Teste', 'Teste', '2016-08-31 14:07:06', 'teste@teste.com', '99556622', 1, '3262553585', '32625585', 'Empresa teste', 'Conceição do Coité', 'Novo', 'BA', '5vas2');

-- --------------------------------------------------------

--
-- Estrutura da tabela `galeria`
--

CREATE TABLE IF NOT EXISTS `galeria` (
  `id_galeria` int(11) NOT NULL AUTO_INCREMENT,
  `id_emp` int(11) NOT NULL,
  `imagem` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `doc` int(11) NOT NULL,
  PRIMARY KEY (`id_galeria`),
  UNIQUE KEY `imagem` (`imagem`),
  KEY `id_emp` (`id_emp`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nome`, `id_mg`) VALUES
(1, 'Acesso ao modulo', 1),
(2, 'Acesso aos perfils', 1),
(3, 'Incluir novo usuário', 1),
(4, 'Alterar Usuário', 1),
(5, 'Incluir novo Perfil', 1),
(6, 'Alterar Perfil', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `modulos_grupo`
--

CREATE TABLE IF NOT EXISTS `modulos_grupo` (
  `id_mg` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id_mg`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `modulos_grupo`
--

INSERT INTO `modulos_grupo` (`id_mg`, `descricao`) VALUES
(1, 'Controle de Acesso ao Sistema');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `perfils`
--

INSERT INTO `perfils` (`id_perfil`, `id_empresa`, `nome`) VALUES
(1, 1, 'Administrador'),
(2, 1, 'Operador');

-- --------------------------------------------------------

--
-- Estrutura da tabela `perfil_modulos`
--

CREATE TABLE IF NOT EXISTS `perfil_modulos` (
  `id_pm` int(11) NOT NULL AUTO_INCREMENT,
  `id_modulo` int(11) NOT NULL,
  `id_perfil` int(11) NOT NULL,
  `permitido` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_pm`),
  KEY `id_prefeitura` (`id_modulo`,`id_perfil`),
  KEY `id_modulo` (`id_modulo`),
  KEY `id_perfil` (`id_perfil`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=14 ;

--
-- Extraindo dados da tabela `perfil_modulos`
--

INSERT INTO `perfil_modulos` (`id_pm`, `id_modulo`, `id_perfil`, `permitido`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 1, 1),
(5, 5, 1, 1),
(6, 6, 1, 1),
(8, 1, 2, 0),
(9, 2, 2, 0),
(10, 3, 2, 0),
(11, 4, 2, 0),
(12, 5, 2, 0),
(13, 6, 2, 0);

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
  `id_galeria` int(11) DEFAULT NULL COMMENT 'Foto do usuaio',
  `nome` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `senha` text COLLATE utf8_unicode_ci,
  `status` int(11) NOT NULL COMMENT '0 intativo 1 ativo',
  `email` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_perfil` int(11) DEFAULT NULL,
  `data_acess` datetime DEFAULT NULL,
  `ip_acess` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_perfil` (`id_perfil`),
  KEY `id_galeria` (`id_galeria`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_empresa`, `id_galeria`, `nome`, `senha`, `status`, `email`, `id_perfil`, `data_acess`, `ip_acess`) VALUES
(1, 1, NULL, 'Administrador', '1111', 1, 'admin@admin.com', 1, '2017-05-17 15:44:01', '127.0.0.1');

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `empresas`
--
ALTER TABLE `empresas`
  ADD CONSTRAINT `FkEmpGal` FOREIGN KEY (`id_galeria`) REFERENCES `galeria` (`id_galeria`) ON DELETE SET NULL;

--
-- Limitadores para a tabela `galeria`
--
ALTER TABLE `galeria`
  ADD CONSTRAINT `FkGalEmp` FOREIGN KEY (`id_emp`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE;

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
-- Limitadores para a tabela `perfil_modulos`
--
ALTER TABLE `perfil_modulos`
  ADD CONSTRAINT `FkModPer` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`) ON DELETE CASCADE,
  ADD CONSTRAINT `FkPerMod` FOREIGN KEY (`id_perfil`) REFERENCES `perfils` (`id_perfil`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `FkUseGal` FOREIGN KEY (`id_galeria`) REFERENCES `galeria` (`id_galeria`) ON DELETE SET NULL,
  ADD CONSTRAINT `FkPerUse` FOREIGN KEY (`id_perfil`) REFERENCES `perfils` (`id_perfil`) ON DELETE SET NULL,
  ADD CONSTRAINT `FkUserEmp` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
