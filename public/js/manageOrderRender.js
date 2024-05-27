let orders = JSON.parse(
	document.querySelector('#nav-tabContent').dataset.orders,
);

function formatDate(isoString, getHour = true) {
	// Create a new Date object from the ISO string
	const date = new Date(isoString);

	// Extract the components
	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
	const year = date.getUTCFullYear();

	// Format the date and time
	const formattedTime = `${hours}:${minutes}`;
	const formattedDate = `${day}-${month}-${year}`;

	// Combine the formatted time and date
	if (getHour) return `${formattedTime} ${formattedDate}`;
	else return `${formattedDate}`;
}

const getDetailOrder = (items, index) => {
	const htmlItems = items.reduce((accumulate, item) => {
		return accumulate + getHtmlForItem(item);
	}, '');
	return `
  <p>
    <a data-toggle="collapse" href="#collapseExample${index}" role="button" aria-expanded="false" aria-controls="collapseExample">
      >>> Sản phẩm
    </a>
  </p>
  <div class="collapse" id="collapseExample${index}">
    <div class="card card-body">
      ${htmlItems}
    </div>
  </div>`;
};

const getHtmlForItem = (item) => {
	const product = item.product;
	return `<div class="row">
            <div class="col-12 col-md-2 col-lg-2 d-flex justify-content-center align-items-center">
                <img src="/laptop/${
                  product.image[0]
                }" style="max-width: 80px; max-height: 80px">
            </div>
            <div class="col-12 col-md-8 col-lg-6 pl-1" x>
                <p style = 'font-size: 15px'>
                    ${product.name_model} 
                    </br>
                    (${product.cpu} | ${product.ram} GB | ${product.ssd} GB )
                </p>
            </div>
            <div class="col-12 col-lg-4">
              <div class="text-right d-flex flex-column align-items-end justify-content-end">
                <div>
                    <span class="productCost text-secondary">
                        ${product.price.toLocaleString('en-US')}đ x ${item.quantity}
                    </span>
                    <br>
                </div>
              </div>
            </div>
          </div>`;
};

const getButton = (status, id) => {
  // Use a ternary operator for a more concise approach
  return status === 'pending' ? `
    <button type="button" class="mt-4 text-right btn btn-primary accept-btn" data-id="${id}">
      <i class="fa-solid fa-check"></i> Chấp nhận
    </button>
    <button 
    type="button" class="mt-4 text-right btn btn-danger reject-btn" 
    data-toggle="modal" 
    data-target="#staticBackdrop" 
    data-id = '${id}'>
    <i class="fa-solid fa-trash-can"></i> 
    Từ chối
  </button>
  ` : '';
};



const render = () => {
	const statuses = ['pending', 'success', 'delivering', 'rejected'];
	statuses.forEach((status) => renderList(status));
};

const renderList = (status) => {
	const list = document.querySelector(`#${status}-order`);
	const filterOrder = orders.filter((order) => order.orderStatus === status);
	let html = filterOrder.reduce((accumulate, order, index) => {
		return (
			accumulate +
			`<li class="row border-bottom border-secondary pb-1 pt-4">
                <div class="col-12 col-md-3 col-lg-2 d-flex justify-content-center align-items-center mb-3">
                    <img src="/laptop/${
											order.items[0].product.image[0]
										}" style="max-width: 150px; max-height: 150">
                </div>
                <div class="col-12 col-md-8 col-lg-7 pl-5">
                    <span class="font-weight-bold">Người đặt đơn: </span>
                    <span >${order.receiverName}</span>
                    <br>
                    <span class="font-weight-bold">Số điện thoại: </span>
                    <span >${order.phone} </span>
                    <br>
                    <span class="font-weight-bold">Địa chỉ nhận hàng: 
                    </span>
                    <span >${order.address}</span>
                    <br>
                    <span class="font-weight-bold">Ngày đặt: 
                    </span>   
                    <span >${formatDate(order.createdDay)}</span>
                    <br>
                    <span class="font-weight-bold">Ngày nhận hàng dự kiến: 
                    </span>
                    <span >${formatDate(order.arrivedDay, false)}</span>
                    <br>
                    <span class="font-weight-bold">Lưu ý: 
                    </span>
                    <span >${order.note || 'Không có'}</span>
                    ${getDetailOrder(order.items, index)}
                </div>
                <div class="col-12 col-lg-3">
                    <div class="text-right d-flex flex-column align-items-end justify-content-end">
                      <div >
                        ${getStatus(order.orderStatus)}
                      </div>
                      <div>
                        <span class='text-success '> 
                        ${
													order.paid
														? `<i class="fa-solid fa-money-check-dollar"></i> Đã thanh toán`
														: ''
												}
                        </span>
                      </div>
                      <div>
                          <span class="font-weight-bold">Phương thức thanh toán: 
                          </span>
                          <span >${order.paymentMethod}</span>
                          <span class="font-weight-bold">Phí vận chuyển: </span>
                          <span class="productCost">
                              ${order.deliveryFee.toLocaleString('en-US')}
                          </span>
                          <span>đ</span>
                          <br>
                          <span class="font-weight-bold">Thanh toán: </span>
                          <span class="cost"> ${order.totalPrice.toLocaleString(
														'en-US',
													)} đ</span>
                      </div>
                    ${getButton(status, order._id)}
                </div>
            </li>`
		);
	}, '');

	list.innerHTML = html;
};

const getStatus = (status) => {
	switch (status) {
		case 'pending':
			return `
      <span class='text-warning'>
        <i class="fa-solid fa-box-open"></i> Đang chuẩn bị hàng
      </span>
      `;
		case 'delivering':
			return `
        <span class='text-primary'>
          <i class="fa-solid fa-truck"></i> Đang giao hàng
        </span>
      `;
		case 'success':
			return `
      <span class='text-success'>  
        <i class="fa-regular fa-circle-check"></i> Nhận hàng thành công
      </span>
      `;
		case 'rejected':
			return `
      <span class='text-danger'>
        <i class="fa-solid fa-trash-can"></i> Đã hủy
      </span>
      `;
	}
};

render();

const updateOrder = async (id, status, note) => {
	fetch(`http://localhost:8000/api/purchase/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			orderStatus,
			id,
			note,
		},
	});
};
const acceptBtns = document.querySelectorAll('.accept-btn');
let acceptId='';
acceptBtns.forEach((btn) => {
	btn.onclick = async() => {
		acceptId = btn.dataset.id;
    console.log(acceptId);
    await fetch(`http://localhost:8000/api/purchase/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderStatus: 'delivering',
        id: acceptId,
      }),
    });
    window.location.replace(`/manageOrder`);
	};
});




let deleteId = '';

const deleteBtns = document.querySelectorAll('.reject-btn');
deleteBtns.forEach((btn) => {
	btn.onclick = () => {
		deleteId = btn.dataset.id;
	};
});

const confirmDeleteBtn = document.querySelector('.confirm-delete-btn');

confirmDeleteBtn.onclick = async () => {
	const note = document.querySelector('#delete-note').value;
	await fetch(`http://localhost:8000/api/purchase/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			orderStatus: 'rejected',
			id: deleteId,
			note,
		}),
	});
	showAlert('success', 'Đã hủy đơn hàng thành công');
	window.location.replace(`/manageOrder`);
};
