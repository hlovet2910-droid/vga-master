/* AUTH.JS - QUẢN LÝ ĐĂNG KÝ, ĐĂNG NHẬP & PHÂN QUYỀN */

// Hiển thị trạng thái tài khoản trên Topbar
function capNhatGiaoDienNguoiDung() {
    let nguoiDungHienTai = DB.layNguoiDungHienTai();
    let khuVucTaiKhoan = document.getElementById("authArea");
    if (!khuVucTaiKhoan) return;

    if (nguoiDungHienTai) {
        // Chỉ tài khoản Admin mới hiển thị nút vào trang Quản trị
        let nutQuanTri = "";
        if (nguoiDungHienTai.role === "admin") {
            nutQuanTri = `<a href="admin.html" class="btn-nav-admin">🛠️ Quản Trị Hệ Thống</a>`;
        }

        khuVucTaiKhoan.innerHTML = `
            <div class="user-nav-group">
                ${nutQuanTri}
                <a href="donhang.html" class="btn-nav-orders">📦 Đơn hàng của tôi</a>
                <span class="user-display-name">Chào, ${nguoiDungHienTai.fullname || nguoiDungHienTai.username}</span>
                <button onclick="dangXuat()" class="btn-logout">Đăng Xuất</button>
            </div>
        `;
    } else {
        khuVucTaiKhoan.innerHTML = `
            <div class="user-nav-group">
                <button onclick="moHopThoaiTaiKhoan('login')" class="btn-auth-login">Đăng Nhập</button>
                <button onclick="moHopThoaiTaiKhoan('register')" class="btn-auth-register">Đăng Ký</button>
            </div>
        `;
    }
}

// Mở hộp thoại đăng nhập / đăng ký
function moHopThoaiTaiKhoan(loaiHopThoai) {
    let hopThoai = document.getElementById("authModal");
    let noiDung = document.getElementById("authModalContent");
    if (!hopThoai || !noiDung) return;

    if (loaiHopThoai === "login") {
        noiDung.innerHTML = `
            <h3 class="modal-title">🔑 ĐĂNG NHẬP TÀI KHOẢN</h3>
            <form onsubmit="xuLyDangNhap(event)">
                <div class="modal-form-group">
                    <label class="modal-form-label">Tên đăng nhập:</label>
                    <input type="text" id="loginUsername" class="modal-form-input" required placeholder="Nhập tên đăng nhập của bạn">
                </div>
                <div class="modal-form-group">
                    <label class="modal-form-label">Mật khẩu:</label>
                    <input type="password" id="loginPassword" class="modal-form-input" required placeholder="Nhập mật khẩu">
                </div>
                <button type="submit" class="btn-modal-submit-blue">Đăng Nhập Ngay</button>
            </form>
            <div class="modal-footer-switch">
                Chưa có tài khoản? <a href="javascript:void(0)" onclick="moHopThoaiTaiKhoan('register')">Đăng ký tại đây</a>
            </div>
        `;
    } else {
        noiDung.innerHTML = `
            <h3 class="modal-title">📝 ĐĂNG KÝ TÀI KHOẢN MỚI</h3>
            <form onsubmit="xuLyDangKy(event)">
                <div class="modal-form-group">
                    <label class="modal-form-label">Họ và tên:</label>
                    <input type="text" id="regFullname" class="modal-form-input" required placeholder="Ví dụ: Hoàng Nam Hải">
                </div>
                <div class="modal-form-group">
                    <label class="modal-form-label">Tên đăng nhập:</label>
                    <input type="text" id="regUsername" class="modal-form-input" required placeholder="Tên viết liền không dấu">
                </div>
                <div class="modal-form-group">
                    <label class="modal-form-label">Email:</label>
                    <input type="email" id="regEmail" class="modal-form-input" required placeholder="name@gmail.com">
                </div>
                <div class="modal-form-group">
                    <label class="modal-form-label">Mật khẩu:</label>
                    <input type="password" id="regPassword" class="modal-form-input" required placeholder="Tối thiểu 3 ký tự">
                </div>
                <button type="submit" class="btn-modal-submit-green">Tạo Tài Khoản</button>
            </form>
            <div class="modal-footer-switch">
                Đã có tài khoản? <a href="javascript:void(0)" onclick="moHopThoaiTaiKhoan('login')">Đăng nhập ngay</a>
            </div>
        `;
    }
    hopThoai.style.display = "flex";
}

function dongHopThoaiTaiKhoan() {
    let hopThoai = document.getElementById("authModal");
    if (hopThoai) hopThoai.style.display = "none";
}

// Xử lý đăng nhập và phân quyền
function xuLyDangNhap(suKien) {
    suKien.preventDefault();
    let tenDangNhap = document.getElementById("loginUsername").value.trim();
    let matKhau = document.getElementById("loginPassword").value.trim();

    let danhSachNguoiDung = DB.layDanhSachNguoiDung();
    let nguoiDungTimThay = danhSachNguoiDung.find(function(nguoiDung) {
        return nguoiDung.username.toLowerCase() === tenDangNhap.toLowerCase() && nguoiDung.password === matKhau;
    });

    if (!nguoiDungTimThay) {
        alert("❌ Tên đăng nhập hoặc mật khẩu không chính xác!");
        return;
    }

    if (nguoiDungTimThay.status === "locked") {
        alert("🔒 Tài khoản của bạn đã bị KHÓA do vi phạm quy định! Vui lòng liên hệ ban quản trị.");
        return;
    }

    DB.luuNguoiDungHienTai(nguoiDungTimThay);
    dongHopThoaiTaiKhoan();
    capNhatGiaoDienNguoiDung();
    alert("🎉 Đăng nhập thành công! Chào mừng " + (nguoiDungTimThay.fullname || nguoiDungTimThay.username));

    if (nguoiDungTimThay.role === "admin") {
        if (confirm("Bạn có quyền Quản trị viên. Bạn có muốn chuyển sang trang Quản Trị ngay bây giờ không?")) {
            window.location.href = "admin.html";
        }
    } else {
        // Nếu có sản phẩm trong giỏ hàng, gợi ý thanh toán ngay
        let duLieuGioHang = sessionStorage.getItem("giohang");
        if (duLieuGioHang) {
            try {
                let danhSachMonHang = JSON.parse(duLieuGioHang);
                if (danhSachMonHang && danhSachMonHang.length > 0) {
                    if (confirm("Bạn đang có " + danhSachMonHang.length + " sản phẩm trong giỏ hàng. Bạn có muốn chuyển sang trang Thanh Toán ngay bây giờ không?")) {
                        window.location.href = "thanhtoan.html";
                    }
                }
            } catch (loi) {}
        }
    }
}

// Xử lý đăng ký tài khoản mới
function xuLyDangKy(suKien) {
    suKien.preventDefault();
    let hoVaTen = document.getElementById("regFullname").value.trim();
    let tenDangNhap = document.getElementById("regUsername").value.trim();
    let diaChiEmail = document.getElementById("regEmail").value.trim();
    let matKhau = document.getElementById("regPassword").value.trim();

    let danhSachNguoiDung = DB.layDanhSachNguoiDung();
    let taiKhoanDaTonTai = danhSachNguoiDung.find(function(nguoiDung) {
        return nguoiDung.username.toLowerCase() === tenDangNhap.toLowerCase();
    });

    if (taiKhoanDaTonTai) {
        alert("❌ Tên đăng nhập này đã được sử dụng! Vui lòng chọn tên khác.");
        return;
    }

    // Tạo ID tự tăng
    let maSoCaoNhat = danhSachNguoiDung.reduce(function(lonNhat, muc) {
        let soId = Number(muc.id);
        return (!isNaN(soId) && soId < 10000) ? Math.max(lonNhat, soId) : lonNhat;
    }, 0);
    let maSoMoi = maSoCaoNhat > 0 ? maSoCaoNhat + 1 : 6;

    let nguoiDungMoi = {
        id: maSoMoi,
        username: tenDangNhap,
        password: matKhau,
        fullname: hoVaTen,
        email: diaChiEmail,
        role: "user",
        status: "active"
    };

    danhSachNguoiDung.push(nguoiDungMoi);
    DB.luuDanhSachNguoiDung(danhSachNguoiDung);
    DB.luuNguoiDungHienTai(nguoiDungMoi);

    dongHopThoaiTaiKhoan();
    capNhatGiaoDienNguoiDung();
    alert("🎉 Đăng ký thành công!\nChào mừng " + hoVaTen + " đến với VGA Master!");

    // Nếu có sản phẩm trong giỏ hàng, gợi ý thanh toán ngay
    let duLieuGioHang = sessionStorage.getItem("giohang");
    if (duLieuGioHang) {
        try {
            let danhSachMonHang = JSON.parse(duLieuGioHang);
            if (danhSachMonHang && danhSachMonHang.length > 0) {
                if (confirm("Bạn đang có " + danhSachMonHang.length + " sản phẩm trong giỏ hàng. Bạn có muốn chuyển sang trang Thanh Toán ngay bây giờ không?")) {
                    window.location.href = "thanhtoan.html";
                }
            }
        } catch (loi) {}
    }
}

// Đăng xuất tài khoản
function dangXuat() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) {
        DB.luuNguoiDungHienTai(null);
        capNhatGiaoDienNguoiDung();
        window.location.reload();
    }
}

// Tự động khởi chạy cập nhật giao diện khi tải trang
window.addEventListener("DOMContentLoaded", function() {
    capNhatGiaoDienNguoiDung();
});
