import axios from 'axios';

const getProductFromForm = (id = -1) => {
    const formValues = {};
    let formElement;
    if (id > -1) {
        formElement = document.querySelector(`form#update-form${id}`);
    } else {
        formElement = document.querySelector(`form#create-form`);
    }
    formValues['productName'] = formElement.querySelector('input#p_product_name').value;
    formValues['oldPrice'] = parseInt(formElement.querySelector('input#p_old_price').value);
    formValues['discountPercentage'] = parseInt(formElement.querySelector('input#p_discount_percentage').value);
    formValues['display'] = formElement.querySelector('input#p_display').value;
    formValues['cpu'] = formElement.querySelector('input#p_cpu').value;
    formValues['gpuName'] = formElement.querySelector('input#p_gpu_name').value;
    formValues['ram'] = parseInt(formElement.querySelector('input#p_ram').value);
    formValues['ssd'] = parseInt(formElement.querySelector('input#p_ssd').value);
    formValues['manufacturer'] = formElement.querySelector('input#p_manufacturer').value;
    formValues['stockQuantity'] = parseInt(formElement.querySelector('input#p_stock_quantity').value);
    formValues['material'] = formElement.querySelector('input#p_material').value;
    formValues['operatingSystem'] = formElement.querySelector('input#p_operating_system').value;
    formValues['cpuType'] = formElement.querySelector('select#p_cpu_type').options[formElement.querySelector('select#p_cpu_type').selectedIndex].value;
    formValues['available'] = parseInt(formElement.querySelector('select#p_available').options[formElement.querySelector('select#p_available').selectedIndex].value);
    formValues['gpuOnboard'] = parseInt(formElement.querySelector('select#p_gpu_onboard').options[formElement.querySelector('select#p_gpu_onboard').selectedIndex].value);
    formValues['productId'] = formElement.dataset.product;

    return formValues;
};

const updateProduct = async (id) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/products/${id}`,
            data: getProductFromForm(id)
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Updated successfully!');
        }
    } catch (err) {
        console.log(err);
        showAlert('error', 'Invalid Update');
    }
};

const deleteProduct = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/products/${id}`
        });
        if (res.status === 204) {
            showAlert('success', 'Deleted successfully!');
        }
    } catch (err) {
        console.log(err);
        showAlert('error', 'Invalid Delete');
    }
};

const createProduct = async () => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/products',
            data: getProductFromForm()
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Created successfully!');
        }
    } catch (err) {
        console.log(err);
        showAlert('error', 'Invalid Creation');
    }
};

const updateBtns = document.querySelectorAll('button.btn.btn-primary.btn-update');
updateBtns.forEach(e => {
    e.onclick = () => {
        updateProduct(e.dataset.id);
    };
});

const deleteBtns = document.querySelectorAll('button.btn.btn-danger.btn-delete');
deleteBtns.forEach(e => {
    e.onclick = () => {
        deleteProduct(e.dataset.id);
    };
});

const createBtn = document.querySelector('button.btn.btn-primary.btn-create');
createBtn.onclick = () => {
    createProduct();
};

const showAlert = (type, message) => {
    alert(`${type.toUpperCase()}: ${message}`);
};
