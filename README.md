# Portfolio site (theme Björk) + CMS quản lý dự án

Site portfolio cá nhân 5 trang (Trang chủ, Portfolio, Blog, Giới thiệu, Liên hệ), song ngữ VI/EN, phong cách theme **Björk**. Trang **Portfolio** được phục vụ bởi một server Node.js nhỏ để bạn có thể thêm/sửa/xoá dự án qua giao diện quản trị thay vì sửa code tay.

## Cài đặt

```bash
npm install
npm start
```

Server chạy tại `http://localhost:3000`.

Các trang Trang chủ, Blog, Giới thiệu, Liên hệ vẫn là HTML tĩnh (`index.html`, `blog.html`, `about.html`, `contact.html`) — nội dung sửa trực tiếp trong file. Riêng trang **Portfolio** (`/portfolio`) được render từ dữ liệu lưu ở `data/projects.json`, quản lý qua `/portfolio/admin`.

## Đăng nhập quản trị lần đầu

Lần chạy `npm start` **đầu tiên**, server tự tạo một tài khoản admin và **in mật khẩu ra console đúng một lần**:

```
================================================================
 Tài khoản CMS admin vừa được tạo (chỉ hiện MỘT LẦN DUY NHẤT):
   Đăng nhập tại : /portfolio/admin/login
   Tên đăng nhập : admin
   Mật khẩu      : xxxxxxxxxxxx
================================================================
```

Hãy lưu lại mật khẩu này, truy cập `http://localhost:3000/portfolio/admin/login` để đăng nhập, sau đó vào **Đổi mật khẩu** để đặt mật khẩu bạn tự chọn.

Nếu muốn tự chỉ định tên đăng nhập/mật khẩu ngay từ đầu (thay vì để hệ thống random), xoá thư mục `data/` (nếu đã lỡ chạy) rồi chạy:

```bash
ADMIN_USER=ten-cua-ban ADMIN_PASSWORD=mat-khau-cua-ban npm start
```

(Trên PowerShell: `$env:ADMIN_USER="..."; $env:ADMIN_PASSWORD="..."; npm start`)

Biến này **chỉ có tác dụng ở lần chạy đầu tiên** — sau đó tài khoản đã được lưu vào `data/admin.json` (mật khẩu đã băm bcrypt, không lưu dạng chữ thường).

## Quản lý dự án Portfolio

- `/portfolio/admin` — danh sách dự án, có nút Thêm / Sửa / Xoá.
- Mỗi dự án có: ảnh, tên (VI + EN), 2 tag (VI + EN), mô tả (VI + EN), link chi tiết, thứ tự hiển thị.
- Ảnh upload được lưu ở `assets/uploads/`.
- Nút VI/EN trên trang public đọc đúng bản dịch bạn nhập cho từng dự án — không cần sửa code.

## Cấu trúc dữ liệu

- `data/projects.json` — danh sách dự án (tự tạo với 6 dự án mẫu nếu chưa có).
- `data/admin.json` — tài khoản admin (username + mật khẩu đã băm).
- `data/session-secret.txt` — khoá ký session, tự sinh ngẫu nhiên.

Toàn bộ thư mục `data/` và `assets/uploads/` **không nên commit lên Git** (đã có trong `.gitignore`) vì chứa dữ liệu/ảnh riêng của bạn.

## Ghi chú khi tự host (self-host)

- Đặt lại cổng bằng biến môi trường `PORT` (mặc định `3000`).
- Nên chạy qua một process manager (vd. `pm2 start server.js --name portfolio`) để tự khởi động lại khi crash hoặc reboot server.
- Nên đặt một reverse proxy (Nginx/Caddy) phía trước để bật HTTPS — cookie session hiện đặt `sameSite: lax`, có thể bật thêm `secure: true` trong `server.js` khi đã chạy HTTPS.
- Form liên hệ ở trang `contact.html` vẫn trỏ tới Formspree (`https://formspree.io/f/your-form-id`) — cần thay ID thật, vì đây là trang tĩnh không có backend riêng cho form liên hệ.
- Ảnh/nội dung mẫu (avatar, feature-1/2/3, tên "Tên Của Bạn") vẫn là placeholder — thay bằng nội dung thật của bạn ở `about.html`, `index.html`, `blog.html`, `contact.html`, và qua trang quản trị cho Portfolio.
