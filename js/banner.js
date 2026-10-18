/* BANNER.JS - HIỂN THỊ BANNER CHÍNH CỬA HÀNG */

var danhSachAnh = ["baner3.jpg"];
var viTriAnh = 0;

// Nạp và hiển thị ảnh banner quảng cáo cố định trên đầu trang
function doiHinhBanner() {
    var theAnh = document.getElementById("img");
    if (theAnh) {
        theAnh.src = "./image/" + danhSachAnh[viTriAnh];
    }
}
