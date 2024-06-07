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
                        (${product.cpu} | ${product.ram} GB | ${
		product.ssd
	} GB )
                    </p>
                   
                </div>
                <div class="col-12 col-lg-4">
                    <div class="text-right d-flex flex-column align-items-end justify-content-end">

                        <div>
                            <span class="productCost text-secondary">
                                ${product.price.toLocaleString('en-US')}đ x ${
		item.quantity
	}
                            </span>
                            <br>
                            
                        </div>
                    </div>
                </div>
            </div>`;
};

const getButton = (status, id) => {
	if (status === 'pending') {
		return `
      <button 
        type="button" 
        class="mt-4 text-right btn btn-danger delete-btn" 
        data-toggle="modal" 
        data-target="#staticBackdrop" 
        data-id = '${id}'
       >
        <i class="fa-solid fa-trash-can"></i> 
        Hủy đơn hàng
      </button>
    `;
	}

	if (status === 'delivering') {
		return `
      <button 
        type="button" 
        data-toggle="modal" 
        data-id = '${id}'
        data-target="#staticBackdrop2" 
        class="mt-4 text-right btn btn-success receive-btn" 
       >
        <i class="fa-solid fa-trash-can"></i> 
        Đã nhận hàng
      </button>
    `;
	}

	return '';
};

const updateOrder = async (id, orderStatus, note) => {
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

	console.log(orders);
	orders.forEach((order) => {
		if (order._id === id) order.orderStatus = orderStatus;
	});
};

const render = () => {
	const statuses = ['pending', 'success', 'delivering', 'rejected'];
	statuses.forEach((status) => renderList(status));
};

const renderList = (status) => {
	const list = document.querySelector(`#${status}-order`);
	const filterOrder = orders.filter((order) => order.orderStatus === status);
	if (filterOrder.length === 0) {
		list.innerHTML = `
			<li class='row border-bottom border-secondary pb-5 pt-5' style="display:block; font-size: 25; text-align:center;">
				Không có đơn hàng nào!
			</li>
		`;
		return;
	}
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
                          <span class="font-weight-bold">Phương thức TT: 
                          </span>
                          <span >${order.paymentMethod}</span>
                          <span class="font-weight-bold">Phí ship: </span>
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

let deleteId = '';
let receiveId = '';

const deleteBtns = document.querySelectorAll('.delete-btn');

deleteBtns.forEach((btn) => {
	btn.onclick = () => {
		deleteId = btn.dataset.id;
	};
});

const receiveBtns = document.querySelectorAll('.receive-btn');

receiveBtns.forEach((btn) => {
	btn.onclick = () => {
		receiveId = btn.dataset.id;
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
	window.location.replace(`/myorder`);
};

const confirmReceiveBtn = document.querySelector('.confirm-receive-btn');

confirmReceiveBtn.onclick = async () => {
	await fetch(`http://localhost:8000/api/purchase/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			orderStatus: 'success',
			id: receiveId,
		}),
	});

	showAlert('success', 'Đã nhận đơn hàng thành công');
	window.location.replace(`/myorder`);
};
