const buyBtn = document.querySelector('.purchase-btn');

if (buyBtn) {
	buyBtn.onmouseup = (e) => {
		renderPaymentForm();
	};
}

let selectedItems;
const renderPaymentForm = () => {
	const selectedCheckboxs = document.querySelectorAll(
		'input[type="checkbox"].selectItem',
	);
	const purchaseItemList = document.querySelector('ul.purchaseItemsList');

	selectedItems = Array.from(selectedCheckboxs)
		.filter((checkbox) => checkbox.checked)
		.map((checkbox) => {
			const item = JSON.parse(checkbox.dataset.item);
			item.quantity = checkbox
				.closest('li')
				.querySelector('.quantity').innerText;
			return item;
		});
	if (selectedItems.length === 0) {
		showAlert('warning', 'Vui lòng chọn ít nhất 1 sản phẩm để đặt đơn!');
		return;
	}
	let totalCost = selectedItems.reduce((total, item) => {
		return total + item.laptop.price * item.quantity;
	}, 0);
	let html = selectedItems.reduce((accumulate, item) => {
		return getHtmlForItem(item) + accumulate;
	}, '');
	html += `<li class="row border-bottom" style="display: block; text-align: end; padding-right: 15px;">
		<span class="font-weight-bold text-secondary">Tổng: </span><span class="totalCost">${totalCost.toLocaleString(
			'en-US',
		)}đ</span> </li>`;
	purchaseItemList.innerHTML = html;
};

const getHtmlForItem = (item) => {
	const product = item.laptop;
	return `<li class="row">
                <div class="col-12 col-md-2 col-lg-2 d-flex justify-content-center align-items-center">
                    <img src="/laptop/${
											product.image[0]
										}" style="max-width: 50px; max-height: 50px">
                </div>
                <div class="col-12 col-md-8 col-lg-7 pl-1" x>
                    <p class="h7">
                        ${product.name_model} 
                        </br>
                        (${product.cpu} | ${product.ram} GB | ${
		product.ssd
	} GB )
                    </p>
                   
                </div>
                <div class="col-12 col-lg-3">
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
            </li>`;
};

const receiverNameInput = document.getElementById('receiverName');
const addressInput = document.getElementById('address');
const phoneNumInput = document.getElementById('phoneNum');
const noteInput = document.getElementById('note');
const paymentMethodInputs = document.querySelectorAll(
	`input[name="gridRadios"]`,
);

paymentMethodInputs.forEach(
	(input) =>
		(input.onclick = (e) => {
			e.checked = !e.checked;
		}),
);

const submitButton = document.querySelector('button.submit.btn.btn-primary');

submitButton.onclick = async () => {
	try {
		const receiverName = receiverNameInput.value.trim();
		const address = addressInput.value.trim();
		const phone = phoneNumInput.value.trim();
		const note = noteInput.value.trim() || '';
		const paymentMethodInput = Array.from(paymentMethodInputs).find(
			(input) => input.checked,
		);
		const paymentMethod = paymentMethodInput.value;
		const deliveryData = {
			receiverName,
			address,
			phone,
			note,
			paymentMethod,
		};
		if (validateInput()) return;

		const cartId = JSON.parse(document.querySelector('h3').dataset.cartid);
		const deletedIds = selectedItems.map((item) => item.purchaseItem);
		if (paymentMethod === 'COD') {
			await paymentWithCOD(deliveryData);
			emptyCart(cartId, deletedIds);
		} else {
			await paymentWithStripe(deliveryData, cartId, deletedIds);
		}

		window.location.replace('/myorder');
	} catch (err) {
		console.log(err);
	}
};

const validateInput = () => {
	let invalid = false;
	const inputs = document.querySelectorAll('.form-group');
	inputs.forEach((input) => {
		const value = input.querySelector('input').value.trim();
		const msg = input.querySelector('.err-msg');
		if (!msg) return;
		if (value === '') {
			invalid = true;
			msg.style.display = 'block';
		} else {
			msg.style.display = 'none';
		}
	});
	console.log('invalid', invalid);
	return invalid;
};

const inputs = document.querySelectorAll('.form-group');
inputs.forEach((input) => {
	input.querySelector('input').addEventListener('input', (e) => {
		const msg = input.querySelector('.err-msg');
		if (!msg) return;
		msg.style.display = 'none';
	});
});

const paymentWithCOD = async (deliveryData) => {
	fetch(`http://localhost:8000/api/purchase/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...deliveryData,
			items: selectedItems.map((item) => item.purchaseItem),
			totalPrice: selectedItems.reduce((total, item) => {
				console.log(item);
				return total + item.laptop.price * parseInt(item.quantity);
			}, 0),
		}),
	});
};

const paymentWithStripe = async (deliveryData, cartId, deletedIds) => {
	let totalCost = selectedItems.reduce((total, item) => {
		return total + item.laptop.price * parseInt(item.quantity);
	}, 0);
	if (totalCost >= 100000000) {
		showAlert(
			'warning',
			'Không thể giao dịch online với đơn hàng có giá trị lớn hơn 99,999,999 vnđ',
		);
		return;
	}
	await purchaseItems(totalCost, deliveryData);
};

const stripe = Stripe(
	'pk_test_51MpCA0DfcEM9cIAmWGiqdhqfCoGX8bIXqDW2miaXFhARb39RzUhokPTAZ6KNPkNfzmY6OiBjN7xzpcXolzo1KclG00YIVSUyC6',
);

const purchaseItems = async (total, deliveryData) => {
	let query = JSON.stringify({
		...deliveryData,
		items: selectedItems.map((item) => item.purchaseItem),
		totalPrice: selectedItems.reduce((total, item) => {
			console.log(item);
			return total + item.laptop.price * parseInt(item.quantity);
		}, 0),
	});
	try {
		//1. Get checkout session from API
		const session = await axios(
			`/api/purchase/checkout-session/${total}?query=${query}`,
		);
		//2. Create checkout form + charge credit card
		stripe.redirectToCheckout({
			sessionId: session.data.session.id,
		});
	} catch (error) {
		showAlert('error', error);
		throw error;
	}
};

const emptyCart = async (cartId, deletedIds) => {
	fetch(`http://localhost:8000/api/cart/delete`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			cartId,
			deletedIds,
		}),
	});
};
