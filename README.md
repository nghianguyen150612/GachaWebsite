# GachaWebsite

Dự án bài cuối khóa — website gacha với nhiều mini-app tích hợp.

## Tính năng

- **Đăng ký / Đăng nhập** — lưu tài khoản demo trong `localStorage`
- **Vòng quay may mắn** — quay ngẫu nhiên để mở các trang con
- **Cửa hàng (Buyer)** — mua sắm thiết bị điện tử với giỏ hàng
- **Kho game (Stream)** — duyệt và thêm game vào giỏ hàng
- **iTube** — xem video có sẵn trong trang
- **Nghe nhạc** — phát các file nhạc đi kèm
- **Đồng hồ** — giờ hiện tại, hẹn giờ, bấm giờ và múi giờ quốc tế
- **Báo lỗi** — gửi phản hồi về sự cố (demo)

## Cấu trúc thư mục

```
GachaWebsite/
├── index.html          # Chuyển hướng sang trang đăng ký
├── script.js           # Đăng ký, đăng nhập, vòng quay
├── gio-hang.js         # Module giỏ hàng dùng chung
├── MainPage/           # Trang chủ với vòng quay
├── Login/ SignUp/      # Xác thực người dùng
├── Buyer/ Stream/      # Cửa hàng & kho game
├── iTube/              # Trình phát video
├── MusicListener/      # Trình phát nhạc
├── YourTime/           # Đồng hồ & hẹn giờ
├── ReportPage/         # Báo lỗi
└── CSS/                # Stylesheet
```

## Chạy dự án

Mở `index.html` bằng trình duyệt hoặc dùng live server. Không cần cài đặt thêm.

## Tác giả

Công Nghĩa & Khôi Nguyên
