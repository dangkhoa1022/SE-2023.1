
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

    // Generate revenue data for the last 12 months
    const monthlyRevenue = Array(12).fill(0);
    const currentDate = new Date();
    
    orders.forEach(order => {
        if (order.orderStatus === 'success') {
            const orderDate = new Date(order.createdDay);
            const diffMonths = (currentDate.getFullYear() - orderDate.getFullYear()) * 12 + (currentDate.getMonth() - orderDate.getMonth());
            if (diffMonths < 12) {
                monthlyRevenue[11 - diffMonths] += order.totalPrice;
            }
        }
    });

    // Create a chart container
    const chartContainer = document.createElement('canvas');
    chartContainer.id = 'revenueChart';
    totalRevenueElement.appendChild(chartContainer);

    // Render the chart
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: 12 }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11 + i);
                return date.toLocaleString('default', { month: 'short', year: 'numeric' });
            }),
            datasets: [{
                label: 'Doanh thu',
                data: monthlyRevenue,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('en-US') + 'đ';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Doanh thu: ${context.raw.toLocaleString('en-US')}đ`;
                        }
                    }
                }
            }
        }
    });
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
            const { product } = item;
            const key = product.name_model;
            if (productCount[key]) {
                productCount[key].quantity += item.quantity;
            } else {
                productCount[key] = { quantity: item.quantity, details: product };
            }
        });
    });

    const sortedProducts = Object.entries(productCount).sort((a, b) => b[1].quantity - a[1].quantity);

    let html = sortedProducts.reduce((acc, [product, { quantity, details }]) => {
        return acc + `
            <li>
                <strong>${product}</strong>: ${quantity}
                <ul>
                    <li>Price: ${details.price.toLocaleString('en-US')}đ</li>
                </ul>
            </li>`;
    }, '');

    const bestSellingElement = document.querySelector('#nav-product');
    bestSellingElement.innerHTML = `<ul>${html}</ul>`;
}

// Render content for Khoảng giá tab
function renderPriceRange() {
    const priceRanges = [
        { min: 0, max: 10000000, label: '0-10 triệu' },
        { min: 10000000, max: 20000000, label: '10-20 triệu' },
        { min: 20000000, max: 30000000, label: '20-30 triệu' },
        { min: 30000000, max: 40000000, label: '30-40 triệu' },
        { min: 40000000, max: 50000000, label: '40-50 triệu' },
        { min: 50000000, max: 60000000, label: '50-60 triệu' },
        { min: 60000000, max: Infinity, label: 'Trên 60 triệu' }
    ];

    const rangeCounts = priceRanges.map(() => 0);
    const rangeRevenue = priceRanges.map(() => 0);
    const productCountsByRange = priceRanges.map(() => ({}));

    orders.filter(order => order.orderStatus === 'success').forEach(order => {
        order.items.forEach(item => {
            const price = item.product.price;
            priceRanges.forEach((range, index) => {
                if (price >= range.min && price < range.max) {
                    rangeCounts[index] += item.quantity;
                    rangeRevenue[index] += item.quantity * price;
                    const productKey = item.product.name_model;
                    if (!productCountsByRange[index][productKey]) {
                        productCountsByRange[index][productKey] = { quantity: 0, price: item.product.price };
                    }
                    productCountsByRange[index][productKey].quantity += item.quantity;
                }
            });
        });
    });

    let html = '';
    priceRanges.forEach((range, index) => {
        html += `<h3>${range.label} (Tổng số tiền: ${rangeRevenue[index].toLocaleString('en-US')}đ)</h3><ul>`;
        Object.entries(productCountsByRange[index]).forEach(([product, { quantity, price }]) => {
            html += `<li>${product}: ${quantity} sản phẩm (Giá: ${price.toLocaleString('en-US')}đ)</li>`;
        });
        html += '</ul>';
    });

    const priceRangeElement = document.querySelector('#nav-price');
    priceRangeElement.innerHTML = html;
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
