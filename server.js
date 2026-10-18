/* ==========================================================
   SERVER.JS - MÁY CHỦ BACKEND & CƠ SỞ DỮ LIỆU TẬP TRUNG (NODE.JS & EXPRESS)
   DỰ ÁN: WEBSITE BÁN CARD ĐỒ HỌA VGA MASTER
   ----------------------------------------------------------
   Kiến trúc:
   1. Khởi tạo máy chủ Express & phục vụ toàn bộ web tĩnh (HTML/CSS/JS/Ảnh)
   2. Quản lý cơ sở dữ liệu tập trung lưu tại file "database.json"
   3. Cung cấp hệ thống RESTful API cho sản phẩm, đơn hàng, người dùng, đánh giá
   ========================================================== */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const CONG_KET_NOI = process.env.PORT || 3000;
const TEP_CO_SO_DU_LIEU = path.join(__dirname, 'database.json');

// Cấu hình Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// --- DỮ LIỆU MẶC ĐỊNH BAN ĐẦU ---
const DU_LIEU_MAC_DINH = {
    sanpham: [
        { masp: "VGA01", tensp: "ASUS ROG Strix RTX 4090 24GB", gia: 2100, giagoc: 2100, khuyenmai: 0, ctsp: "24GB GDDR6X | 384-bit | Boost: 2640 MHz", hinh: "rtx4090.png", daban: 18 },
        { masp: "VGA02", tensp: "MSI RTX 4080 SUPER 16GB", gia: 1250, giagoc: 1250, khuyenmai: 0, ctsp: "16GB GDDR6X | 256-bit | Tri Frozr 3S", hinh: "rtx4080s.png", daban: 12 },
        { masp: "VGA03", tensp: "MSI RTX 4070 Ti SUPER 16GB", gia: 882, giagoc: 980, khuyenmai: 10, ctsp: "16GB GDDR6X | 256-bit | Torx Fan 5.0", hinh: "rtx4070ti.png", daban: 25 },
        { masp: "VGA04", tensp: "ASUS TUF RTX 4070 SUPER 12GB", gia: 760, giagoc: 760, khuyenmai: 0, ctsp: "12GB GDDR6X | 192-bit | Military Grade", hinh: "rtx4070s.png", daban: 15 },
        { masp: "VGA05", tensp: "Colorful RTX 4060 Ti Ultra W 8GB", gia: 460, giagoc: 460, khuyenmai: 0, ctsp: "8GB GDDR6 | 128-bit | White Hologram", hinh: "rtx4060ti.png", daban: 20 },
        { masp: "VGA06", tensp: "ASUS Dual RTX 4060 8GB", gia: 315, giagoc: 350, khuyenmai: 10, ctsp: "8GB GDDR6 | 128-bit | Axial-tech Fan", hinh: "rtx4060.png", daban: 38 },
        { masp: "VGA07", tensp: "MSI RTX 3060 Ventus 12GB", gia: 290, giagoc: 290, khuyenmai: 0, ctsp: "12GB GDDR6 | 192-bit | Dual Fan OC", hinh: "rtx3060.png", daban: 31 },
        { masp: "VGA08", tensp: "ZOTAC RTX 3050 Twin Edge 6GB", gia: 190, giagoc: 190, khuyenmai: 0, ctsp: "6GB GDDR6 | 96-bit | Compact Design", hinh: "rtx3050.png", daban: 8 },
        { masp: "VGA09", tensp: "Sapphire NITRO+ RX 7900 XTX 24GB", gia: 1160, giagoc: 1160, khuyenmai: 0, ctsp: "24GB GDDR6 | 384-bit | Vapor-X Cooling", hinh: "rx7900xtx.png", daban: 14 },
        { masp: "VGA10", tensp: "PowerColor Hellhound RX 7900 XT 20GB", gia: 880, giagoc: 880, khuyenmai: 0, ctsp: "20GB GDDR6 | 320-bit | Ice Blue LED", hinh: "rx7900xt.png", daban: 9 },
        { masp: "VGA11", tensp: "GIGABYTE RX 7800 XT Gaming 16GB", gia: 540, giagoc: 600, khuyenmai: 10, ctsp: "16GB GDDR6 | 256-bit | Windforce 3X", hinh: "rx7800xt.png", daban: 19 },
        { masp: "VGA12", tensp: "ASUS Dual RX 7700 XT 12GB", gia: 500, giagoc: 500, khuyenmai: 0, ctsp: "12GB GDDR6 | 192-bit | Dual Ball Bearing", hinh: "rx7700xt.png", daban: 11 },
        { masp: "VGA13", tensp: "ASRock RX 7600 XT Steel Legend 16GB", gia: 400, giagoc: 400, khuyenmai: 0, ctsp: "16GB GDDR6 | 128-bit | ARGB White Edition", hinh: "rx7600xt.png", daban: 16 },
        { masp: "VGA14", tensp: "Sapphire PULSE RX 6600 8GB", gia: 207, giagoc: 230, khuyenmai: 10, ctsp: "8GB GDDR6 | 128-bit | Best Budget 1080p", hinh: "rx6600.png", daban: 42 },
        { masp: "VGA15", tensp: "Intel Arc A770 16GB", gia: 360, giagoc: 360, khuyenmai: 0, ctsp: "16GB GDDR6 | 256-bit | XeSS & AV1 Codec", hinh: "arc770.png", daban: 4 }
    ],
    nguoidung: [
        { id: 1, username: "admin", password: "123", fullname: "Quản Trị Viên", email: "admin@vgamaster.vn", role: "admin", status: "active" },
        { id: 2, username: "hoangnam", password: "123", fullname: "Hoàng Nam", email: "nam@gmail.com", role: "user", status: "active" },
        { id: 3, username: "thuyduong", password: "123", fullname: "Nguyễn Thùy Dương", email: "duong@gmail.com", role: "user", status: "active" },
        { id: 4, username: "minhtri", password: "123", fullname: "Vũ Minh Trí", email: "tri@gmail.com", role: "user", status: "active" },
        { id: 5, username: "khach_vipham", password: "123", fullname: "Khách Vi Phạm", email: "vipham@gmail.com", role: "user", status: "locked" }
    ],
    donhang: [
        {
            id: "DH1001",
            username: "hoangnam",
            fullname: "Hoàng Nam",
            phone: "0901234567",
            address: "123 Đường Cầu Giấy, Hà Nội",
            payment: "Thanh toán khi nhận hàng (COD)",
            note: "Giao chiều",
            items: [
                { masp: "VGA01", tensp: "ASUS ROG Strix RTX 4090 24GB", gia: 2100, soluong: 1, hinh: "rtx4090.png" }
            ],
            voucherCode: "",
            discount: 0,
            total: 2100,
            status: "thành công",
            date: "2026-10-10 14:30"
        },
        {
            id: "DH1002",
            username: "thuyduong",
            fullname: "Nguyễn Thùy Dương",
            phone: "0918765432",
            address: "45 Lê Lợi, Quận 1, TP.HCM",
            payment: "Chuyển khoản ngân hàng (VietQR)",
            note: "Bọc chống sốc kỹ giúp mình",
            items: [
                { masp: "VGA03", tensp: "MSI RTX 4070 Ti SUPER 16GB", gia: 882, soluong: 1, hinh: "rtx4070ti.png" },
                { masp: "VGA06", tensp: "ASUS Dual RTX 4060 8GB", gia: 315, soluong: 1, hinh: "rtx4060.png" }
            ],
            voucherCode: "",
            discount: 0,
            total: 1197,
            status: "đang giao",
            date: "2026-10-15 09:15"
        },
        {
            id: "DH1003",
            username: "minhtri",
            fullname: "Vũ Minh Trí",
            phone: "0987112233",
            address: "78 Nguyễn Huệ, Đà Nẵng",
            payment: "Thanh toán khi nhận hàng (COD)",
            note: "",
            items: [
                { masp: "VGA06", tensp: "ASUS Dual RTX 4060 8GB", gia: 315, soluong: 1, hinh: "rtx4060.png" }
            ],
            voucherCode: "",
            discount: 0,
            total: 315,
            status: "chờ xác nhận",
            date: "2026-10-16 08:10"
        }
    ],
    danhgia: [
        { id: 1, masp: "VGA01", username: "hoangnam", rating: 5, comment: "Card khủng nhất hiện nay, chiến game 4K Ray Tracing mượt mà trên 120 FPS!", date: "2026-10-11" },
        { id: 2, masp: "VGA03", username: "thuyduong", rating: 5, comment: "Bản màu đen rất sang trọng, chạy êm và mát, nhiệt độ chỉ quanh 62 độ.", date: "2026-10-14" },
        { id: 3, masp: "VGA06", username: "minhtri", rating: 4, comment: "Hiệu năng trên giá tiền quá hời cho màn Full HD / 2K, tiết kiệm điện năng.", date: "2026-10-15" }
    ]
};

// Hàm đọc dữ liệu từ database.json
function docDuLieu() {
    try {
        if (!fs.existsSync(TEP_CO_SO_DU_LIEU)) {
            fs.writeFileSync(TEP_CO_SO_DU_LIEU, JSON.stringify(DU_LIEU_MAC_DINH, null, 2), 'utf-8');
            return DU_LIEU_MAC_DINH;
        }
        const noiDung = fs.readFileSync(TEP_CO_SO_DU_LIEU, 'utf-8');
        return JSON.parse(noiDung);
    } catch (loi) {
        console.error("Lỗi khi đọc database.json, dùng dữ liệu mặc định:", loi);
        return DU_LIEU_MAC_DINH;
    }
}

// Hàm ghi dữ liệu vào database.json
function ghiDuLieu(duLieu) {
    try {
        fs.writeFileSync(TEP_CO_SO_DU_LIEU, JSON.stringify(duLieu, null, 2), 'utf-8');
        return true;
    } catch (loi) {
        console.error("Lỗi khi ghi database.json:", loi);
        return false;
    }
}

// Khởi tạo file database.json ngay khi chạy server
docDuLieu();

/* ==========================================================
   HỆ THỐNG RESTFUL API QUẢN TRỊ DỮ LIỆU
   ========================================================== */

// 1. API Lấy / Cập nhật toàn bộ cơ sở dữ liệu
app.get('/api/du-lieu', (yeuCau, phanHoi) => {
    phanHoi.json(docDuLieu());
});

app.post('/api/du-lieu', (yeuCau, phanHoi) => {
    const duLieu = yeuCau.body;
    if (duLieu && typeof duLieu === 'object') {
        ghiDuLieu(duLieu);
        phanHoi.json({ success: true, message: "Đã lưu toàn bộ cơ sở dữ liệu thành công!" });
    } else {
        phanHoi.status(400).json({ success: false, message: "Dữ liệu không hợp lệ!" });
    }
});

// 2. API Quản lý sản phẩm Card đồ họa
app.get('/api/sanpham', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    phanHoi.json(coSoDuLieu.sanpham || []);
});

app.post('/api/sanpham', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    coSoDuLieu.sanpham = yeuCau.body;
    ghiDuLieu(coSoDuLieu);
    phanHoi.json({ success: true, message: "Đã cập nhật danh sách sản phẩm thành công!" });
});

// 3. API Quản lý đơn đặt hàng
app.get('/api/donhang', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    phanHoi.json(coSoDuLieu.donhang || []);
});

app.post('/api/donhang', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    coSoDuLieu.donhang = yeuCau.body;
    ghiDuLieu(coSoDuLieu);
    phanHoi.json({ success: true, message: "Đã cập nhật danh sách đơn hàng thành công!" });
});

// 4. API Quản lý tài khoản người dùng
app.get('/api/nguoidung', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    phanHoi.json(coSoDuLieu.nguoidung || []);
});

app.post('/api/nguoidung', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    coSoDuLieu.nguoidung = yeuCau.body;
    ghiDuLieu(coSoDuLieu);
    phanHoi.json({ success: true, message: "Đã cập nhật danh sách người dùng thành công!" });
});

// 5. API Quản lý đánh giá sản phẩm
app.get('/api/danhgia', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    phanHoi.json(coSoDuLieu.danhgia || []);
});

app.post('/api/danhgia', (yeuCau, phanHoi) => {
    const coSoDuLieu = docDuLieu();
    coSoDuLieu.danhgia = yeuCau.body;
    ghiDuLieu(coSoDuLieu);
    phanHoi.json({ success: true, message: "Đã cập nhật đánh giá thành công!" });
});

// Điều hướng mặc định về trang chủ index.html
app.get('/', (yeuCau, phanHoi) => {
    phanHoi.sendFile(path.join(__dirname, 'index.html'));
});

// Khởi chạy máy chủ lắng nghe kết nối
app.listen(CONG_KET_NOI, () => {
    console.log("==========================================================");
    console.log("⚡ MÁY CHỦ VGA MASTER ĐANG CHẠY TẠI CỔNG " + CONG_KET_NOI);
    console.log("🌐 Truy cập website: http://localhost:" + CONG_KET_NOI);
    console.log("📁 Dữ liệu được lưu vĩnh viễn tại: database.json");
    console.log("==========================================================");
});
