# GreenGo — Thuê Xe Điện Đà Nẵng

Trang giới thiệu và đặt xe cho GreenGo, dịch vụ cho thuê xe máy điện tại Đà Nẵng.
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
index.html            Toàn bộ trang: HTML, CSS và JavaScript nằm trong cùng một file
assets/
  brand/              Logo GreenGo và ảnh xe
    logo-badge.png        Huy hiệu tròn — dùng ở header, footer và favicon
    logo-horizontal.png   Logo ngang — dùng trong khối "Thủ Tục Thuê Xe"
    logo-stacked.png      Logo xếp dọc — hiện chưa dùng, để dự phòng
    xe-may-dien.png       Ảnh xe ở khu vực hero
  socials/            Icon Zalo, Messenger, WhatsApp, KakaoTalk, WeChat, Telegram
  vn/gb/kr/cn/jp.png  Cờ cho bộ chọn ngôn ngữ
```

## Những chỗ hay phải sửa

Tất cả đều nằm trong thẻ `<script>` ở cuối `index.html`.

**Thông tin liên hệ và chi nhánh** — mảng `BRANCHES`. Mỗi chi nhánh gồm số hotline,
tên người phụ trách, địa chỉ, link Google Maps và link mạng xã hội. Thêm phần tử thứ
hai vào mảng này thì ô "Chi nhánh đang chọn" tự động chuyển từ thẻ tĩnh thành dropdown
chọn chi nhánh, không cần sửa gì thêm.

**Nội dung đa ngôn ngữ** — đối tượng `I18N`, gồm 5 thứ tiếng: `vi`, `en`, `ko`, `zh`,
`ja`. Mỗi khoá phải có đủ cả 5. Trong HTML, chỗ nào cần dịch thì gắn `data-i18n="tên.khoá"`
(hoặc `data-i18n-aria` cho nhãn trợ năng). Ngôn ngữ khách chọn được lưu vào `localStorage`.

**Tỉ giá quy đổi USD** — hằng số `USD_RATE`. Giá USD chỉ hiện với khách nước ngoài, tự
ẩn khi xem bằng tiếng Việt.

**Kênh nhắn tin trong modal đặt xe** — mảng `CHANNELS`. Ô nào có ảnh QR khai báo trong
`qr` của chi nhánh thì bấm vào sẽ mở QR ngay trong modal; ô nào chỉ có link thì mở link;
ô nào chưa có gì thì hiển thị mờ kèm chữ "Đang cập nhật".

## Còn thiếu

- Địa chỉ cửa hàng (đang để "Đà Nẵng — địa chỉ đang cập nhật", bản đồ trỏ chung vào Đà Nẵng)
- Link Facebook, Zalo, WhatsApp, KakaoTalk, WeChat, Telegram và ảnh QR tương ứng

## Deploy

Trang tĩnh thuần nên đẩy lên đâu cũng chạy, không cần cấu hình build. Với Vercel, chọn
framework preset là **Other** và để trống ô build command lẫn output directory.
