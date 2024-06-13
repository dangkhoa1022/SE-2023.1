// manageProfit.js

// Parse orders data from the data attribute
let orders = JSON.parse(document.querySelector('#nav-tabContent').dataset.orders);

// Helper function to format date
function formatDate(isoString, getHour = true) {
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedTime = `${hours}:${minutes}`;
    const formattedDate = `${day}-${month}-${year}`;
    return getHour ? `${formattedTime} ${formattedDate}` : `${formattedDate}`;
}

// Render content for Tổng quát tab
function renderTotalRevenue() {
    const totalRevenue = orders
        .filter(order => order.orderStatus === 'success')
        .reduce((acc, order) => acc + order.totalPrice, 0);

    const totalRevenueElement = document.querySelector('#nav-total');
    totalRevenueElement.innerHTML = `<p>Tổng doanh thu: ${totalRevenue.toLocaleString('en-US')}đ</p>`;
}

// Render content for Tháng này tab
function renderMonthlyRevenue() {
    const currentMonth = new Date().getMonth();
    const monthlyOrders = orders.filter(order => {
        const orderMonth = new Date(order.createdDay).getMonth();
        return orderMonth === currentMonth && order.orderStatus === 'success';
    });

    let html = monthlyOrders.reduce((acc, order) => {
        return acc + `
            <li class="row border-bottom border-secondary pb-1 pt-4">
                <div class="col-12 col-md-3 col-lg-2 d-flex justify-content-center align-items-center mb-3">
                    <img src="/laptop/${order.items[0].product.image[0]}" style="max-width: 150px; max-height: 150px">
                </div>
                <div class="col-12 col-md-8 col-lg-7 pl-5">
                    <span class="font-weight-bold">Người đặt đơn: </span>
                    <span>${order.receiverName}</span>
                    <br>
                    <span class="font-weight-bold">Số điện thoại: </span>
                    <span>${order.phone}</span>
                    <br>
                    <span class="font-weight-bold">Địa chỉ nhận hàng: </span>
                    <span>${order.address}</span>
                    <br>
                    <span class="font-weight-bold">Ngày đặt: </span>   
                    <span>${formatDate(order.createdDay)}</span>
                    <br>
                    <span class="font-weight-bold">Ngày nhận hàng dự kiến: </span>
                    <span>${formatDate(order.arrivedDay, false)}</span>
                    <br>
                    <span class="font-weight-bold">Lưu ý: </span>
                    <span>${order.note || 'Không có'}</span>
                </div>
                <div class="col-12 col-lg-3">
                    <div class="text-right d-flex flex-column align-items-end justify-content-end" style="padding-bottom:20px">
                        <span class='text-success'>
                            <i class="fa-regular fa-circle-check"></i> Nhận hàng thành công
                        </span>
                        <div>
                            <span class="font-weight-bold">Phương thức thanh toán: </span>
                            <span>${order.paymentMethod}</span>
                            <br>
                            <span class="font-weight-bold">Phí vận chuyển: </span>
                            <span class="productCost">${order.deliveryFee.toLocaleString('en-US')}</span>đ
                            <br>
                            <span class="font-weight-bold">Thanh toán: </span>
                            <span class="cost">${order.totalPrice.toLocaleString('en-US')}đ</span>
                        </div>
                    </div>
                </div>
            </li>`;
    }, '');

    const monthlyRevenueElement = document.querySelector('#nav-month');
    monthlyRevenueElement.innerHTML = `<ul>${html}</ul>`;
}

// Render content for Bán chạy tab
function renderBestSellingProducts() {
    const productCount = {};

    orders.filter(order => order.orderStatus === 'success').forEach(order => {
        order.items.forEach(item => {
            if (productCount[item.product.name_model]) {
                productCount[item.product.name_model] += item.quantity;
            } else {
                productCount[item.product.name_model] = item.quantity;
            }
        });
    });

    const sortedProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]);

    let html = sortedProducts.reduce((acc, [product, count]) => {
        return acc + `<li>${product}: ${count}</li>`;
    }, '');

    const bestSellingElement = document.querySelector('#nav-product');
    bestSellingElement.innerHTML = `<ul>${html}</ul>`;
}

// Render content for Khoảng giá tab
function renderPriceRange() {
    const sortedOrders = orders.filter(order => order.orderStatus === 'success')
        .sort((a, b) => b.totalPrice - a.totalPrice);

    let html = sortedOrders.reduce((acc, order) => {
        return acc + `
            <li class="row border-bottom border-secondary pb-1 pt-4">
                <div class="col-12 col-md-3 col-lg-2 d-flex justify-content-center align-items-center mb-3">
                    <img src="/laptop/${order.items[0].product.image[0]}" style="max-width: 150px; max-height: 150px">
                </div>
                <div class="col-12 col-md-8 col-lg-7 pl-5">
                    <span class="font-weight-bold">Người đặt đơn: </span>
                    <span>${order.receiverName}</span>
                    <br>
                    <span class="font-weight-bold">Số điện thoại: </span>
                    <span>${order.phone}</span>
                    <br>
                    <span class="font-weight-bold">Địa chỉ nhận hàng: </span>
                    <span>${order.address}</span>
                    <br>
                    <span class="font-weight-bold">Ngày đặt: </span>   
                    <span>${formatDate(order.createdDay)}</span>
                    <br>
                    <span class="font-weight-bold">Ngày nhận hàng dự kiến: </span>
                    <span>${formatDate(order.arrivedDay, false)}</span>
                    <br>
                    <span class="font-weight-bold">Lưu ý: </span>
                    <span>${order.note || 'Không có'}</span>
                </div>
                <div class="col-12 col-lg-3">
                    <div class="text-right d-flex flex-column align-items-end justify-content-end" style="padding-bottom:20px">
                        <span class='text-success'>
                            <i class="fa-regular fa-circle-check"></i> Nhận hàng thành công
                        </span>
                        <div>
                            <span class="font-weight-bold">Phương thức thanh toán: </span>
                            <span>${order.paymentMethod}</span>
                            <br>
                            <span class="font-weight-bold">Phí vận chuyển: </span>
                            <span class="productCost">${order.deliveryFee.toLocaleString('en-US')}</span>đ
                            <br>
                            <span class="font-weight-bold">Thanh toán: </span>
                            <span class="cost">${order.totalPrice.toLocaleString('en-US')}đ</span>
                        </div>
                    </div>
                </div>
            </li>`;
    }, '');

    const priceRangeElement = document.querySelector('#nav-price');
    priceRangeElement.innerHTML = `<ul>${html}</ul>`;
}

// Initialize rendering of tabs content
function render() {
    renderTotalRevenue();
    renderMonthlyRevenue();
    renderBestSellingProducts();
    renderPriceRange();
}

// Execute the render function on page load
document.addEventListener('DOMContentLoaded', render);
