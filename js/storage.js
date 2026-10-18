/* STORAGE.JS - QUẢN LÝ DỮ LIỆU TẬP TRUNG CHO TOÀN BỘ WEBSITE
   Lưu trữ vĩnh viễn trên localStorage:
   1. Tài khoản (1 Quản trị viên duy nhất & Khách hàng)
   2. Sản phẩm Card đồ họa (15 sản phẩm)
   3. Giỏ hàng & Đơn hàng (Tiến trình giao hàng 5 bước & Hủy đơn)
   4. Bình luận & Đánh giá sản phẩm */

// --- 1. DỮ LIỆU SẢN PHẨM ---
const DANH_SACH_SAN_PHAM = [
    { masp: "VGA01", tensp: "ASUS ROG Strix RTX 4090 24GB", gia: 2100, giagoc: 2100, khuyenmai: 0, ctsp: "24GB GDDR6X | 384-bit | Boost: 2640 MHz", hinh: "rtx4090.png", daban: 18, tonkho: 5 },
    { masp: "VGA02", tensp: "MSI RTX 4080 SUPER 16GB", gia: 1250, giagoc: 1250, khuyenmai: 0, ctsp: "16GB GDDR6X | 256-bit | Tri Frozr 3S", hinh: "rtx4080s.png", daban: 12, tonkho: 8 },
    { masp: "VGA03", tensp: "MSI RTX 4070 Ti SUPER 16GB", gia: 882, giagoc: 980, khuyenmai: 10, ctsp: "16GB GDDR6X | 256-bit | Torx Fan 5.0", hinh: "rtx4070ti.png", daban: 25, tonkho: 12 },
    { masp: "VGA04", tensp: "ASUS TUF RTX 4070 SUPER 12GB", gia: 760, giagoc: 760, khuyenmai: 0, ctsp: "12GB GDDR6X | 192-bit | Military Grade", hinh: "rtx4070s.png", daban: 15, tonkho: 10 },
    { masp: "VGA05", tensp: "Colorful RTX 4060 Ti Ultra W 8GB", gia: 460, giagoc: 460, khuyenmai: 0, ctsp: "8GB GDDR6 | 128-bit | White Hologram", hinh: "rtx4060ti.png", daban: 20, tonkho: 15 },
    { masp: "VGA06", tensp: "ASUS Dual RTX 4060 8GB", gia: 315, giagoc: 350, khuyenmai: 10, ctsp: "8GB GDDR6 | 128-bit | Axial-tech Fan", hinh: "rtx4060.png", daban: 38, tonkho: 20 },
    { masp: "VGA07", tensp: "MSI RTX 3060 Ventus 12GB", gia: 290, giagoc: 290, khuyenmai: 0, ctsp: "12GB GDDR6 | 192-bit | Dual Fan OC", hinh: "rtx3060.png", daban: 31, tonkho: 14 },
    { masp: "VGA08", tensp: "ZOTAC RTX 3050 Twin Edge 6GB", gia: 190, giagoc: 190, khuyenmai: 0, ctsp: "6GB GDDR6 | 96-bit | Compact Design", hinh: "rtx3050.png", daban: 8, tonkho: 6 },
    { masp: "VGA09", tensp: "Sapphire NITRO+ RX 7900 XTX 24GB", gia: 1160, giagoc: 1160, khuyenmai: 0, ctsp: "24GB GDDR6 | 384-bit | Vapor-X Cooling", hinh: "rx7900xtx.png", daban: 14, tonkho: 7 },
    { masp: "VGA10", tensp: "PowerColor Hellhound RX 7900 XT 20GB", gia: 880, giagoc: 880, khuyenmai: 0, ctsp: "20GB GDDR6 | 320-bit | Ice Blue LED", hinh: "rx7900xt.png", daban: 9, tonkho: 9 },
    { masp: "VGA11", tensp: "GIGABYTE RX 7800 XT Gaming 16GB", gia: 540, giagoc: 600, khuyenmai: 10, ctsp: "16GB GDDR6 | 256-bit | Windforce 3X", hinh: "rx7800xt.png", daban: 19, tonkho: 11 },
    { masp: "VGA12", tensp: "ASUS Dual RX 7700 XT 12GB", gia: 500, giagoc: 500, khuyenmai: 0, ctsp: "12GB GDDR6 | 192-bit | Dual Ball Bearing", hinh: "rx7700xt.png", daban: 11, tonkho: 8 },
    { masp: "VGA13", tensp: "ASRock RX 7600 XT Steel Legend 16GB", gia: 400, giagoc: 400, khuyenmai: 0, ctsp: "16GB GDDR6 | 128-bit | ARGB White Edition", hinh: "rx7600xt.png", daban: 16, tonkho: 16 },
    { masp: "VGA14", tensp: "Sapphire PULSE RX 6600 8GB", gia: 207, giagoc: 230, khuyenmai: 10, ctsp: "8GB GDDR6 | 128-bit | Best Budget 1080p", hinh: "rx6600.png", daban: 42, tonkho: 25 },
    { masp: "VGA15", tensp: "Intel Arc A770 16GB", gia: 360, giagoc: 360, khuyenmai: 0, ctsp: "16GB GDDR6 | 256-bit | XeSS & AV1 Codec", hinh: "arc770.png", daban: 4, tonkho: 4 }
];

// --- 2. DỮ LIỆU TÀI KHOẢN ---
const DANH_SACH_NGUOI_DUNG = [
    { id: 1, username: "admin", password: "123", fullname: "Quản Trị Viên", email: "admin@vgamaster.vn", role: "admin", status: "active" },
    { id: 2, username: "hoangnam", password: "123", fullname: "Hoàng Nam", email: "nam@gmail.com", role: "user", status: "active" },
    { id: 3, username: "thuyduong", password: "123", fullname: "Nguyễn Thùy Dương", email: "duong@gmail.com", role: "user", status: "active" },
    { id: 4, username: "minhtri", password: "123", fullname: "Vũ Minh Trí", email: "tri@gmail.com", role: "user", status: "active" },
    { id: 5, username: "khach_vipham", password: "123", fullname: "Khách Vi Phạm", email: "vipham@gmail.com", role: "user", status: "locked" }
];

// --- 3. DỮ LIỆU ĐƠN HÀNG ---
const DANH_SACH_DON_HANG = [
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
];

// --- 4. DỮ LIỆU BÌNH LUẬN & ĐÁNH GIÁ ---
const DANH_SACH_DANH_GIA = [
    { id: 1, masp: "VGA01", username: "hoangnam", rating: 5, comment: "Card khủng nhất hiện nay, chiến game 4K Ray Tracing mượt mà trên 120 FPS!", date: "2026-10-11" },
    { id: 2, masp: "VGA03", username: "thuyduong", rating: 5, comment: "Bản màu đen rất sang trọng, chạy êm và mát, nhiệt độ chỉ quanh 62 độ.", date: "2026-10-14" },
    { id: 3, masp: "VGA06", username: "minhtri", rating: 4, comment: "Hiệu năng trên giá tiền quá hời cho màn Full HD / 2K, tiết kiệm điện năng.", date: "2026-10-15" }
];

// --- HÀM KHỞI TẠO LOCALSTORAGE ---
// Hàm gửi cập nhật dữ liệu lên máy chủ backend
function guiDuLieuLenServer(duongDan, duLieu) {
    if (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http")) {
        fetch(duongDan, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(duLieu)
        }).catch(function(loi) {
            console.warn("Lỗi gửi dữ liệu lên máy chủ:", loi);
        });
    }
}

// Hàm tải và đồng bộ cơ sở dữ liệu mới nhất từ máy chủ
function dongBoDuLieuTuServer() {
    if (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http")) {
        fetch("/api/du-lieu")
            .then(function(phanHoi) { return phanHoi.json(); })
            .then(function(duLieu) {
                if (duLieu && duLieu.sanpham) {
                    localStorage.setItem("vga_products", JSON.stringify(duLieu.sanpham));
                    localStorage.setItem("vga_users", JSON.stringify(duLieu.nguoidung));
                    localStorage.setItem("vga_orders", JSON.stringify(duLieu.donhang));
                    localStorage.setItem("vga_reviews", JSON.stringify(duLieu.danhgia));
                }
            })
            .catch(function(loi) {
                // Tiếp tục dùng dữ liệu nội bộ nếu mở trực tiếp bằng file://
            });
    }
}

function khoiTaoDuLieu() {
    let sanPhamHienCo = localStorage.getItem("vga_products");
    if (!sanPhamHienCo || sanPhamHienCo.indexOf("tonkho") === -1) {
        localStorage.setItem("vga_products", JSON.stringify(DANH_SACH_SAN_PHAM));
    }
    let nguoiDungHienCo = localStorage.getItem("vga_users");
    if (!nguoiDungHienCo || nguoiDungHienCo.indexOf("staff") !== -1 || nguoiDungHienCo.indexOf("rank") !== -1 || nguoiDungHienCo.indexOf("12345") !== -1) {
        localStorage.setItem("vga_users", JSON.stringify(DANH_SACH_NGUOI_DUNG));
    }
    if (!localStorage.getItem("vga_orders")) {
        localStorage.setItem("vga_orders", JSON.stringify(DANH_SACH_DON_HANG));
    }
    if (!localStorage.getItem("vga_reviews")) {
        localStorage.setItem("vga_reviews", JSON.stringify(DANH_SACH_DANH_GIA));
    }
    // Tự động đồng bộ với server nếu đang chạy qua HTTP máy chủ
    dongBoDuLieuTuServer();
}

// Khởi chạy ngay khi nạp file
khoiTaoDuLieu();

/* TẬP HỢP CÁC PHƯƠNG THỨC THAO TÁC CƠ SỞ DỮ LIỆU */
const DB = {
    // 1. Quản lý sản phẩm card đồ họa
    layDanhSachSanPham: function() {
        return JSON.parse(localStorage.getItem("vga_products") || "[]");
    },
    luuDanhSachSanPham: function(danhSach) {
        localStorage.setItem("vga_products", JSON.stringify(danhSach));
        guiDuLieuLenServer("/api/sanpham", danhSach);
    },

    // 2. Quản lý tài khoản người dùng
    layDanhSachNguoiDung: function() {
        return JSON.parse(localStorage.getItem("vga_users") || "[]");
    },
    luuDanhSachNguoiDung: function(danhSach) {
        localStorage.setItem("vga_users", JSON.stringify(danhSach));
        guiDuLieuLenServer("/api/nguoidung", danhSach);
    },
    layNguoiDungHienTai: function() {
        return JSON.parse(localStorage.getItem("vga_current_user") || "null");
    },
    luuNguoiDungHienTai: function(nguoiDung) {
        if (nguoiDung) {
            localStorage.setItem("vga_current_user", JSON.stringify(nguoiDung));
        } else {
            localStorage.removeItem("vga_current_user");
        }
    },

    // 3. Quản lý đơn đặt hàng
    layDanhSachDonHang: function() {
        return JSON.parse(localStorage.getItem("vga_orders") || "[]");
    },
    luuDanhSachDonHang: function(danhSach) {
        localStorage.setItem("vga_orders", JSON.stringify(danhSach));
        guiDuLieuLenServer("/api/donhang", danhSach);
    },

    // 4. Quản lý đánh giá sản phẩm
    layDanhSachDanhGia: function() {
        return JSON.parse(localStorage.getItem("vga_reviews") || "[]");
    },
    luuDanhSachDanhGia: function(danhSach) {
        localStorage.setItem("vga_reviews", JSON.stringify(danhSach));
        guiDuLieuLenServer("/api/danhgia", danhSach);
    }
};
