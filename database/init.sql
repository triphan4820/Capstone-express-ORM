SET NAMES utf8mb4;

DROP DATABASE IF EXISTS expressjs_orm_db;
CREATE DATABASE expressjs_orm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expressjs_orm_db;

CREATE TABLE users (
  user_id   INT AUTO_INCREMENT PRIMARY KEY,
  email     VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  age       INT,
  avatar    VARCHAR(500)
);

CREATE TABLE images (
  image_id    INT AUTO_INCREMENT PRIMARY KEY,
  image_name  VARCHAR(255) NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  description VARCHAR(1000),
  user_id     INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments (
  comment_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  image_id     INT NOT NULL,
  comment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content      VARCHAR(1000) NOT NULL,
  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE
);

CREATE TABLE saved_images (
  user_id    INT NOT NULL,
  image_id   INT NOT NULL,
  saved_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, image_id),
  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE
);

INSERT INTO users (email, password, full_name, age, avatar) VALUES
('an.nguyen@gmail.com', '$2b$10$HWMKccFEiks9fnkTPwWTF.i./vVWPUqy7Ntq3z5EFjZIdCT2Ga0/6', 'Nguyễn Thị An', 24, 'https://i.pravatar.cc/150?img=21'),
('bao.tran@gmail.com', '$2b$10$HWMKccFEiks9fnkTPwWTF.i./vVWPUqy7Ntq3z5EFjZIdCT2Ga0/6', 'Trần Quốc Bảo', 26, 'https://i.pravatar.cc/150?img=14'),
('cam.le@gmail.com', '$2b$10$HWMKccFEiks9fnkTPwWTF.i./vVWPUqy7Ntq3z5EFjZIdCT2Ga0/6', 'Lê Thị Cẩm', 22, 'https://i.pravatar.cc/150?img=32'),
('dinh.pham@gmail.com', '$2b$10$HWMKccFEiks9fnkTPwWTF.i./vVWPUqy7Ntq3z5EFjZIdCT2Ga0/6', 'Phạm Văn Định', 28, 'https://i.pravatar.cc/150?img=9');

INSERT INTO images (image_name, image_url, description, user_id) VALUES
('Tầng xanh trong căn nhà', 'https://picsum.photos/id/1018/700/1000', 'Phong cách sống xanh, dễ chịu và thư thái', 1),
('Bữa sáng kiểu Nhật', 'https://picsum.photos/id/1020/700/900', 'Món ăn sáng đẹp mắt, ăn là thích', 2),
('Đồi cỏ mùa hè', 'https://picsum.photos/id/1041/800/1100', 'Cảnh nền thiên nhiên dịu mắt', 3),
('Góc làm việc tối giản', 'https://picsum.photos/id/1066/800/1000', 'Workspace đẹp, sáng tạo và hiệu quả', 1),
('Mèo ngồi trên xe', 'https://picsum.photos/id/40/800/1000', 'Meme mèo cute khiến mọi ngày vui hơn', 4),
('Cửa sổ ban mai', 'https://picsum.photos/id/1072/700/900', 'Ánh sáng đẹp cho ngày mới bắt đầu', 2),
('Phối màu pastel', 'https://picsum.photos/id/1080/700/900', 'Aesthetic pastel cho style cá nhân', 3),
('Sách và cà phê', 'https://picsum.photos/id/1069/700/1000', 'Mood đọc sách, uống cafe và thở dài', 4),
('Đường phố nhộn nhịp', 'https://picsum.photos/id/1048/700/1000', 'City life đang sống, đang cảm nhận', 1),
('Mặt trời lặn trên biển', 'https://picsum.photos/id/1002/700/1000', 'Hình ảnh biển tối giản, thư giãn tuyệt vời', 2);

INSERT INTO comments (user_id, image_id, comment_date, content) VALUES
(2, 1, '2026-09-10 08:20:00', 'Không gian này đẹp quá, muốn ở ngay thôi!'),
(3, 1, '2026-09-10 09:10:00', 'Màu xanh làm thấy dễ chịu thật sự'),
(4, 3, '2026-09-11 18:30:00', 'Cảnh này nhìn là muốn đi du lịch ngay'),
(1, 5, '2026-09-12 12:45:00', 'Mèo này đáng yêu quá trời'),
(2, 7, '2026-09-13 21:15:00', 'Màu pastel rất dịu mắt, lưu lại rồi'),
(3, 9, '2026-09-14 07:55:00', 'Đường phố này có vibe rất riêng');

INSERT INTO saved_images (user_id, image_id, saved_date) VALUES
(1, 2, '2026-09-10 08:30:00'),
(1, 4, '2026-09-10 09:00:00'),
(2, 3, '2026-09-11 18:40:00'),
(3, 7, '2026-09-13 21:25:00'),
(4, 5, '2026-09-12 12:50:00'),
(2, 10, '2026-09-14 08:05:00');

