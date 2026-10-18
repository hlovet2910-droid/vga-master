/* GIOHANG.JS - QUẢN LÝ GIỎ HÀNG */

var danhSachGioHang = [];

// Khôi phục dữ liệu giỏ hàng từ sessionStorage
if (sessionStorage.getItem("giohang")) {
    try {
        danhSachGioHang = JSON.parse(sessionStorage.getItem("giohang"));
    } catch (loi) {
        danhSachGioHang = [];
    }
}
var giohangs = danhSachGioHang;

// Đối tượng giỏ hàng và render HTML
var giohang = {
    masp: "",
    tensp: "",
    gia: "",
    soluong: "",
    hinh: "",

    khoiTao: function(masp, hinh, ten, gia, soluong) {
        this.masp = masp;
        this.tensp = ten;
        this.hinh = hinh;
        this.gia = gia;
        this.soluong = soluong;
    },

    xuatGioHang: function(dsGioHang) {
        let chuoiHtml = "";
        if (!dsGioHang || dsGioHang.length === 0) {
            return "<tr><td colspan='6' class='cart-empty-message'>🛒 Giỏ hàng của bạn đang trống!</td></tr>";
        }
        for (let i = 0; i < dsGioHang.length; i++) {
            chuoiHtml += '<tr>';
            chuoiHtml += this.motSpGioHang(dsGioHang[i]);
            chuoiHtml += '</tr>';
        }
        chuoiHtml += "<tr><td colspan='6'><button onclick='chuyenSangThanhToan()'>Thanh Toán Đơn Hàng</button></td></tr>";
        return chuoiHtml;
    },

    motSpGioHang: function(monHang) {
        let chuoiHtml = "";
        chuoiHtml += '<td width="20%"><label>' + monHang.masp + '</label><img height="40px" width="60px" src="' + monHang.hinh + '"></td>';
        chuoiHtml += '<td width="25%"><p>' + monHang.tensp + '</p></td>';
        chuoiHtml += '<td width="15%"><p>$<span>' + monHang.gia + '</span>&emsp;&emsp;</p></td>';
        chuoiHtml += '<td width="10%"><input name="soluong" disabled value="' + monHang.soluong + '" min="1" type="number"></td>';
        chuoiHtml += '<td width="20%"><p>&emsp;&emsp;$<span>' + (monHang.gia * monHang.soluong) + '</span></p></td>';
        chuoiHtml += '<td width="10%"><button onclick="xoaGioHang(this)">Xóa</button></td>';
        return chuoiHtml;
    }
};

// Bật / tắt hiển thị bảng giỏ hàng
if (document.getElementById('showgiohang')) {
    document.getElementById('showgiohang').style.display = 'none';
}

function hienThiGioHang() {
    var hopThoai = document.getElementById('showgiohang');
    if (!hopThoai) return;
    if (hopThoai.style.display == "none" || hopThoai.style.display == "") {
        hopThoai.style.display = 'block';
    } else {
        hopThoai.style.display = 'none';
    }
    hienThiSpGioHang();
}

// Kiểm tra sản phẩm đã có trong giỏ hàng hay chưa
function kiemTraGioHang(maSanPham, dsGioHang) {
    let ds = dsGioHang || danhSachGioHang;
    for (let i = 0; i < ds.length; i++) {
        if (ds[i].masp == maSanPham) {
            return i;
        }
    }
    return -1;
}

// Thêm sản phẩm vào giỏ hàng
function chonHang(phanTuNut, maSP) {
    var theSanPham = (phanTuNut && phanTuNut.closest) ? phanTuNut.closest('.sanpham') : (phanTuNut.parentElement.classList.contains('sanpham') ? phanTuNut.parentElement : phanTuNut.parentElement.parentElement);
    if (!theSanPham) theSanPham = phanTuNut.parentElement;

    let masp = maSP || (theSanPham.querySelector('label') ? theSanPham.querySelector('label').innerText.trim() : "");
    let oNhapSl = theSanPham.querySelector('input[name="soluong"]');
    let soLuong = oNhapSl ? Number(oNhapSl.value) : 1;
    if (isNaN(soLuong) || soLuong <= 0) soLuong = 1;

    // Lấy thông tin từ DB để giá, hình và tồn kho chính xác
    let sanPhamTimThay = DB.layDanhSachSanPham().find(function(sanPham) { return sanPham.masp === masp; });
    let tonKhoHienTai = sanPhamTimThay && typeof sanPhamTimThay.tonkho === "number" ? sanPhamTimThay.tonkho : 10;

    let viTri = kiemTraGioHang(masp, danhSachGioHang);
    let soLuongDaCo = viTri !== -1 ? Number(danhSachGioHang[viTri].soluong) : 0;
    let tongSl = soLuongDaCo + soLuong;

    // Chặn nếu sản phẩm hết hàng
    if (tonKhoHienTai <= 0) {
        alert("⚠️ Sản phẩm này hiện đã TẠM HẾT HÀNG trong kho!");
        return;
    }

    // Chặn nếu tổng số lượng đặt vượt quá số lượng trong kho
    if (tongSl > tonKhoHienTai) {
        alert("⚠️ KHO KHÔNG ĐỦ SỐ LƯỢNG!\n\nKho chỉ còn lại: " + tonKhoHienTai + " chiếc.\nTrong giỏ bạn đã có: " + soLuongDaCo + " chiếc.\nKhông thể thêm quá số lượng trong kho.");
        return;
    }
    
    let ten = sanPhamTimThay ? sanPhamTimThay.tensp : (theSanPham.querySelector('p') ? theSanPham.querySelector('p').innerText : "Card Đồ Họa");
    let gia = sanPhamTimThay ? sanPhamTimThay.gia : 0;
    if (!gia) {
        let theGia = theSanPham.querySelector('span.giaban') || theSanPham.querySelector('p span');
        if (theGia) gia = Number(theGia.innerText.replace('$', '').trim()) || 0;
    }
    let hinh = "";
    if (sanPhamTimThay && sanPhamTimThay.hinh) {
        hinh = (sanPhamTimThay.hinh.startsWith("data:") || sanPhamTimThay.hinh.startsWith("http")) ? sanPhamTimThay.hinh : "./image/" + sanPhamTimThay.hinh;
    } else if (theSanPham.querySelector('img')) {
        hinh = theSanPham.querySelector('img').src;
    }

    if (viTri == -1) {
        let monMoi = new giohang.khoiTao(masp, hinh, ten, gia, soLuong);
        danhSachGioHang.push(monMoi);
    } else {
        danhSachGioHang[viTri].soluong = tongSl;
    }

    // Mỗi lần ấn chọn hàng: Giỏ hàng luôn hiển thị
    var hopGioHang = document.getElementById('showgiohang');
    if (hopGioHang) {
        hopGioHang.style.display = 'block';
        hopGioHang.style.outline = '3px solid #16a34a';
        setTimeout(function() { hopGioHang.style.outline = 'none'; }, 600);
    }

    hienThiSpGioHang();
    sessionStorage.setItem("giohang", JSON.stringify(danhSachGioHang));
}

// Cập nhật lại giao diện bảng giỏ hàng
function hienThiSpGioHang() {
    let doiTuongGioHang = giohang;
    let danhSachPhanTu = document.getElementById('danhsachsanpham');
    if (danhSachPhanTu) {
        danhSachPhanTu.innerHTML = doiTuongGioHang.xuatGioHang(danhSachGioHang);
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function xoaGioHang(phanTuNut) {
    var hangBang = phanTuNut.parentElement.parentElement;
    let masp = hangBang.children[0].children[0].innerText;
    let viTri = kiemTraGioHang(masp, danhSachGioHang);
    if (viTri != -1) {
        danhSachGioHang.splice(viTri, 1);
    }
    sessionStorage.setItem("giohang", JSON.stringify(danhSachGioHang));
    hangBang.remove();
    if (danhSachGioHang.length === 0) {
        hienThiSpGioHang();
    }
}

// Chuyển sang trang thanh toán
function chuyenSangThanhToan() {
    if (!danhSachGioHang || danhSachGioHang.length === 0) {
        alert("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước.");
        return;
    }

    // Bắt buộc người dùng phải đăng nhập trước khi thanh toán
    let nguoiDung = DB.layNguoiDungHienTai();
    if (!nguoiDung) {
        alert("🔒 BẠN CẦN ĐĂNG NHẬP TÀI KHOẢN ĐỂ TIẾP TỤC THANH TOÁN!\n\nVui lòng đăng nhập hoặc tạo tài khoản để đặt hàng và theo dõi đơn hàng.");
        moHopThoaiTaiKhoan("login");
        return;
    }

    window.location = "thanhtoan.html";
}

// Khởi chạy nạp giỏ hàng lần đầu khi tải trang
hienThiSpGioHang();
