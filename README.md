# GreenGO — Thuê Xe Điện Đà Nẵng

Trang giới thiệu và đặt xe cho GreenGO, dịch vụ cho thuê xe máy điện tại Đà Nẵng.
Toàn bộ trang nằm trong một file HTML tĩnh, không cần bước build, không phụ thuộc
framework hay package nào.

## Chạy thử trên máy

Mở thẳng `index.html` bằng trình duyệt là xem được. Nếu muốn chạy qua máy chủ cục bộ
(để đường dẫn ảnh và iframe bản đồ hoạt động đúng như trên môi trường thật):

```bash
python -m http.server 4181
```

Rồi mở http://127.0.0.1:4181/

## Cấu trúc

```
index.html            Trang chủ
pricing.html          Bảng giá chi tiết, phần "đã bao gồm" và câu hỏi thường gặp
procedure.html        Năm bước thuê xe và vài mẹo đi đường
about.html            Giới thiệu GreenGO
assets/
  site.css            Toàn bộ CSS, dùng chung cho cả bốn trang
  site.js             Toàn bộ JavaScript: đa ngôn ngữ, modal, chi nhánh, quy đổi USD
  brand/              Logo GreenGO và ảnh thương hiệu
    logo-badge.png        Huy hiệu tròn — dùng ở header, footer và favicon
    logo-horizontal.png   Logo ngang — dùng trong khối "Thủ Tục Thuê Xe"
    logo-stacked.png      Logo xếp dọc — hiện chưa dùng, để dự phòng
    xe-may-dien.png       Ảnh xe ở khu vực hero và mục "Xe Bạn Sẽ Nhận"
    non-bao-hiem.png      Mũ bảo hiểm GreenGO — mục "Xe Bạn Sẽ Nhận"
    cua-hang.jpg          Mặt tiền cửa hàng — mục "Xe Bạn Sẽ Nhận"
    banner.jpg            Banner thương hiệu — đầu trang Giới Thiệu
  socials/            Icon Zalo, Messenger, WhatsApp, KakaoTalk, WeChat, Telegram
  vn/gb/kr/cn/jp.png  Cờ cho bộ chọn ngôn ngữ
```

## Những chỗ hay phải sửa

Tất cả đều nằm trong `assets/site.js`, dùng chung cho cả bốn trang — sửa một lần là
mọi trang cập nhật theo. Riêng phần khung (header, footer, modal) thì được lặp lại trong
từng file HTML, nên nếu đổi cấu trúc khung thì nhớ sửa ở cả bốn file.

**Thông tin liên hệ và bản đồ** — khối `⚙️ CẤU HÌNH` ở đầu file: `MAPS_PLACE_URL`,
`MAPS_REVIEW_URL` và mảng `BRANCHES` (hotline, tên người phụ trách, địa chỉ, link bản đồ,
link mạng xã hội). Kênh nào chưa có link thật thì để chuỗi rỗng `''` — ô đó tự hiện mờ
kèm chữ "Đang cập nhật" thay vì thành link chết.

**Nội dung đa ngôn ngữ** — đối tượng `I18N`, gồm 5 thứ tiếng: `vi`, `en`, `ko`, `zh`,
`ja`. Mỗi khoá phải có đủ cả 5. Trong HTML, chỗ nào cần dịch thì gắn `data-i18n="tên.khoá"`
(hoặc `data-i18n-aria` cho nhãn trợ năng). Ngôn ngữ khách chọn được lưu vào `localStorage`.

**Tỉ giá quy đổi USD** — hằng số `USD_RATE`. Giá USD chỉ hiện với khách nước ngoài, tự
ẩn khi xem bằng tiếng Việt.

**Kênh nhắn tin trong modal đặt xe** — mảng `CHANNELS`. Ô nào có ảnh QR khai báo trong
`qr` của chi nhánh thì bấm vào sẽ mở QR ngay trong modal; ô nào chỉ có link thì mở link;
ô nào chưa có gì thì hiển thị mờ kèm chữ "Đang cập nhật".

## Còn thiếu

- Địa chỉ chữ của cửa hàng (bản đồ đã trỏ đúng toạ độ điểm GREEN GO, nhưng dòng địa chỉ
  vẫn đang để "Đà Nẵng — địa chỉ đang cập nhật")
- Link Messenger, KakaoTalk, WeChat, Telegram và ảnh QR tương ứng. Zalo và WhatsApp đang
  suy ra từ hotline 0988.169.232, cần xác nhận lại
- Ảnh chụp thật xe VinFast Evo Lite dán tem GreenGO (mục "Xe Bạn Sẽ Nhận" đang dùng ảnh
  render trong bộ nhận diện)

## Deploy

Menu điều hướng: "Xe & Đổi Pin" cuộn tới mục trong trang chủ, ba mục còn lại
dẫn sang trang riêng.

Trang tĩnh thuần nên đẩy lên đâu cũng chạy, không cần cấu hình build. Với Vercel, chọn
framework preset là **Other** và để trống ô build command lẫn output directory.
