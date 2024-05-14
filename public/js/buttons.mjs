const increaseBtns = document.querySelectorAll('.increaseBtn');
const decreaseBtns = document.querySelectorAll('.decreaseBtn');
const deleteBtns = document.querySelectorAll('.deleteBtn');
const selectCheckboxs = document.querySelectorAll(
	'input[type="checkbox"].selectItem',
);
let cost = document.querySelectorAll('.cost');
let costTotal = document.querySelectorAll('.totalCost');
const seclectedPurchaseItems = [];
const updateQtn = (itemID, qtn) => {
	let array = seclectedPurchaseItems.map((item) => item.purchaseItem);
	let index = array.indexOf(itemID);
	if (index !== -1) {
		seclectedPurchaseItems[index].quantity = qtn;
	}
	calculateTotal();
};
const calculateTotal = () => {
	let total = seclectedPurchaseItems.reduce((acc, cur) => {
		return acc + cur.laptop.price * cur.quantity;
	}, 0);
	costTotal.forEach((el) => {
		el.innerText = total.toLocaleString('en-US');
	});
};
const costChange = (sign, btn) => () => {
	const productCost = parseFloat(
		btn
			.closest('li')
			.querySelector('.productCost')
			.innerText.replaceAll(',', ''),
	);
	const cost = btn.closest('li').querySelector('.cost');
	const qtnBtn = btn.closest('.btn-group').querySelector('button:nth-child(2)');
	let qtn = parseFloat(qtnBtn.innerText.replaceAll(',', ''));
	if (sign) {
		qtn++;
		cost.innerText = (productCost * qtn).toLocaleString('en-US');
		updateQtn(btn.dataset.item, qtn);
	} else {
		if (qtn === 0) return;
		qtn--;
		cost.innerText = (productCost * qtn).toLocaleString('en-US');
		updateQtn(btn.dataset.item, qtn);
	}
	qtnBtn.innerText = qtn;
};
increaseBtns.forEach((btn) => {
	btn.onclick = costChange(true, btn);
});

decreaseBtns.forEach((btn) => {
	btn.onclick = costChange(false, btn);
});

const deletePurchaseItem = [];
deleteBtns.forEach((btn) => {
	const itemId = btn.dataset.item;
	btn.onclick = async () => {
		btn.closest('li').style.display = 'none';
		deletePurchaseItem.push(itemId);
		let array = seclectedPurchaseItems.map((item) => item.purchaseItem);
		let index = array.indexOf(itemId);
		if (index !== -1) {
			seclectedPurchaseItems.splice(index, 1);
			calculateTotal();
		}
	};
});

const purchaseBtn = document.querySelector('.purchase-btn');

selectCheckboxs.forEach((checkbox) => {
	checkbox.onchange = () => {
		const item = JSON.parse(checkbox.dataset.item);
		let array = seclectedPurchaseItems.map((item) => item.purchaseItem);
		let index = array.indexOf(item.purchaseItem);
		if (index !== -1) {
			seclectedPurchaseItems.splice(index, 1);
			calculateTotal('asdasd', 0);
		} else {
			let quantity = parseFloat(
				checkbox.closest('li').querySelector('.quantity').innerText,
			);
			seclectedPurchaseItems.push({
				...item,
				quantity,
			});
			calculateTotal();
		}
		if (seclectedPurchaseItems.length === 0) {
			purchaseBtn.style.display = 'none';
		} else {
			purchaseBtn.style.display = 'block';
		}
	};
});

calculateTotal();

window.onbeforeunload = function () {
	fetch(`http://localhost:8000/api/cart/delete`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			deletedIds: deletePurchaseItem,
		}),
	});

	const initialItems = {};
	JSON.parse(document.querySelector('ul').dataset.products).forEach((item) => {
		initialItems[item.id] = JSON.parse(item.quantity);
	});

	const updatedItems = Array.from(document.querySelectorAll('div.btn-toolbar'))
		.map((item) => {
			let id = item.querySelector('.decreaseBtn').dataset.item;
			let quantity = item.querySelector('.quantity').innerText;

			return {
				id,
				quantity,
			};
		})
		.filter((item) => {
			return initialItems[item.id] !== item.quantity;
		});

	fetch(`http://localhost:8000/api/cart/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			updatedItems,
		}),
	});
};
