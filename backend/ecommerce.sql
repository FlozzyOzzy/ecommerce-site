-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 07, 2026 at 01:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(10, 7, '2026-07-04 19:58:24', '2026-07-04 19:58:24'),
(11, 6, '2026-07-04 19:59:58', '2026-07-04 19:59:58'),
(12, 4, '2026-07-07 08:59:37', '2026-07-07 08:59:37'),
(13, 2, '2026-07-07 09:07:05', '2026-07-07 09:07:05');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `shipping_address`, `phone`, `created_at`, `updated_at`) VALUES
(5, 6, 1500.00, 'pending', '12345 Street', '+254 716299748', '2026-07-04 20:00:28', '2026-07-04 20:00:28'),
(6, 6, 500.00, 'pending', '12345 strest', '+254 716299748', '2026-07-04 20:12:10', '2026-07-04 20:12:10'),
(7, 6, 10500.00, 'paid', '123 Test St', '0712345678', '2026-07-04 20:26:00', '2026-07-04 20:26:03'),
(8, 4, 12000.00, 'paid', '12345 Street', '254716299748', '2026-07-07 09:00:05', '2026-07-07 09:00:17'),
(9, 4, 500.00, 'paid', 'Jumuia Mall', '254716299748', '2026-07-07 09:02:59', '2026-07-07 09:03:05');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`, `created_at`) VALUES
(6, 5, 9, 'Charging Cable', 3, 500.00, '2026-07-04 20:00:28'),
(7, 6, 9, 'Charging Cable', 1, 500.00, '2026-07-04 20:12:10'),
(8, 7, 5, 'Wireless Headphones', 2, 2500.00, '2026-07-04 20:26:00'),
(9, 7, 6, 'Toaster', 1, 5500.00, '2026-07-04 20:26:00'),
(10, 8, 12, 'Coffee Maker', 1, 12000.00, '2026-07-07 09:00:05'),
(11, 9, 9, 'Charging Cable', 1, 500.00, '2026-07-07 09:02:59');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(500) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `title`, `description`, `category`, `price`, `image`, `stock_quantity`, `created_at`) VALUES
(5, 'Wireless Headphones', 'Beats by Dre provides listeners with high quality sound experince. The headphones are bluetooth enabled, has noise cancalation capabilities and are small enough to fit in a bag. They come in different colors including black, pink and grey.', 'Electronics', 2500.00, 'headphones.jpg', 39, '2026-07-04 18:53:22'),
(6, 'Toaster', 'For that perfect bread for breakfast use our toaster for crunchy, hot and crispy bread. It contains a timer for you to set the perfect time for your bread to toast.', 'Electronics', 5500.00, 'kristyna-squared-one-aaQdIkeJoAI-unsplash.jpg', 21, '2026-07-04 19:33:35'),
(7, 'Ear Pods', 'For the perfect listening partner get our ear pods which are perfectly curated for different songs in your play list. Level up your listening experince to feel like you are in a party. It is bluetooth enabled, has skip and pause capabilities and you can comfortably pick your calls without needing to pick the call using your phone', 'Electronics', 2000.00, 'amanz-JRK8tsVv3y0-unsplash.jpg', 15, '2026-07-04 19:35:49'),
(8, 'Microwave Oven', 'This microwave oven is perfect for warming food to the perfect temperature. You can also use to bake food in it upto 20L. It has a timer which you can use to adjust the cooking time, it has a bell which rings when the food is ready and mechanisms that help protect the food from burning when the food exceeds a certain temperature.', 'Electronics', 15000.00, 'louis-hansel-ktVKZRYUP4Y-unsplash.jpg', 5, '2026-07-04 19:41:55'),
(9, 'Charging Cable', 'Type-C to C charging cable which is appropriate for android phones. It has fast charging capabilities and can be used to transfer files and other media files. It comes in white and black colors', 'Electronics', 500.00, 'andrey-matveev-f0EpYkZ-cp4-unsplash.jpg', 100, '2026-07-04 19:44:30'),
(10, '2-in-1 Juicer', 'This is a high-powered 2-in-1 Juicer which can be used to blend juices and also grind whole spices to be grounded. This juicer can blend even hard food items like carrots and grin hard nuts. ', 'Electronics', 6000.00, 'lens-fables-OMBCcu4VQj0-unsplash.jpg', 10, '2026-07-04 19:47:49'),
(11, 'Hand Mixer', 'No need to mix your dough by hand use our mixer which can be used to create different textures of dough. Whether you are making pancakes or a pound cake this mixer can create the perfect consistency for your pastry.', 'Electronics', 10000.00, 'linus-belanger-1B7sCkW8g14-unsplash.jpg', 7, '2026-07-04 19:49:37'),
(12, 'Coffee Maker', 'Trying to get the perfect coffee for your mornings? Get our coffee maker for the perfect morning to start your day. It has the capacity to make upto 10L of coffee at a go and you can adjust your coffee intensity to your liking.', 'Electronics', 12000.00, 'nubelson-fernandes-EXWlqnU-iUc-unsplash.jpg', 13, '2026-07-04 19:52:10'),
(13, 'Electric Kettle', 'No need to warm your water using your stove, grab our electric heater which you can use to heat your water. It has an on and off switch which you can use to heat the water to your preference. It also has an automatic off switch when the water reaches its boiling water. ', 'Electronics', 5500.00, 'gleb-paniotov-N6Bm7zMCZUo-unsplash.jpg', 24, '2026-07-04 19:54:45'),
(14, 'Electric Heater', 'It is winter, don\'t let the cold kill you. Get our electric heater which can help to warm up the room and you without consuming a lot of energy. You can adjust to the heat level you want and it has an autmoatic off switch when the heater has been on for too long.', 'Electronics', 27000.00, 'e24-ah03LdkafTA-unsplash.jpg', 9, '2026-07-04 19:57:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id` int(50) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`firstname`, `lastname`, `email`, `phone`, `password`, `id`, `role`) VALUES
('Jane', 'Doe', 'jane@gmail.com', '0111111111', '123456', 1, 'customer'),
('James', 'Lebron', 'james@gmail.com', '0111111111', 'scrypt:32768:8:1$ZCFVa3huD3JFSqNL$4a169c6d21bdbc5e0f00c931d9e4dc5c281157ffff48700c53ec18e406b48778fd33ff7e7570c7bfa62dbb9f7129f592518a1828762f65710c4e2a5576bca1c4', 2, 'customer'),
('Test', 'User', 'test3@example.com', '1234567890', 'secret123', 3, 'customer'),
('Karen', 'Mamba', 'karen@gmail.com', '0111222222', 'scrypt:32768:8:1$u5SoE8dDH5kJgefX$1bf4125e0372deab6dc588c9c0bec76d0eb187b032b9456cbb3bd82a1d7c5afb041ebcc43bf91314be0a2054f3c5ceb8434589ee88fbcfb0b88b234a4b527359', 4, 'customer'),
('June', 'Dec', 'june@gmail.com', '1234567890', 'password', 5, 'customer'),
('July', 'August', 'july@gmail.com', '0987654321', 'scrypt:32768:8:1$757yODWfYXLmMp4L$0ade619166dcfa5aaf762142d4c520f4a665bc5880d9dae889a7a45f2fef050e0ed9e2e64f88c226f9f628fc625ede0020410046cb5ef2aade345f6b74293eaf', 6, 'customer'),
('Admin', '', 'admin@gmail.com', '0111111111', 'scrypt:32768:8:1$tsHVqbchlZEHAlew$d3946e388a4c0fcf9efd6d7913d3168daa1303784d725feeebc83c397af533ab6bcbe7de36c3cef785beb6e6b11803759cb2d07700752fc3744f9c0ae10f1e35', 7, 'admin'),
('Aylani', 'Wangare', 'aylani@gmail.com', '0222222222', 'Secret', 8, 'customer'),
('Alma ', 'Wanjiru', 'alma@gmail.com', '0333333333', 'Secret', 9, 'customer'),
('Olivia ', 'Benson', 'olivia@gmail.com', '0111111111', 'scrypt:32768:8:1$5S7hEZRd8kv26UnA$4aa4f459b80efb23179e9f6c785fbeb252b6d44b742728d0102c61c5a4d4ef8c173f887fcf120fa9e1cd2e8ca114ad988f1c62a364e719a6605fafd30efdd00a', 10, 'customer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
