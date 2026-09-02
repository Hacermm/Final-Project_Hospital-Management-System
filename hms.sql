-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 02 Eyl 2026, 17:25:14
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `hms`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ai_messages`
--

CREATE TABLE `ai_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `ai_messages`
--

INSERT INTO `ai_messages` (`id`, `user_id`, `role`, `content`, `created_at`, `updated_at`) VALUES
(11, 17, 'user', 'İş saatları', '2026-08-12 11:34:15', '2026-08-12 11:34:15'),
(12, 17, 'assistant', 'NovaCare Hospitalın həkimlərinin iş saatları müxtəlifdir. Əgər sizə hansı şöbə və həkimə müraciət etmək istədiyinizi bilsəniz, mən sizə daha dəqiq məlumat verə bilərəm. Məsələn, Kardiologiya şöbəsində işləyən Dr. Anar Məmmədov bazar ertəsi, çərşənbə, cümə və şənbə günleri 09:00-15:00 saatlarında, çərşənbə axşamı isə 09:00-17:00 saatlarında işləyir.', '2026-08-12 11:34:18', '2026-08-12 11:34:18'),
(13, 17, 'user', 'mene admin haqqinda melumat ver', '2026-08-12 11:34:42', '2026-08-12 11:34:42'),
(14, 17, 'assistant', 'NovaCare Hospitalın administrasiyası haqqında məlumat verməyə çalışacam. Administrasiya sizə hospitalın xidmətləri, həkimlərin iş saatları, randevu almaq və digər məsələlər barədə məlumat verə bilər. Əgər sizə hansısa məlumat lazım olsa, administrasiya ilə əlaqə saxlamaq üçün sizə kömək edə bilərəm. Lakin, dəqiq məlumat üçün sizə administrasiya ilə birbaşa əlaqə saxlamağı tövsiyə edirəm.', '2026-08-12 11:34:44', '2026-08-12 11:34:44'),
(19, 18, 'user', 'Reseptimi haradan yükləyə bilərəm?', '2026-08-22 08:20:13', '2026-08-22 08:20:13'),
(20, 18, 'assistant', 'Rəspetinizi “Tibbi tarixçəm” səhifəsindən PDF formatında yükləyə bilərsiniz. Hal-hazırda sizin hesabınızda tibbi qeyd və resept mövcud deyil. Yeni resept üçün həkiminizlə “Mesajlar” bölməsində əlaqə saxlayın.', '2026-08-22 08:20:15', '2026-08-22 08:20:15'),
(21, 13, 'user', 'Qiymətlər haqqında', '2026-08-24 05:38:02', '2026-08-24 05:38:02'),
(22, 13, 'assistant', 'Hər bir həkimin konsultasiya haqqı aşağıdakı kimidir: Dr. Anar Məmmədov – 80.00 AZN, Dr. Leyla Hüseynova – 75.00 AZN, Dr. Elçin Quliyev – 79.44 AZN, Dr. Nigar Əliyeva – 85.00 AZN, Dr. Rəşad Kərimov – 50.00 AZN, Dr. Günel Bağırova – 70.00 AZN. Bu qiymətlər randevu alarkən ödənilir.', '2026-08-24 05:38:05', '2026-08-24 05:38:05'),
(23, 1, 'user', 'İş saatları', '2026-08-24 05:38:17', '2026-08-24 05:38:17'),
(24, 1, 'assistant', 'NovaCare Hospital‑un şöbə həkimlərinin iş saatları aşağıdakı kimidir:\n\n- **Kardiolog – Dr. Anar Məmmədov:** B.e, Çərşənbə, Cümə 09:00‑15:00; Şənbə 10:00‑14:00; Ç.a 09:00‑17:00  \n- **Nevroloq – Dr. Leyla Hüseynova:** B.e, Ç.a, Çərşənbə, C.a, Cümə 13:00‑19:00  \n- **Pediatr – Dr. Elçin Quliyev:** B.e, Ç.a, Çərşənbə, C.a, Cümə 09:00‑15:00  \n- **Ortoped‑travmatoloq – Dr. Nigar Əliyeva:** B.e, Ç.a, Çərşənbə, C.a, Cümə 13:00‑19:00; Şənbə 10:00‑14:00  \n- **Terapevt – Dr. Rəşad Kərimov:** B.e, Ç.a, Çərşənbə, C.a, Cümə 09:00‑15:00  \n- **Oftalmoloq – Dr. Günel Bağırova:** B.e, Ç.a, Çərşənbə, C.a, Cümə 13:00‑19:00  \n\nƏtraflı məlumat və randevu üçün “Randevu al” səhifəsindən seçiminizi edə bilərsiniz.', '2026-08-24 05:38:20', '2026-08-24 05:38:20');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `status`, `reason`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-07-13', '09:30:00', 'completed', 'Sinəmdə sıxıntı və təngnəfəslik hiss edirəm', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(2, 2, 2, '2026-07-06', '09:30:00', 'completed', 'Bir həftədir davam edən baş ağrısı', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(3, 3, 3, '2026-07-03', '16:00:00', 'completed', 'Boğaz ağrısı və hərarət', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(4, 4, 4, '2026-07-05', '15:00:00', 'completed', 'Ümumi zəiflik və yorğunluq', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(5, 5, 5, '2026-07-18', '10:30:00', 'completed', 'Bel nahiyəsində ağrı', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(6, 1, 3, '2026-08-10', '11:00:00', 'confirmed', 'Bir həftədir davam edən baş ağrısı', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(7, 2, 4, '2026-08-07', '11:00:00', 'pending', 'Boğaz ağrısı və hərarət', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(8, 3, 5, '2026-07-30', '12:30:00', 'confirmed', 'Ümumi zəiflik və yorğunluq', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(9, 4, 6, '2026-07-28', '10:30:00', 'pending', 'Bel nahiyəsində ağrı', '2026-07-27 14:05:59', '2026-07-27 14:05:59'),
(10, 5, 1, '2026-08-03', '15:00:00', 'cancelled', 'Profilaktik müayinə üçün', '2026-07-27 14:05:59', '2026-07-27 14:05:59'),
(11, 1, 1, '2026-07-31', '12:30:00', 'cancelled', NULL, '2026-07-27 14:12:09', '2026-08-05 13:44:48'),
(12, 1, 1, '2026-07-29', '09:00:00', 'cancelled', NULL, '2026-07-27 14:12:48', '2026-07-27 14:13:05'),
(13, 1, 3, '2026-08-14', '12:30:00', 'pending', NULL, '2026-08-01 17:58:50', '2026-08-01 17:58:50'),
(14, 6, 1, '2026-08-11', '10:00:00', 'completed', NULL, '2026-08-10 14:58:22', '2026-08-10 16:37:51'),
(15, 6, 1, '2026-08-12', '09:00:00', 'confirmed', NULL, '2026-08-10 16:56:03', '2026-08-10 16:56:33'),
(16, 8, 1, '2026-08-24', '09:30:00', 'completed', 'njhbvgcxdfghjk', '2026-08-22 08:41:04', '2026-08-22 08:42:25'),
(17, 1, 1, '2026-08-25', '09:00:00', 'confirmed', 'kjhgtfrdegthyuj', '2026-08-24 09:22:22', '2026-08-24 09:24:58');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab', 'i:2;', 1787554468),
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1787554468;', 1787554468),
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:2;', 1787563294),
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1787563294;', 1787563294),
('laravel-cache-902ba3cda1883801594b6e1b452790cc53948fda', 'i:4;', 1787563506),
('laravel-cache-902ba3cda1883801594b6e1b452790cc53948fda:timer', 'i:1787563506;', 1787563506),
('laravel-cache-9e6a55b6b4563e652a23be9d623ca5055c356940', 'i:1;', 1787388255),
('laravel-cache-9e6a55b6b4563e652a23be9d623ca5055c356940:timer', 'i:1787388255;', 1787388255),
('laravel-cache-bd307a3ec329e10a2cff8fb87480823da114f8f4', 'i:2;', 1787549941),
('laravel-cache-bd307a3ec329e10a2cff8fb87480823da114f8f4:timer', 'i:1787549941;', 1787549941);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `call_logs`
--

CREATE TABLE `call_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `caller_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ringing',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `call_logs`
--

INSERT INTO `call_logs` (`id`, `caller_id`, `receiver_id`, `started_at`, `ended_at`, `status`, `created_at`, `updated_at`) VALUES
(1, 7, 2, '2026-08-04 17:20:11', '2026-08-04 17:20:16', 'missed', '2026-08-04 17:20:11', '2026-08-04 17:20:16'),
(2, 7, 6, '2026-08-05 13:44:02', '2026-08-05 13:44:11', 'missed', '2026-08-05 13:44:02', '2026-08-05 13:44:11'),
(3, 16, 1, '2026-08-10 16:16:26', '2026-08-10 16:16:51', 'ended', '2026-08-10 16:16:26', '2026-08-10 16:16:51'),
(4, 16, 1, '2026-08-10 16:18:15', '2026-08-10 16:18:21', 'rejected', '2026-08-10 16:18:15', '2026-08-10 16:18:21'),
(5, 1, 16, '2026-08-10 16:18:39', '2026-08-10 16:18:51', 'missed', '2026-08-10 16:18:39', '2026-08-10 16:18:51'),
(6, 1, 16, '2026-08-10 16:25:53', '2026-08-10 16:26:02', 'missed', '2026-08-10 16:25:53', '2026-08-10 16:26:02'),
(7, 16, 1, '2026-08-10 16:27:09', '2026-08-10 16:27:14', 'missed', '2026-08-10 16:27:09', '2026-08-10 16:27:14'),
(8, 16, 1, '2026-08-10 16:28:31', '2026-08-10 16:28:36', 'missed', '2026-08-10 16:28:31', '2026-08-10 16:28:36'),
(9, 1, 7, '2026-08-20 17:45:20', '2026-08-20 17:45:26', 'answered', '2026-08-20 17:45:20', '2026-08-24 09:26:24'),
(10, 1, 15, '2026-08-20 17:47:29', '2026-08-20 17:48:51', 'missed', '2026-08-20 17:47:29', '2026-08-20 17:48:51'),
(11, 7, 1, '2026-08-20 17:56:38', '2026-08-20 18:00:40', 'ended', '2026-08-20 17:56:38', '2026-08-20 18:00:40'),
(12, 1, 15, '2026-08-20 18:03:21', '2026-08-20 18:04:10', 'missed', '2026-08-20 18:03:21', '2026-08-20 18:04:10'),
(13, 1, 15, '2026-08-20 18:08:26', '2026-08-20 18:08:59', 'missed', '2026-08-20 18:08:26', '2026-08-20 18:08:59'),
(14, 7, 1, '2026-08-20 18:09:05', '2026-08-20 18:09:24', 'rejected', '2026-08-20 18:09:05', '2026-08-20 18:09:24'),
(15, 1, 18, '2026-08-22 08:23:29', '2026-08-22 08:23:53', 'ended', '2026-08-22 08:23:29', '2026-08-22 08:23:53'),
(16, 1, 18, '2026-08-22 08:34:40', '2026-08-22 08:35:25', 'ended', '2026-08-22 08:34:40', '2026-08-22 08:35:25'),
(17, 1, 18, '2026-08-22 08:39:11', '2026-08-22 08:39:25', 'ended', '2026-08-22 08:39:11', '2026-08-22 08:39:25'),
(18, 7, 1, '2026-08-24 09:25:41', '2026-08-24 09:26:20', 'missed', '2026-08-24 09:25:41', '2026-08-24 09:26:20'),
(19, 7, 1, '2026-08-24 09:27:27', '2026-08-24 09:27:48', 'ended', '2026-08-24 09:27:27', '2026-08-24 09:27:48');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `is_read`, `created_at`, `updated_at`) VALUES
(3, 'TEST15', 'qabybiv@mailinator.com', '+1 (357) 883-5153', 'feedback', 'Dolorem soluta sunt', 1, '2026-08-22 08:11:25', '2026-08-22 08:49:36'),
(4, 'Ex obcaecati rerum p', 'cija@mailinator.com', '+1 (616) 395-6746', 'feedback', 'Illum ad dolore bla', 0, '2026-08-24 09:20:36', '2026-08-24 09:20:36');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_one_id` bigint(20) UNSIGNED NOT NULL,
  `user_two_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `conversations`
--

INSERT INTO `conversations` (`id`, `user_one_id`, `user_two_id`, `created_at`, `updated_at`) VALUES
(1, 7, 6, '2026-08-04 17:18:03', '2026-08-04 17:18:03'),
(2, 7, 1, '2026-08-04 17:19:13', '2026-08-24 09:26:20'),
(3, 1, 9, '2026-08-04 17:19:22', '2026-08-04 17:19:22'),
(4, 7, 2, '2026-08-04 17:19:50', '2026-08-04 17:19:50'),
(5, 16, 1, '2026-08-10 15:02:34', '2026-08-10 16:28:36'),
(6, 1, 15, '2026-08-20 17:47:15', '2026-08-20 18:08:59'),
(7, 18, 1, '2026-08-22 08:22:43', '2026-08-22 08:23:13');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Kardiologiya', 'Ürək və damar xəstəliklərinin diaqnostikası və müalicəsi', '2026-07-27 14:05:56', '2026-07-27 14:05:56'),
(2, 'Nevrologiya', 'Sinir sistemi xəstəliklərinin müasir üsullarla müalicəsi', '2026-07-27 14:05:56', '2026-07-27 14:05:56'),
(3, 'Pediatriya', 'Uşaq sağlamlığı, profilaktika və inkişaf müşahidəsi', '2026-07-27 14:05:56', '2026-07-27 14:05:56'),
(4, 'Ortopediya', 'Sümük, oynaq və əzələ sistemi problemlərinin müalicəsi', '2026-07-27 14:05:56', '2026-07-27 14:05:56'),
(5, 'Terapiya', 'Ümumi tibbi müayinə və daxili xəstəliklər', '2026-07-27 14:05:56', '2026-07-27 14:05:56'),
(6, 'Oftalmologiya', 'Göz xəstəlikləri və görmə korreksiyası', '2026-07-27 14:05:56', '2026-07-27 14:05:56');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `specialization` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `experience_years` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `consultation_fee` decimal(8,2) NOT NULL DEFAULT 0.00,
  `phone` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `doctors`
--

INSERT INTO `doctors` (`id`, `user_id`, `department_id`, `specialization`, `bio`, `experience_years`, `consultation_fee`, `phone`, `photo`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Kardioloq', 'Ürək-damar xəstəlikləri üzrə 15 illik təcrübəyə malik mütəxəssis. Beynəlxalq sertifikatlı kardioloq.', 15, 80.00, '+994 50 634 64 21', 'doctor-photos/CecBurmY7duzIF7oTiuMr8CL424y9os6XUXOkNK8.png', '2026-07-27 14:05:56', '2026-08-04 16:59:55'),
(2, 2, 2, 'Nevroloq', 'Sinir sistemi xəstəlikləri, baş ağrıları və epilepsiya üzrə ixtisaslaşıb.', 12, 75.00, '+994 50 249 53 46', 'doctor-photos/jQ87InTj5AcK4gHMFLakd6D0XiBzQsz4YboL8Ke0.png', '2026-07-27 14:05:56', '2026-08-04 16:59:00'),
(3, 3, 3, 'Pediatr', 'Uşaq sağlamlığı və inkişafı üzrə mütəxəssis. Yenidoğulmuş müayinəsi.', 8, 79.44, '+994 50 470 46 72', 'doctor-photos/50Jg1E8hEjzYhqwf1Us2OrghBdpkHPqFMhB0P2Qh.png', '2026-07-27 14:05:57', '2026-08-19 18:50:54'),
(4, 4, 4, 'Ortoped-travmatoloq', 'Oynaq protezləmə və idman travmaları üzrə cərrah.', 11, 85.00, '+994 50 355 55 85', 'doctor-photos/d22yswXd47fcRQr2R41ttvhIHymt9GhPJTJvwQIW.png', '2026-07-27 14:05:57', '2026-08-04 16:57:16'),
(5, 5, 5, 'Terapevt', 'Ümumi tibbi müayinə, profilaktik check-up və daxili xəstəliklər.', 7, 50.00, '+994 50 536 40 55', 'doctor-photos/n5ZpgpRfaUywQquf7SJVwjRd7ohhOq2MPrtquqvW.png', '2026-07-27 14:05:57', '2026-08-04 16:58:01'),
(6, 6, 6, 'Oftalmoloq', 'Göz xəstəlikləri, katarakta cərrahiyyəsi və görmə korreksiyası.', 10, 70.00, '+994 50 725 94 30', 'doctor-photos/elbww7Lq53yxm20DYZKCXDRgPRcbN19gGTMFOAX4.png', '2026-07-27 14:05:57', '2026-08-04 16:58:28'),
(8, 20, 1, 'kardioloq', 'mkjbgvfbhnjmk', 10, 79.88, '0555555555', 'doctor-photos/kV40sPF4t2BWF0gfn941SKguxFKBlIHzUp196BWM.png', '2026-08-24 09:32:07', '2026-08-24 09:32:07');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `doctor_schedules`
--

CREATE TABLE `doctor_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `doctor_schedules`
--

INSERT INTO `doctor_schedules` (`id`, `doctor_id`, `day_of_week`, `start_time`, `end_time`, `is_available`, `created_at`, `updated_at`) VALUES
(1, 1, 'monday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(3, 1, 'wednesday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(5, 1, 'friday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(6, 1, 'saturday', '10:00:00', '14:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(7, 2, 'monday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(8, 2, 'tuesday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(9, 2, 'wednesday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(10, 2, 'thursday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(11, 2, 'friday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(12, 3, 'monday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(13, 3, 'tuesday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(14, 3, 'wednesday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(15, 3, 'thursday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(16, 3, 'friday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(17, 4, 'monday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(18, 4, 'tuesday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(19, 4, 'wednesday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(20, 4, 'thursday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(21, 4, 'friday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(22, 4, 'saturday', '10:00:00', '14:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(23, 5, 'monday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(24, 5, 'tuesday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(25, 5, 'wednesday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(26, 5, 'thursday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(27, 5, 'friday', '09:00:00', '15:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(28, 6, 'monday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(29, 6, 'tuesday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(30, 6, 'wednesday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(31, 6, 'thursday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(32, 6, 'friday', '13:00:00', '19:00:00', 1, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(33, 1, 'tuesday', '09:00:00', '17:00:00', 1, '2026-08-06 11:45:21', '2026-08-06 11:45:21');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `status` enum('unpaid','paid') NOT NULL DEFAULT 'unpaid',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `lab_tests`
--

CREATE TABLE `lab_tests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `lab_tests`
--

INSERT INTO `lab_tests` (`id`, `patient_id`, `doctor_id`, `title`, `description`, `file_path`, `file_name`, `created_at`, `updated_at`) VALUES
(1, 6, 1, 'qan analizi', NULL, 'lab-tests/CWeC5TyFv43Nk89alOyfmDu2XBmxbkIVsNgzPJ6l.png', 'Screenshot 2026-08-10 203026.png', '2026-08-10 16:41:43', '2026-08-10 16:41:43'),
(2, 1, 1, 'qan analizi', 'asdfgfds', 'lab-tests/HYqPSz2uDGtKCFstrZcNGsT4isbBt6iZlcYoGpG8.png', 'Lily.png', '2026-08-24 05:28:59', '2026-08-24 05:28:59');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `medical_records`
--

CREATE TABLE `medical_records` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `diagnosis` text NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `medical_records`
--

INSERT INTO `medical_records` (`id`, `patient_id`, `doctor_id`, `appointment_id`, `diagnosis`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Arterial hipertoniya (I dərəcə)', 'Təzyiqin gündəlik ölçülməsi tövsiyə olunur. Duz qəbulu azaldılmalıdır.', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(2, 2, 2, 2, 'Kəskin faringit', 'Bol maye qəbulu və istirahət tövsiyə olunur.', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(3, 3, 3, 3, 'Miqren', 'Tetikleyici amillərdən (stress, yuxusuzluq) qaçınmaq lazımdır.', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(4, 4, 4, 4, 'Dəmir çatışmazlığı anemiyası', '3 ay sonra təkrar qan analizi tələb olunur.', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(5, 5, 5, 5, 'Bel nahiyəsində osteoxondroz', 'Fizioterapiya kursu və müalicəvi bədən tərbiyəsi tövsiyə olunur.', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(6, 6, 1, 14, 'diaqnoz', 'sdfdssadf', '2026-08-10 16:37:51', '2026-08-10 16:37:51');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `body` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `body`, `read_at`, `created_at`, `updated_at`) VALUES
(1, 2, 7, 'salam', '2026-08-20 17:45:14', '2026-08-04 17:19:33', '2026-08-20 17:45:14'),
(2, 5, 16, 'salam anar dr', '2026-08-10 16:01:06', '2026-08-10 15:02:47', '2026-08-10 16:01:06'),
(3, 5, 1, 'Salam', '2026-08-10 16:04:00', '2026-08-10 16:01:12', '2026-08-10 16:04:00'),
(4, 5, 1, '.......', '2026-08-10 16:08:03', '2026-08-10 16:04:16', '2026-08-10 16:08:03'),
(5, 5, 1, 'salam', '2026-08-10 16:08:03', '2026-08-10 16:04:42', '2026-08-10 16:08:03'),
(6, 5, 1, '.............', '2026-08-10 16:08:03', '2026-08-10 16:07:48', '2026-08-10 16:08:03'),
(7, 5, 16, 'slm', '2026-08-10 16:08:18', '2026-08-10 16:08:09', '2026-08-10 16:08:18'),
(8, 5, 16, '[MISSED_CALL]', '2026-08-10 16:28:55', '2026-08-10 16:28:36', '2026-08-10 16:28:55'),
(9, 2, 1, '[MISSED_CALL]', '2026-08-20 17:56:31', '2026-08-20 17:45:26', '2026-08-20 17:56:31'),
(10, 6, 1, '[MISSED_CALL]', NULL, '2026-08-20 17:48:51', '2026-08-20 17:48:51'),
(11, 6, 1, 'salam', NULL, '2026-08-20 17:48:57', '2026-08-20 17:48:57'),
(12, 6, 1, '[MISSED_CALL]', NULL, '2026-08-20 18:04:10', '2026-08-20 18:04:10'),
(13, 6, 1, '[MISSED_CALL]', NULL, '2026-08-20 18:08:59', '2026-08-20 18:08:59'),
(14, 7, 18, 'salam Anar dr', '2026-08-22 08:23:07', '2026-08-22 08:22:55', '2026-08-22 08:23:07'),
(15, 7, 1, 'salam', '2026-08-22 08:39:06', '2026-08-22 08:23:13', '2026-08-22 08:39:06'),
(16, 2, 7, '[MISSED_CALL]', NULL, '2026-08-24 09:26:20', '2026-08-24 09:26:20');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_07_07_201910_create_personal_access_tokens_table', 1),
(5, '2026_07_08_114149_create_departments_table', 1),
(6, '2026_07_08_120734_create_doctors_table', 1),
(7, '2026_07_08_120747_create_patients_table', 1),
(8, '2026_07_08_120804_create_doctor_schedules_table', 1),
(9, '2026_07_08_120812_create_appointments_table', 1),
(10, '2026_07_08_120819_create_medical_records_table', 1),
(11, '2026_07_08_120825_create_prescriptions_table', 1),
(12, '2026_07_08_120832_create_conversations_table', 1),
(13, '2026_07_08_120838_create_messages_table', 1),
(14, '2026_07_08_120844_create_call_logs_table', 1),
(15, '2026_07_08_120850_create_invoices_table', 1),
(16, '2026_07_08_120856_create_ai_messages_table', 1),
(17, '2026_07_08_120905_create_password_reset_codes_table', 1),
(18, '2026_07_09_184035_create_permission_tables', 1),
(19, '2026_07_21_230723_create_lab_tests_table', 2),
(20, '2026_07_25_011222_add_photo_to_doctors_table', 3),
(21, '2026_07_26_132352_change_status_in_call_logs_table', 4),
(22, '2026_08_05_163922_create_contact_messages_table', 5),
(23, '2026_08_07_125852_create_reviews_table', 6),
(24, '2026_08_10_204840_add_medical_history_to_patients_table', 7),
(25, '2026_08_12_163418_create_settings_table', 8);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 12),
(2, 'App\\Models\\User', 13),
(2, 'App\\Models\\User', 17),
(3, 'App\\Models\\User', 1),
(3, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 3),
(3, 'App\\Models\\User', 4),
(3, 'App\\Models\\User', 5),
(3, 'App\\Models\\User', 6),
(3, 'App\\Models\\User', 20),
(4, 'App\\Models\\User', 7),
(4, 'App\\Models\\User', 8),
(4, 'App\\Models\\User', 9),
(4, 'App\\Models\\User', 10),
(4, 'App\\Models\\User', 11),
(4, 'App\\Models\\User', 14),
(4, 'App\\Models\\User', 15),
(4, 'App\\Models\\User', 16),
(4, 'App\\Models\\User', 18);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `password_reset_codes`
--

CREATE TABLE `password_reset_codes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `blood_group` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `allergies` varchar(255) DEFAULT NULL,
  `chronic_diseases` varchar(255) DEFAULT NULL,
  `past_diseases` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `patients`
--

INSERT INTO `patients` (`id`, `user_id`, `date_of_birth`, `gender`, `blood_group`, `address`, `phone`, `emergency_contact`, `created_at`, `updated_at`, `allergies`, `chronic_diseases`, `past_diseases`) VALUES
(1, 7, '1992-04-18', 'male', 'A+', 'Bakı ş., Nərimanov r., Atatürk pr. 77', '+994 55 470 33 62', '+994 51 728 90 37', '2026-07-27 14:05:58', '2026-07-27 14:05:58', NULL, NULL, NULL),
(2, 8, '1988-11-02', 'female', 'O+', 'Bakı ş., Nərimanov r., Atatürk pr. 77', '+994 55 460 20 50', '+994 51 275 28 56', '2026-07-27 14:05:58', '2026-07-27 14:05:58', NULL, NULL, NULL),
(3, 9, '1975-07-25', 'male', 'B+', 'Bakı ş., Nərimanov r., Atatürk pr. 65', '+994 55 251 19 81', '+994 51 386 58 30', '2026-07-27 14:05:58', '2026-07-27 14:05:58', NULL, NULL, NULL),
(4, 10, '1999-01-30', 'female', 'AB+', 'Bakı ş., Nərimanov r., Atatürk pr. 76', '+994 55 611 57 33', '+994 51 287 44 35', '2026-07-27 14:05:58', '2026-07-27 14:05:58', NULL, NULL, NULL),
(5, 11, '1984-09-12', 'male', 'A-', 'Bakı ş., Nərimanov r., Atatürk pr. 54', '+994 55 635 57 74', '+994 51 294 68 43', '2026-07-27 14:05:58', '2026-07-27 14:05:58', NULL, NULL, NULL),
(6, 16, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-10 14:56:56', '2026-08-10 14:56:56', NULL, NULL, NULL),
(7, 15, '1992-01-25', 'male', '1', 'Anim dolore illo del', 'Maxime atque fuga I', NULL, '2026-08-19 19:04:06', '2026-08-19 19:04:06', 'Ut pariatur In aut', 'Quam alias pariatur', 'Enim dolore culpa si'),
(8, 18, '2014-06-02', 'male', '2', 'Optio consequatur q', 'Corporis voluptates', NULL, '2026-08-22 08:14:13', '2026-08-22 08:18:32', 'Nihil hic quo adipis', 'Quam nostrum rerum n', 'Nemo eiusmod eos in');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 7, 'auth-token', '06c2dd5dd90d06733e59ac4db7cbdcca7ebc0b535ad5a4ecc91d42cac3993d2f', '[\"*\"]', '2026-07-27 14:13:17', NULL, '2026-07-27 14:09:56', '2026-07-27 14:13:17'),
(2, 'App\\Models\\User', 1, 'auth-token', '398b2aac41168aad55a83cf2869972f298d2d6db850ee22ed209f42453ef44f7', '[\"*\"]', '2026-07-27 14:13:06', NULL, '2026-07-27 14:11:26', '2026-07-27 14:13:06'),
(3, 'App\\Models\\User', 13, 'auth-token', 'ac88a972188c4e5ec0718ba59d2ed671edc2c2f591f333b70260760d700e6d0b', '[\"*\"]', '2026-07-27 14:14:37', NULL, '2026-07-27 14:13:40', '2026-07-27 14:14:37'),
(4, 'App\\Models\\User', 13, 'auth-token', 'b226f10c4f6c747b9cc72cd5ab7aeadfd6d87db699e6d26bd60dedf3cf36775f', '[\"*\"]', '2026-07-27 14:26:39', NULL, '2026-07-27 14:26:38', '2026-07-27 14:26:39'),
(5, 'App\\Models\\User', 13, 'auth-token', 'f78da14fc174b18edc7a657caad6af6aa1af7a44ac3232509dc88631ea868b13', '[\"*\"]', '2026-07-27 17:57:39', NULL, '2026-07-27 17:57:14', '2026-07-27 17:57:39'),
(6, 'App\\Models\\User', 7, 'auth-token', '31de4746abd8ba653cdf46f1392ffdb7dac069da89eae1c2c248a8925989cf5d', '[\"*\"]', '2026-07-27 18:44:08', NULL, '2026-07-27 18:43:53', '2026-07-27 18:44:08'),
(7, 'App\\Models\\User', 13, 'auth-token', 'f65035b2c26c24c7c650bb45cc9f5a857c8df274c8a00673c1fd6dabcba54302', '[\"*\"]', '2026-08-04 17:16:23', NULL, '2026-07-27 18:44:59', '2026-08-04 17:16:23'),
(8, 'App\\Models\\User', 12, 'auth-token', 'd8806d7d7c93c74904a0138f4846cca25943d7649a2e1112ddc779a4f7ddae9e', '[\"*\"]', '2026-07-27 18:56:09', NULL, '2026-07-27 18:56:09', '2026-07-27 18:56:09'),
(9, 'App\\Models\\User', 12, 'auth-token', 'c47384d7901bda6a557af439b148fa555ae5fd57e24bc9c26a1be6a4ae83c5f9', '[\"*\"]', '2026-07-27 18:56:38', NULL, '2026-07-27 18:56:31', '2026-07-27 18:56:38'),
(10, 'App\\Models\\User', 13, 'auth-token', '80fb93935a57409fc889c6edea3f26f1c67f5abed79efd84165aec3e16d2e2ee', '[\"*\"]', '2026-07-27 18:56:48', NULL, '2026-07-27 18:56:48', '2026-07-27 18:56:48'),
(11, 'App\\Models\\User', 12, 'auth-token', 'b38048140e20f73a3068f4c3a273934614b6a438791b51e4087fe5a74072c012', '[\"*\"]', '2026-07-27 19:00:45', NULL, '2026-07-27 18:59:49', '2026-07-27 19:00:45'),
(12, 'App\\Models\\User', 7, 'auth-token', 'c26e33519c2236635037599b1b81bbc95f643e1d8c934730eb56eb480cb47488', '[\"*\"]', '2026-07-27 19:14:08', NULL, '2026-07-27 19:08:20', '2026-07-27 19:14:08'),
(13, 'App\\Models\\User', 14, 'auth-token', '7b5dd35005707e87f9da3954735eb421db5308c9370eb96d8ff26bb32afd7826', '[\"*\"]', '2026-07-28 18:25:54', NULL, '2026-07-28 18:25:53', '2026-07-28 18:25:54'),
(14, 'App\\Models\\User', 7, 'auth-token', '25daaa794a9c9d49a4e9780d604c1be77551871fa5379933397cf051cf8f1156', '[\"*\"]', '2026-08-01 17:59:22', NULL, '2026-08-01 17:47:12', '2026-08-01 17:59:22'),
(15, 'App\\Models\\User', 13, 'auth-token', 'cbcd93a01fa320ac60069a8a939d2c0b6e9ae94ae5b903f9c8fc38c7e3feb868', '[\"*\"]', '2026-08-04 16:59:55', NULL, '2026-08-04 16:51:27', '2026-08-04 16:59:55'),
(16, 'App\\Models\\User', 7, 'auth-token', '2acf8900b164d0d6233921cf2c06556d78e5020382e88adcc65991412a83fdca', '[\"*\"]', '2026-08-04 17:20:16', NULL, '2026-08-04 17:16:04', '2026-08-04 17:20:16'),
(17, 'App\\Models\\User', 1, 'auth-token', '5c22d009a798542ba03564388946d82501c121c8042097e88a0c7f69ee855145', '[\"*\"]', '2026-08-04 17:19:30', NULL, '2026-08-04 17:18:34', '2026-08-04 17:19:30'),
(18, 'App\\Models\\User', 7, 'auth-token', '2101006ad3e8683529a19e7da2891f4a0e357ef7d3f79f44400cb86a1a3ebfb5', '[\"*\"]', '2026-08-05 11:51:10', NULL, '2026-08-05 11:13:36', '2026-08-05 11:51:10'),
(19, 'App\\Models\\User', 13, 'auth-token', '49ca23a34824383d7e6bf6ba765f0886952b68b9a8f03d36b9442076253d9559', '[\"*\"]', '2026-08-05 12:48:09', NULL, '2026-08-05 12:47:08', '2026-08-05 12:48:09'),
(20, 'App\\Models\\User', 7, 'auth-token', '8a4ee6004eff40b468a603e32693070428dfe088049142585d107e6517ade8f1', '[\"*\"]', '2026-08-05 13:45:08', NULL, '2026-08-05 13:31:30', '2026-08-05 13:45:08'),
(21, 'App\\Models\\User', 1, 'auth-token', '350af75f3aff2b3499ca33e0fce051d6308cd70e5fec3f8666d25d14affd1715', '[\"*\"]', '2026-08-05 14:08:40', NULL, '2026-08-05 13:45:47', '2026-08-05 14:08:40'),
(22, 'App\\Models\\User', 1, 'auth-token', '0f5fae5d440ea7e907d4fcfa63ac3f5eaea0976f6426b9922866c293e0b93943', '[\"*\"]', '2026-08-06 11:54:41', NULL, '2026-08-06 11:40:40', '2026-08-06 11:54:41'),
(23, 'App\\Models\\User', 13, 'auth-token', '9502009794d001cc55c30b2c9129ddb3bd834f1baa28db70cd9d36b543bb65d3', '[\"*\"]', '2026-08-06 12:48:38', NULL, '2026-08-06 11:54:59', '2026-08-06 12:48:38'),
(24, 'App\\Models\\User', 12, 'auth-token', '67d6caab7130689194c31dd011308b73609f0f5e71e61758c92a3bedfd2768ed', '[\"*\"]', '2026-08-06 13:16:33', NULL, '2026-08-06 12:49:00', '2026-08-06 13:16:33'),
(25, 'App\\Models\\User', 13, 'auth-token', '606b3865e7e15e4edf1f1a06d88b5d273f2f33ff2d8f9ef2bfcd6bc088562c28', '[\"*\"]', '2026-08-06 13:12:23', NULL, '2026-08-06 13:01:49', '2026-08-06 13:12:23'),
(26, 'App\\Models\\User', 7, 'auth-token', '047bbff0c4621794250fec13afbb5d551e84fd2502f4e340ef4ad77bc576e2ec', '[\"*\"]', '2026-08-06 13:22:42', NULL, '2026-08-06 13:20:27', '2026-08-06 13:22:42'),
(27, 'App\\Models\\User', 7, 'auth-token', 'c5294c6970009bc1145311c53742e0e674893c0776cc9ce89d6dcc9e4af77091', '[\"*\"]', '2026-08-07 09:02:48', NULL, '2026-08-07 09:02:46', '2026-08-07 09:02:48'),
(28, 'App\\Models\\User', 7, 'auth-token', 'e972d9f5193749e371dbc858c7e0e718825d84504af6bf3de7f6f466b4050bfa', '[\"*\"]', '2026-08-07 12:07:09', NULL, '2026-08-07 09:05:42', '2026-08-07 12:07:09'),
(29, 'App\\Models\\User', 13, 'auth-token', 'e62d81977fd93e70bbe0bfa7b184f95b3d6bbe3e608c1fa87e9251dfb8530436', '[\"*\"]', '2026-08-07 09:27:01', NULL, '2026-08-07 09:25:53', '2026-08-07 09:27:01'),
(30, 'App\\Models\\User', 13, 'auth-token', '1439be389c1619c92d1f8fe1d5ba87b3806233b54e13f6e89973d3aa824faf25', '[\"*\"]', '2026-08-07 12:07:28', NULL, '2026-08-07 09:30:48', '2026-08-07 12:07:28'),
(31, 'App\\Models\\User', 4, 'auth-token', 'e8fdd637355d4f8ec724a9da919cf97039af65453849ca03918b6f2e09bbd465', '[\"*\"]', '2026-08-07 12:29:57', NULL, '2026-08-07 12:16:30', '2026-08-07 12:29:57'),
(32, 'App\\Models\\User', 15, 'auth-token', '87bb511ee6a96a1d0bd19bbaca769bda6ed1ad10d348ec04c81bcd9e8bb99bd7', '[\"*\"]', '2026-08-10 14:54:07', NULL, '2026-08-10 14:44:58', '2026-08-10 14:54:07'),
(33, 'App\\Models\\User', 1, 'auth-token', 'a1151341d5a472b70a919dae49f3203616a9c10ffa714b32f07cf54d0cf2970b', '[\"*\"]', '2026-08-10 16:41:07', NULL, '2026-08-10 14:48:04', '2026-08-10 16:41:07'),
(34, 'App\\Models\\User', 16, 'auth-token', '10d62bb1f82dfc27678da53fbd9a3103084b9a95da1190a80d9ccff1dc75c7cc', '[\"*\"]', '2026-08-10 16:57:08', NULL, '2026-08-10 14:57:20', '2026-08-10 16:57:08'),
(35, 'App\\Models\\User', 13, 'auth-token', '5065bdf0ca427158342b4c389a131d5aed7e4283722da51e03dabe69494c99a1', '[\"*\"]', '2026-08-10 16:40:43', NULL, '2026-08-10 16:39:08', '2026-08-10 16:40:43'),
(36, 'App\\Models\\User', 1, 'auth-token', '3c762242a7143d4b98e80f3446f4d521c5fe89577322de8b450859246b53db5f', '[\"*\"]', '2026-08-10 16:56:49', NULL, '2026-08-10 16:41:01', '2026-08-10 16:56:49'),
(37, 'App\\Models\\User', 12, 'auth-token', '9fa7b51b9fb299c31db489763907a59ad0d91c1f446759cc7a6ce35b21bfb84c', '[\"*\"]', '2026-08-11 08:46:12', NULL, '2026-08-11 08:45:07', '2026-08-11 08:46:12'),
(38, 'App\\Models\\User', 17, 'auth-token', '987e4fc63cc36d603c518870a411c496ab86daebfa5845ff149bb4cbc7cb48d3', '[\"*\"]', NULL, NULL, '2026-08-11 08:46:38', '2026-08-11 08:46:38'),
(39, 'App\\Models\\User', 17, 'auth-token', '070eec792c7f10c7851831cd68a95433954c625c19c0e7b61535fd4158adc28e', '[\"*\"]', '2026-08-12 12:28:54', NULL, '2026-08-12 11:31:10', '2026-08-12 12:28:54'),
(40, 'App\\Models\\User', 17, 'auth-token', '69cb43b4116cea06ec41ba3851c72de54cd9223a2d7ed54611aba4c8d2a9826a', '[\"*\"]', '2026-08-12 11:53:00', NULL, '2026-08-12 11:33:54', '2026-08-12 11:53:00'),
(41, 'App\\Models\\User', 7, 'auth-token', '0221bc45d0043d0832d6af76ef57ad21d2df2a808fbf3d5e0eafb5def83449cf', '[\"*\"]', '2026-08-12 12:44:09', NULL, '2026-08-12 11:56:49', '2026-08-12 12:44:09'),
(42, 'App\\Models\\User', 17, 'auth-token', 'c319c7c1613103d437d2d7d266f9f4779e30adadc00ec63834177d9ae11a010d', '[\"*\"]', '2026-08-12 12:43:30', NULL, '2026-08-12 12:41:09', '2026-08-12 12:43:30'),
(43, 'App\\Models\\User', 12, 'auth-token', 'cf0a222d3ecfa322f4d798a7caaaeecd6aea208e851f55285ee2a2abcf39bc8a', '[\"*\"]', '2026-08-12 12:51:16', NULL, '2026-08-12 12:44:02', '2026-08-12 12:51:16'),
(44, 'App\\Models\\User', 15, 'auth-token', '82a12fa510d9dfedeab5addbc8971b7a5763c30207ececf4d46849a4eaee47ab', '[\"*\"]', '2026-08-15 09:48:04', NULL, '2026-08-15 09:46:44', '2026-08-15 09:48:04'),
(45, 'App\\Models\\User', 12, 'auth-token', 'd89f3437e5f1cafe7825949fc657c048700f22896422fbb1e35db55de6c43618', '[\"*\"]', '2026-08-15 10:56:28', NULL, '2026-08-15 09:47:18', '2026-08-15 10:56:28'),
(46, 'App\\Models\\User', 17, 'auth-token', '8c145a0a9cedc0cedddc909384d96c4433b6ab8c35fdd5e03eb22e2eeaee33f7', '[\"*\"]', '2026-08-15 11:01:48', NULL, '2026-08-15 09:47:58', '2026-08-15 11:01:48'),
(47, 'App\\Models\\User', 13, 'auth-token', 'd46ce5c8570bc39989139c2b59c6e7a4c588f6c2b908134a7ad1a4ad8001a760', '[\"*\"]', '2026-08-20 17:44:16', NULL, '2026-08-19 18:44:07', '2026-08-20 17:44:16'),
(48, 'App\\Models\\User', 7, 'auth-token', '428c5b8797fab56d8a04470ba6a2ee2226acb09939d7091f24599267e6a32187', '[\"*\"]', '2026-08-19 18:57:02', NULL, '2026-08-19 18:54:12', '2026-08-19 18:57:02'),
(49, 'App\\Models\\User', 15, 'auth-token', 'c7bb567db720da57b9fb9a1b410b77408d9f6e614840d33ebcf7a5b15cc4cea8', '[\"*\"]', '2026-08-20 17:38:54', NULL, '2026-08-19 18:56:55', '2026-08-20 17:38:54'),
(50, 'App\\Models\\User', 7, 'auth-token', '7d96b991ae7e5609af6a3a1e489f9da88976917b1d5d093580354992fa4f3205', '[\"*\"]', '2026-08-20 17:45:36', NULL, '2026-08-20 17:42:01', '2026-08-20 17:45:36'),
(51, 'App\\Models\\User', 1, 'auth-token', 'ae0d6862b45698ecee2c59eca01e34467898f7f45533c31dd9851ba46359040b', '[\"*\"]', '2026-08-20 17:49:11', NULL, '2026-08-20 17:44:02', '2026-08-20 17:49:11'),
(52, 'App\\Models\\User', 15, 'auth-token', '9f4ab0c5e58d53b185d4c29da485d2ed0203f0e660a42d009951bc6ffe133ff6', '[\"*\"]', '2026-08-20 17:55:33', NULL, '2026-08-20 17:46:05', '2026-08-20 17:55:33'),
(53, 'App\\Models\\User', 1, 'auth-token', '7b8d65d846afd31bca9e1cb3f2c84205f9dbc080c107cf95c5460d7c0855c8cc', '[\"*\"]', '2026-08-20 18:31:06', NULL, '2026-08-20 17:53:58', '2026-08-20 18:31:06'),
(54, 'App\\Models\\User', 7, 'auth-token', '6b5713704daa754dcd35258f83f7ff0547d953be064794d64425d7be179997c1', '[\"*\"]', '2026-08-20 18:09:32', NULL, '2026-08-20 17:54:51', '2026-08-20 18:09:32'),
(55, 'App\\Models\\User', 18, 'auth-token', '2039f794145308caafc2bb8c780608f4c0cec1428c77605b5a68575362036332', '[\"*\"]', '2026-08-22 08:43:51', NULL, '2026-08-22 08:17:43', '2026-08-22 08:43:51'),
(56, 'App\\Models\\User', 1, 'auth-token', '3952764e417433957a2c2ed89e6137f149f726902c9a2104ef2981d3565660a9', '[\"*\"]', '2026-08-22 08:43:30', NULL, '2026-08-22 08:21:12', '2026-08-22 08:43:30'),
(57, 'App\\Models\\User', 13, 'auth-token', 'b9d6fe6b1b1d8fb07a513c3df3282b24f2911533fb64704b4e82f9e97c6703ab', '[\"*\"]', '2026-08-22 08:50:45', NULL, '2026-08-22 08:43:38', '2026-08-22 08:50:45'),
(58, 'App\\Models\\User', 12, 'auth-token', '4d66f88683849724e5648886cb76f19dd0674fc68f29967b605b69ff376d864d', '[\"*\"]', '2026-08-22 08:50:43', NULL, '2026-08-22 08:44:47', '2026-08-22 08:50:43'),
(59, 'App\\Models\\User', 13, 'auth-token', '348a8713be011178aa40d9ae773a21957abdf00894333d4c8c93aeb57d288273', '[\"*\"]', '2026-08-24 05:09:59', NULL, '2026-08-24 05:06:44', '2026-08-24 05:09:59'),
(60, 'App\\Models\\User', 18, 'auth-token', '081279883484c9431dd829288951f7b7d91d0d9ad7721f2554d8572ed9fb5559', '[\"*\"]', '2026-08-24 05:10:08', NULL, '2026-08-24 05:09:53', '2026-08-24 05:10:08'),
(61, 'App\\Models\\User', 1, 'auth-token', 'f78899dd0c26a70c8a6ebedc010f0284879a3beffc8a3979150cd111da2e0f77', '[\"*\"]', '2026-08-24 05:43:20', NULL, '2026-08-24 05:26:32', '2026-08-24 05:43:20'),
(62, 'App\\Models\\User', 13, 'auth-token', 'c66e0ba195c07fb93065efc4867caf69a8db95b65730959c62b029546d58008e', '[\"*\"]', '2026-08-24 05:40:00', NULL, '2026-08-24 05:27:15', '2026-08-24 05:40:00'),
(63, 'App\\Models\\User', 7, 'auth-token', 'ecf241ee939a78af733b8b749b8c403a24729ee6dd3853c8d1e05499bc98ab49', '[\"*\"]', '2026-08-24 05:30:10', NULL, '2026-08-24 05:29:35', '2026-08-24 05:30:10'),
(64, 'App\\Models\\User', 12, 'auth-token', 'fb03926eaee53561b116b1e71587f3c7e1a5c1604a357140afdd03553337f713', '[\"*\"]', '2026-08-24 05:43:27', NULL, '2026-08-24 05:39:53', '2026-08-24 05:43:27'),
(65, 'App\\Models\\User', 13, 'auth-token', '266a508caca0f06b8aebe8834d077cabbbe1d646bd9c584253b351e99987b3d9', '[\"*\"]', '2026-08-24 06:52:19', NULL, '2026-08-24 06:51:00', '2026-08-24 06:52:19'),
(66, 'App\\Models\\User', 1, 'auth-token', '2e50ebf8977fef458054e9e9f4df22efd68824cb5227962642e4f86cdfd79761', '[\"*\"]', '2026-08-24 06:54:06', NULL, '2026-08-24 06:52:08', '2026-08-24 06:54:06'),
(67, 'App\\Models\\User', 7, 'auth-token', '8cc6129899d229373d3b2712914ce377a2d13027bbcd7b7181e0ac4abea63507', '[\"*\"]', '2026-08-24 08:54:08', NULL, '2026-08-24 08:33:02', '2026-08-24 08:54:08'),
(68, 'App\\Models\\User', 7, 'auth-token', '34bf8288b98a2e3bef855088c56899be259fbdb2ba609bc3ce769bc23e6efc4a', '[\"*\"]', '2026-08-24 09:29:09', NULL, '2026-08-24 09:21:06', '2026-08-24 09:29:09'),
(69, 'App\\Models\\User', 1, 'auth-token', '54b393b167e612bf1fa44a5d743e972a107941254fdf30d35738a7da67b6d7d8', '[\"*\"]', '2026-08-24 09:28:55', NULL, '2026-08-24 09:23:56', '2026-08-24 09:28:55'),
(70, 'App\\Models\\User', 1, 'auth-token', 'b556d636873538c0f801f407f5b4cdddcc4216891235cd0aaac51f607a8464f7', '[\"*\"]', '2026-08-24 09:29:41', NULL, '2026-08-24 09:26:49', '2026-08-24 09:29:41'),
(71, 'App\\Models\\User', 13, 'auth-token', '85d1d3b68ee1102eefc38ab0011b441d9f95165db6cc3bf1043a28f93e5dfb0d', '[\"*\"]', '2026-08-24 09:31:48', NULL, '2026-08-24 09:28:12', '2026-08-24 09:31:48'),
(72, 'App\\Models\\User', 12, 'auth-token', '91ce4d9c61b9e89a6c0cd71368d50f56d785b824d27b2e7b6ad79e913e3b94d3', '[\"*\"]', '2026-08-24 09:54:19', NULL, '2026-08-24 09:29:19', '2026-08-24 09:54:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `medical_record_id` bigint(20) UNSIGNED NOT NULL,
  `medicine` varchar(255) NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `instructions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `medical_record_id`, `medicine`, `dosage`, `duration`, `instructions`, `created_at`, `updated_at`) VALUES
(1, 1, 'Lisinopril', '10 mg', '30 gün', 'Gündə 1 dəfə, səhər', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(2, 1, 'Aspirin Cardio', '100 mg', '30 gün', 'Gündə 1 dəfə, axşam yeməkdən sonra', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(3, 2, 'Amoksisillin', '500 mg', '7 gün', 'Gündə 3 dəfə', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(4, 2, 'Paracetamol', '500 mg', '5 gün', 'Hərarət 38°C-dən yuxarı olduqda', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(5, 3, 'Sumatriptan', '50 mg', '10 gün', 'Ağrı başlayanda 1 tablet', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(6, 4, 'Ferrum Lek', '100 mg', '90 gün', 'Gündə 1 dəfə, yeməkdən sonra', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(7, 4, 'Vitamin C', '500 mg', '90 gün', 'Dəmir preparatı ilə birlikdə', '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(8, 5, 'Diclofenac', '75 mg', '10 gün', 'Gündə 2 dəfə, yeməkdən sonra', '2026-07-27 14:05:58', '2026-07-27 14:05:58');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `reviews`
--

INSERT INTO `reviews` (`id`, `patient_id`, `doctor_id`, `rating`, `comment`, `is_approved`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 5, 'Hekimler cox pesekardir, randevu almaq da asandir.', 1, '2026-08-07 09:02:48', '2026-08-07 09:39:11'),
(2, 8, 1, 4, 'Delectus in ut consectetur dolor Nam', 1, '2026-08-22 08:43:15', '2026-08-22 08:44:16');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 'web', '2026-07-09 15:23:20', '2026-07-09 15:23:20'),
(2, 'admin', 'web', '2026-07-09 15:23:20', '2026-07-09 15:23:20'),
(3, 'doctor', 'web', '2026-07-09 15:23:20', '2026-07-09 15:23:20'),
(4, 'patient', 'web', '2026-07-09 15:23:20', '2026-07-09 15:23:20');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('FIOrPmzdILf9zWzNQ2rHYCLXh6b5x7WJQREROaIY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2ZheGRCV0FPUm9SeUdtMTYwTDNNZmhGZDE3djhodEdnNWFJaHB1aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1784056824),
('fyXKevO39xdtbO3rJEIyqUDRtx3DYP5ZfPr2aPkW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.129.0 Chrome/148.0.7778.280 Electron/42.6.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM3g3M3RIYlN6OGdlOTJOYXpxU2YyZGFrSHhDeThNOTFodnhMb1kzTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1784297645),
('H7QPCdxNTqLFxzcENx3PvvhKZDbybngU0N8Hkw4l', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8737', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZG9KR2hTMFpnVnZ1d0NoZ1ozYkNGOVdmenowaXEyV1VGSHRwTkt3UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1783791098),
('ije1NPF0c1Jxyj85ZveM9bn3cpagVTktJJfXbvdj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSlNvTWtvNGxxRE0yZk93RHZ3MGNrR21UYk0wQnR3VlViY0Q1eXBFTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1783789995),
('MPkeDzXaAvCQYCRzN1HNCkdjRYHfuTTqYES149OW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.128.0 Chrome/148.0.7778.271 Electron/42.5.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDVaMEJsMEZxU2U0RnVQcllNdmdsOGtyVU5ydlhPTkRvRGNWbU1ETCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1783791943),
('tyiRIXP71O4RoDl9iHVe3eWzcmjomKwnVRpRn1BC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.128.0 Chrome/148.0.7778.271 Electron/42.5.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnJFQ0NMODNUbDF4cEp3bVVDVjU1enVoY3g5N3NWZkY1YVFhN2ozdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1784049504),
('Ukl0P7jfml2GlVet69LT4rju06iFOyum6eQZTds9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8737', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzJzMFlxc3BWenhTODZlbUpqSjZxOFV4Z2ZJMTUxVVlka3gwUUNvNCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1783791115),
('vAekZoYk0jxzQgFqz5c2T2FBF77kNqNRIlAvPfjL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.128.0 Chrome/148.0.7778.271 Electron/42.5.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmFzaXVteHRrZkhIQTdkTFB5ZUlMUU5YNFphWHNqWmJlbE9xQWtHOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1784057018);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `group`, `created_at`, `updated_at`) VALUES
(1, 'clinic_address', 'Bakı şəhəri, Nərimanov r., Atatürk pr. 59', 'contact', '2026-08-12 12:35:32', '2026-08-12 12:43:01'),
(2, 'clinic_phone', '+994 (12) 345 67 89', 'contact', '2026-08-12 12:35:32', '2026-08-12 12:35:32'),
(3, 'clinic_whatsapp', '994123456789', 'contact', '2026-08-12 12:35:32', '2026-08-12 12:35:32'),
(4, 'clinic_email', 'info@novacare.az', 'contact', '2026-08-12 12:35:32', '2026-08-12 12:35:32'),
(5, 'clinic_working_hours', 'Bazar ertəsi - Şənbə: 08:30 - 19:00', 'contact', '2026-08-12 12:35:32', '2026-08-12 12:35:32'),
(6, 'clinic_short_address', 'Bakı ş., Azərbaycan', 'contact', '2026-08-12 12:35:32', '2026-08-12 12:35:32');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Anar Məmmədov', 'doctor@hms.test', '2026-07-27 14:05:56', '$2y$12$852nNRjdsNR0MbPMF6luXuu6C/JCJGebV.28u4A49RJSezurx3N8y', NULL, '2026-07-27 14:05:56', '2026-07-27 14:05:56'),
(2, 'Dr. Leyla Hüseynova', 'leyla.h@hms.test', '2026-07-27 14:05:56', '$2y$12$BaBe4ka5WC7w1nEvZEJh/OBWNxkjHi0EDJLJihLGdsBsllvWaKDoG', NULL, '2026-07-27 14:05:56', '2026-07-27 14:05:56'),
(3, 'Dr. Elçin Quliyev', 'elcin.q@hms.test', '2026-07-27 14:05:57', '$2y$12$shgTf1S3KYKg0Kn5dHh6SetPXelwL8VLYJIil/GXnoRHcbd4CRgKu', NULL, '2026-07-27 14:05:57', '2026-07-27 14:05:57'),
(4, 'Dr. Nigar Əliyeva', 'nigar.a@hms.test', '2026-07-27 14:05:57', '$2y$12$Q11RV.tfNyLl0FfOp0CUA.EJhOrAchXAg4WKMyty.rbLnmUh2cJrm', NULL, '2026-07-27 14:05:57', '2026-07-27 14:05:57'),
(5, 'Dr. Rəşad Kərimov', 'resad.k@hms.test', '2026-07-27 14:05:57', '$2y$12$Z4NEUuJ5ODHQx4o3ouA2HuL9tqpYdUFpWtAuock7F8/ZlAi8DvYUK', NULL, '2026-07-27 14:05:57', '2026-07-27 14:05:57'),
(6, 'Dr. Günel Bağırova', 'gunel.b@hms.test', '2026-07-27 14:05:57', '$2y$12$cNqCyf2UsI6uLaRGp4Akr.ZhXQUcQSHV6vvIUGQZK8LC1i/ipCG/O', NULL, '2026-07-27 14:05:57', '2026-07-27 14:05:57'),
(7, 'Kamran Səfərov', 'patient@hms.test', '2026-07-27 14:05:58', '$2y$12$iZKoBAjHR0HpMSwn9Ws8Re0owDHK9vUEw0BPS1TCZwlnm4F9KlZ7O', NULL, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(8, 'Aysel Rəhimova', 'aysel.r@hms.test', '2026-07-27 14:05:58', '$2y$12$qSk7Q.8nI7Ndc1t4tuUnmuSZ26iU.ERLbXMbk90Jxhh7tmd31CCJ6', NULL, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(9, 'Tural Abbasov', 'tural.a@hms.test', '2026-07-27 14:05:58', '$2y$12$1ySv0dzXc/BQqDeVH31cXebTZja10h/ae6Yrk4KeNy7ic/Z72IE7y', NULL, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(10, 'Səbinə Nəbiyeva', 'sebine.n@hms.test', '2026-07-27 14:05:58', '$2y$12$LW9j7tm7cUHuC.kHeC7E6..7CHsH4yffVQPsF037R41lfB163lM/e', NULL, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(11, 'Orxan Vəliyev', 'orxan.v@hms.test', '2026-07-27 14:05:58', '$2y$12$kSCh2dQj1R0AOWAMQtjDSOcjnlqQV0TDz5gCrhoI9YumBOdig16sC', NULL, '2026-07-27 14:05:58', '2026-07-27 14:05:58'),
(12, 'Super Admin', 'superadmin@hms.test', '2026-07-27 14:05:59', '$2y$12$SNfFCO0YjC5c52HmnFbYDOZpEPkrUJMCH.iVqteP9HSxLbzg9rRQa', NULL, '2026-07-27 14:05:59', '2026-07-27 14:05:59'),
(13, 'Admin', 'admin@hms.test', '2026-07-27 14:05:59', '$2y$12$s32gF1lPSNxCVuLBIaVvHOs6pXfsdf3..mbshzgGBqz2bk1CYa2ni', NULL, '2026-07-27 14:05:59', '2026-08-06 12:03:34'),
(14, 'Felix Chambers', 'hacermammedzade@gmail.com', '2026-07-28 18:14:23', '$2y$12$1E.BAjh1b5xkuw.aUeB/kOwlESAHbmmk7yCAWpu8ya1m3PG9jHVIK', NULL, '2026-07-28 18:13:36', '2026-07-28 18:14:23'),
(15, 'Chandler Noel', 'mammedzadehacer@gmail.com', '2026-08-10 14:44:45', '$2y$12$R6DsZJDtD9xXNQrCxsJCnOVFBPC6cKFyXfXYZzI5L3rOVjENneu.S', NULL, '2026-08-10 14:43:53', '2026-08-10 14:44:45'),
(16, 'Michelle Roy', 'mmmdzadfrid66@gmail.com', '2026-08-10 14:57:10', '$2y$12$vzTnbjT7s494hkcrt1.TdeHFwpcGAZHAliwfF0GPyhXzVvemisrYi', NULL, '2026-08-10 14:56:56', '2026-08-10 14:57:10'),
(17, 'Hajar Mammadzada', 'hmamedova066@gmail.com', '2026-08-11 08:46:10', '$2y$12$sqQH6LEoCKWYW/geut5kK.3hbQTxB0YUWhxKN4GxLsa3QmIJGMBSm', NULL, '2026-08-11 08:46:10', '2026-08-11 08:46:10'),
(18, 'Nisi esse laudantiu', 'xayalasad88@gmail.com', '2026-08-22 08:17:17', '$2y$12$BMk2nE8Cz0DbLX4x3qEsFeObA792neZQ2hkzVQRCVpTvpmbagNf7S', NULL, '2026-08-22 08:14:12', '2026-08-24 05:09:30'),
(20, 'Behruz Eliyev', 'mamedovahajar945@gmail.com', '2026-08-24 09:32:05', '$2y$12$JrxwRx89K0ZxIKw1PDJtiOmNCQh6N4L7Te111eiFaBrFlfZgV0A32', NULL, '2026-08-24 09:32:05', '2026-08-24 09:32:05');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `ai_messages`
--
ALTER TABLE `ai_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ai_messages_user_id_foreign` (`user_id`);

--
-- Tablo için indeksler `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_patient_id_foreign` (`patient_id`),
  ADD KEY `appointments_doctor_id_foreign` (`doctor_id`);

--
-- Tablo için indeksler `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Tablo için indeksler `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Tablo için indeksler `call_logs`
--
ALTER TABLE `call_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `call_logs_caller_id_foreign` (`caller_id`),
  ADD KEY `call_logs_receiver_id_foreign` (`receiver_id`);

--
-- Tablo için indeksler `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversations_user_one_id_foreign` (`user_one_id`),
  ADD KEY `conversations_user_two_id_foreign` (`user_two_id`);

--
-- Tablo için indeksler `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doctors_user_id_unique` (`user_id`),
  ADD KEY `doctors_department_id_foreign` (`department_id`);

--
-- Tablo için indeksler `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_schedules_doctor_id_foreign` (`doctor_id`);

--
-- Tablo için indeksler `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Tablo için indeksler `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_appointment_id_unique` (`appointment_id`),
  ADD KEY `invoices_patient_id_foreign` (`patient_id`);

--
-- Tablo için indeksler `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Tablo için indeksler `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `lab_tests`
--
ALTER TABLE `lab_tests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lab_tests_patient_id_foreign` (`patient_id`),
  ADD KEY `lab_tests_doctor_id_foreign` (`doctor_id`);

--
-- Tablo için indeksler `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `medical_records_appointment_id_unique` (`appointment_id`),
  ADD KEY `medical_records_patient_id_foreign` (`patient_id`),
  ADD KEY `medical_records_doctor_id_foreign` (`doctor_id`);

--
-- Tablo için indeksler `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_conversation_id_foreign` (`conversation_id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`);

--
-- Tablo için indeksler `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Tablo için indeksler `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Tablo için indeksler `password_reset_codes`
--
ALTER TABLE `password_reset_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_reset_codes_email_index` (`email`);

--
-- Tablo için indeksler `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Tablo için indeksler `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patients_user_id_unique` (`user_id`);

--
-- Tablo için indeksler `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Tablo için indeksler `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Tablo için indeksler `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prescriptions_medical_record_id_foreign` (`medical_record_id`);

--
-- Tablo için indeksler `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_patient_id_foreign` (`patient_id`),
  ADD KEY `reviews_doctor_id_foreign` (`doctor_id`);

--
-- Tablo için indeksler `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Tablo için indeksler `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Tablo için indeksler `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Tablo için indeksler `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `ai_messages`
--
ALTER TABLE `ai_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Tablo için AUTO_INCREMENT değeri `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Tablo için AUTO_INCREMENT değeri `call_logs`
--
ALTER TABLE `call_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Tablo için AUTO_INCREMENT değeri `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Tablo için AUTO_INCREMENT değeri `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Tablo için AUTO_INCREMENT değeri `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `lab_tests`
--
ALTER TABLE `lab_tests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Tablo için AUTO_INCREMENT değeri `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Tablo için AUTO_INCREMENT değeri `password_reset_codes`
--
ALTER TABLE `password_reset_codes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- Tablo için AUTO_INCREMENT değeri `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `ai_messages`
--
ALTER TABLE `ai_messages`
  ADD CONSTRAINT `ai_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `call_logs`
--
ALTER TABLE `call_logs`
  ADD CONSTRAINT `call_logs_caller_id_foreign` FOREIGN KEY (`caller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `call_logs_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_user_one_id_foreign` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_user_two_id_foreign` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `doctors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `doctor_schedules_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `lab_tests`
--
ALTER TABLE `lab_tests`
  ADD CONSTRAINT `lab_tests_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lab_tests_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `medical_records_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medical_records_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_medical_record_id_foreign` FOREIGN KEY (`medical_record_id`) REFERENCES `medical_records` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
