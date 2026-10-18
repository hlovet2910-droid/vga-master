/* SANPHAM.JS - QUẢN LÝ VÀ HIỂN THỊ SẢN PHẨM */

var danhSachSanPham = [];

// Khởi tạo và render sản phẩm
let sanpham = {
    masp: "",
    tensp: "",
    gia: "",
    ctsp: "",
    hinh: "",
    khuyenmai: 0,
    giagoc: 0,

    khoiTao: function(masp, tensp, gia, ctsp, hinh, khuyenmai, giagoc, tonkho) {
        this.masp = masp;
        this.tensp = tensp;
        this.gia = gia;
        this.ctsp = ctsp;
        this.hinh = hinh;
        this.khuyenmai = khuyenmai || 0;
        this.giagoc = giagoc || gia;
        this.tonkho = typeof tonkho === "number" ? tonkho : (tonkho ? Number(tonkho) : 10);
    },

    xuatSp: function(dsSanPham) {
        let chuoiHtml = "";
        if (!dsSanPham || dsSanPham.length === 0) {
            return '<div class="sanpham-empty-text">Không tìm thấy card đồ họa nào phù hợp!</div>';
        }
        for (let i = 0; i < dsSanPham.length; i++) {
            chuoiHtml += '<div class="sanpham">';
            chuoiHtml += this.motSp(dsSanPham[i]);
            chuoiHtml += '</div>';
        }
        return chuoiHtml;
    },

    motSp: function(sp) {
        let chuoiHtml = "";
        let tonKhoSp = typeof sp.tonkho === "number" ? sp.tonkho : 10;
        let duongDanHinh = (sp.hinh && (sp.hinh.startsWith("data:") || sp.hinh.startsWith("http"))) ? sp.hinh : "./image/" + sp.hinh;

        // 1. Ảnh sản phẩm 
        chuoiHtml += '<div><img src="' + duongDanHinh + '" alt="' + sp.tensp + '" onclick="xemChiTietSanPham(\'' + sp.masp + '\')" class="pointer-cursor" title="Nhấn để xem đánh giá & chi tiết"></div>';
        // 2. Tên card đồ họa
        chuoiHtml += '<p onclick="xemChiTietSanPham(\'' + sp.masp + '\')" class="pointer-cursor" title="Nhấn để xem đánh giá">' + sp.tensp + '</p>';
        // 3. Giá tiền 
        if (sp.khuyenmai > 0) {
            chuoiHtml += '<p><span class="price-original">$' + sp.giagoc + '</span>$<span class="giaban price-sale">' + sp.gia + '</span> <small class="badge-discount">-' + sp.khuyenmai + '%</small></p>';
        } else {
            chuoiHtml += '<p>$<span class="giaban">' + sp.gia + '</span></p>';
        }

        // 4. Trạng thái tồn kho & Ô nhập số lượng
        if (tonKhoSp <= 0) {
            chuoiHtml += '<p style="font-size:12px; color:#ef4444; font-weight:bold; margin:4px 0;">🔴 HẾT HÀNG</p>';
            chuoiHtml += '<input name="soluong" value="0" min="0" max="0" disabled type="number">';
        } else {
            chuoiHtml += '<p style="font-size:12px; color:#16a34a; font-weight:600; margin:4px 0;">Kho còn: <strong>' + tonKhoSp + '</strong> chiếc</p>';
            chuoiHtml += '<input name="soluong" value="1" min="1" max="' + tonKhoSp + '" type="number">';
        }

        // 5. Mã sản phẩm
        chuoiHtml += '<label>' + sp.masp + '</label><br>';

        // 6. Cặp nút: [Chi tiết] và [Chọn Hàng]
        chuoiHtml += '<div class="product-actions-group">';
        chuoiHtml += '  <button type="button" onclick="xemChiTietSanPham(\'' + sp.masp + '\')" class="btn-card-review">💬 Chi tiết</button>';
        if (tonKhoSp <= 0) {
            chuoiHtml += '  <button type="button" disabled class="btn-card-addcart" style="background:#94a3b8; cursor:not-allowed;">Hết Hàng</button>';
        } else {
            chuoiHtml += '  <button type="button" onclick="chonHang(this, \'' + sp.masp + '\')" class="btn-card-addcart">Chọn Hàng</button>';
        }
        chuoiHtml += '</div>';
        return chuoiHtml;
    }
};

// Nạp danh sách sản phẩm từ cơ sở dữ liệu
function taiDanhSachSanPham() {
    let dsSanPhamTuDB = DB.layDanhSachSanPham();
    danhSachSanPham = [];
    for (let i = 0; i < dsSanPhamTuDB.length; i++) {
        let spHienTai = dsSanPhamTuDB[i];
        let doiTuong = new sanpham.khoiTao(spHienTai.masp, spHienTai.tensp, spHienTai.gia, spHienTai.ctsp, spHienTai.hinh, spHienTai.khuyenmai, spHienTai.giagoc, spHienTai.tonkho);
        danhSachSanPham.push(doiTuong);
    }
    hienThiSanPham(danhSachSanPham);
}

// Xuất sản phẩm lên giao diện HTML
function hienThiSanPham(danhSach) {
    let doiTuongSanPham = sanpham;
    let khungHienThi = document.getElementById("showsanpham");
    if (khungHienThi) {
        khungHienThi.innerHTML = doiTuongSanPham.xuatSp(danhSach);
    }
}

// Tìm kiếm sản phẩm theo thời gian thực
function timKiemSanPham() {
    let oNhap = document.getElementById("searchKeyword");
    if (!oNhap) return;
    let tuKhoa = oNhap.value.trim().toLowerCase();

    let ketQua = danhSachSanPham.filter(function(sanPham) {
        return sanPham.tensp.toLowerCase().includes(tuKhoa) || sanPham.masp.toLowerCase().includes(tuKhoa) || sanPham.ctsp.toLowerCase().includes(tuKhoa);
    });

    hienThiSanPham(ketQua);
}

// Xem chi tiết sản phẩm và đánh giá
function xemChiTietSanPham(masp) {
    let spChon = danhSachSanPham.find(function(sanPham) { return sanPham.masp === masp; });
    if (!spChon) return;

    let danhSachDanhGia = DB.layDanhSachDanhGia().filter(function(danhGia) { return danhGia.masp === masp; });

    let hopThoai = document.getElementById("reviewModal");
    let noiDung = document.getElementById("reviewModalContent");
    if (!hopThoai || !noiDung) return;

    let htmlDanhGia = "";
    if (danhSachDanhGia.length === 0) {
        htmlDanhGia = '<p class="review-empty-text">Chưa có bình luận nào cho sản phẩm này.</p>';
    } else {
        danhSachDanhGia.forEach(function(danhGia) {
            let soSao = "⭐".repeat(danhGia.rating);
            htmlDanhGia += '<div class="review-item">';
            htmlDanhGia += '  <div class="review-item-header">';
            htmlDanhGia += '    <strong>👤 ' + danhGia.username + ' <span class="badge-verified-buyer">✔ Đã mua hàng</span></strong>';
            htmlDanhGia += '    <span>' + soSao + ' <small class="review-stars-date">(' + danhGia.date + ')</small></span>';
            htmlDanhGia += '  </div>';
            htmlDanhGia += '  <p class="review-item-comment">' + danhGia.comment + '</p>';
            htmlDanhGia += '</div>';
        });
    }

    let duongDanHinh = (spChon.hinh && (spChon.hinh.startsWith("data:") || spChon.hinh.startsWith("http"))) ? spChon.hinh : "./image/" + spChon.hinh;
    let tonKhoSp = typeof spChon.tonkho === "number" ? spChon.tonkho : 10;
    let theTonKho = tonKhoSp > 0 
        ? '<span style="color:#16a34a; font-weight:bold;">Còn ' + tonKhoSp + ' chiếc trong kho</span>' 
        : '<span style="color:#ef4444; font-weight:bold;">Tạm hết hàng</span>';

    noiDung.innerHTML = `
        <div class="product-detail-header">
            <img src="${duongDanHinh}" class="product-detail-thumb">
            <div>
                <h3 class="product-detail-title">${spChon.tensp}</h3>
                <p class="product-detail-price">$${spChon.gia}</p>
                <p class="product-detail-specs" style="margin-bottom:6px;">Tình trạng: ${theTonKho}</p>
                <p class="product-detail-specs">Thông số kỹ thuật: ${spChon.ctsp}</p>
            </div>
        </div>

        <h4 class="review-section-title">⭐ BÌNH LUẬN & ĐÁNH GIÁ TỪ KHÁCH HÀNG:</h4>
        <div class="review-list-container">
            ${htmlDanhGia}
        </div>
    `;

    hopThoai.style.display = "flex";
}

// Đóng hộp thoại chi tiết
function dongHopThoaiChiTiet() {
    let hopThoai = document.getElementById("reviewModal");
    if (hopThoai) hopThoai.style.display = "none";
}

// Tự động nạp danh sách sản phẩm khi tải trang
taiDanhSachSanPham();
