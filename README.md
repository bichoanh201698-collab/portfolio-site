# Portfolio site (theme Björk) + CMS quản lý dự án

Site portfolio cá nhân 5 trang (Trang chủ, Portfolio, Blog, Giới thiệu, Liên hệ), song ngữ VI/EN, phong cách theme **Björk**. Trang **Portfolio** được phục vụ bởi một server Node.js nhỏ để bạn có thể thêm/sửa/xoá dự án qua giao diện quản trị thay vì sửa code tay.

## Cài đặt

```bash
npm install
npm start
```

Server chạy tại `http://localhost:3000`.

Các trang Trang chủ, Giới thiệu, Liên hệ vẫn là HTML tĩnh (`index.html`, `about.html`, `contact.html`) — nội dung sửa trực tiếp trong file. Riêng **Portfolio** (`/portfolio`) và **Blog** (`/blog.html`) được render từ dữ liệu lưu ở `data/projects.json` và `data/blog.json`, quản lý qua `/portfolio/admin` và `/blog/admin`.

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

- `data/projects.json` — danh sách dự án thật (28 dự án), **có commit lên Git** vì đây là nội dung thật của site, không phải dữ liệu tạm.
- `data/blog.json` — danh sách bài blog thật, cũng commit lên Git.
- `assets/uploads/` — ảnh/video của từng dự án, cũng commit lên Git.
- `data/admin.json` — tài khoản admin (username + mật khẩu đã băm). **Không commit** (đã có trong `.gitignore`).
- `data/session-secret.txt` — khoá ký session, tự sinh ngẫu nhiên. **Không commit** (đã có trong `.gitignore`).

Vì `data/admin.json` và `data/session-secret.txt` không nằm trong Git, mỗi môi trường (máy local, server production) sẽ tự sinh tài khoản admin và khoá session riêng ở lần chạy đầu tiên.

## Deploy lên Railway (khuyến nghị)

Site này không dùng database — toàn bộ nội dung nằm trong `data/*.json` và `assets/`, nên cần một nền tảng host chạy được Node.js liên tục (không phải static hosting) và có ổ đĩa để lưu ảnh upload mới. **Railway (gói Hobby, $5/tháng)** là lựa chọn phù hợp nhất cho quy mô site này.

1. Push repo này lên GitHub (repo có thể để private).
2. Trên Railway: **New Project → Deploy from GitHub repo**, chọn repo vừa push. Railway tự nhận diện Node.js qua `package.json` (`npm start`), không cần cấu hình thêm.
3. Vào tab **Variables**, đặt các biến môi trường:
   - `SITE_URL` = domain thật sau khi deploy (vd. `https://shinetu.net` hoặc domain Railway cấp) — dùng cho sitemap.xml, robots.txt, thẻ OG/Twitter.
   - `ADMIN_USER` / `ADMIN_PASSWORD` = tên đăng nhập/mật khẩu admin bạn tự chọn (đặt **trước** lần deploy đầu tiên, vì các biến này chỉ có tác dụng khi `data/admin.json` chưa tồn tại).
   - `NODE_ENV` = `production` (bật cookie session `secure` đúng cách sau proxy HTTPS của Railway).
4. **Volume (khuyến nghị)**: nếu bạn dự định thêm/sửa dự án qua `/portfolio/admin` ngay trên production, gắn một Railway Volume vào đường dẫn `/app/assets/uploads` để ảnh/video upload mới không bị mất khi redeploy. Riêng `data/projects.json` và `data/blog.json` nên tiếp tục sửa ở máy local rồi `git push` như hiện tại (đơn giản, có lịch sử Git) — nếu gắn volume luôn vào `/app/data`, lần deploy đầu volume rỗng sẽ che mất nội dung thật đã commit.
5. Sau khi deploy xong, xem log lần chạy đầu để lấy mật khẩu admin (nếu không đặt `ADMIN_PASSWORD` ở bước 3), rồi đăng nhập `/portfolio/admin/login` và đổi mật khẩu.
6. Trỏ domain thật (nếu có) vào Railway qua tab **Settings → Domains**.

## Việc cần làm trước khi public site

- **Form liên hệ đang trỏ tới Formspree placeholder** (`https://formspree.io/f/your-form-id` trong `contact.html`) — cần tạo form thật tại formspree.io và thay ID này, nếu không form sẽ không gửi được.

## Ghi chú khi tự host (self-host)

- Đặt lại cổng bằng biến môi trường `PORT` (mặc định `3000`).
- Nên chạy qua một process manager (vd. `pm2 start server.js --name portfolio`) để tự khởi động lại khi crash hoặc reboot server.
- Nên đặt một reverse proxy (Nginx/Caddy) phía trước để bật HTTPS, và đặt `NODE_ENV=production` để cookie session tự bật `secure` đúng cách.
