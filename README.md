# Hệ Thống Quản Lý Thuê Phòng Trọ

Hệ thống quản lý thuê phòng trọ được xây dựng với React, Node.js, Express, và MongoDB.

## Yêu cầu hệ thống

- Node.js (phiên bản 14.0.0 trở lên)
- MongoDB (phiên bản 4.0 trở lên)

## Cấu trúc dự án

Dự án bao gồm hai phần chính:
- `client`: Phần giao diện người dùng (React)
- `server`: Phần backend API (Node.js/Express)

## Cài đặt và chạy ứng dụng

### 1. Cài đặt các dependencies

#### Backend (Server)

```bash
cd server
npm install
```

#### Frontend (Client)

```bash
cd client
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục `server` với nội dung:

```
PORT=5000
mongodb+srv://hohaichau963:<db_password>@cluster0.n1t2ypq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 3. Chạy ứng dụng

#### Chạy Backend

```bash
cd server
npm run dev
```

#### Chạy Frontend

```bash
cd client
npm start
```

## Tính năng

1. **Hiển thị danh sách phòng trọ**
   - Danh sách có các trường: Mã phòng trọ, tên người thuê, số điện thoại, ngày bắt đầu thuê, hình thức thanh toán, ghi chú
   - Tìm kiếm phòng trọ theo mã, tên người thuê hoặc số điện thoại

2. **Tạo mới thông tin thuê trọ**
   - Form tạo mới với các trường thông tin cần thiết
   - Kiểm tra hợp lệ thông tin nhập vào

3. **Xóa thông tin thuê trọ**
   - Xóa một hoặc nhiều phòng trọ cùng lúc
   - Hiển thị popup xác nhận trước khi xóa

## API Endpoints

- `GET /api/rooms`: Lấy danh sách phòng trọ (có tìm kiếm)
- `POST /api/rooms`: Tạo mới thông tin thuê trọ
- `DELETE /api/rooms`: Xóa một hoặc nhiều phòng trọ
- `GET /api/payment-types`: Lấy danh sách hình thức thanh toán
- `POST /api/payment-types/init`: Khởi tạo dữ liệu hình thức thanh toán 
