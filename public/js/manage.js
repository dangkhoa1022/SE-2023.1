import axios from 'axios';

const getProductFromForm = (slug = -1) => {
    const formValues = {};
    
    let formElement;
    if (slug > -1) {
        formElement = document.querySelector(`form#update-form${slug}`);
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
    formValues['productslug'] = formElement.dataset.product;

    return formValues;
};

const updateProduct = async (slug) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/products/${slug}`,
            data: getProductFromForm(slug)
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Updated successfully!');
        }
    } catch (err) {
        console.log(err);
        showAlert('error', 'Invalslug Update');
    }
};

const deleteProduct = async (slug) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/products/${slug}`
        });
        if (res.status === 204) {
            showAlert('success', 'Deleted successfully!');
        }
    } catch (err) {
        console.log(err);
        showAlert('error', 'Invalslug Delete');
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
        showAlert('error', 'Invalslug Creation');
    }
};

const updateBtns = document.querySelectorAll('button.btn.btn-primary.btn-update');
updateBtns.forEach(e => {
    e.onclick = () => {
        updateProduct(e.dataset.slug);
    };
});

const deleteBtns = document.querySelectorAll('button.btn.btn-danger.btn-delete');
deleteBtns.forEach(e => {
    e.onclick = () => {
        deleteProduct(e.dataset.slug);
    };
});

const createBtn = document.querySelector('button.btn.btn-primary.btn-create');
createBtn.onclick = () => {
    createProduct();
};

const showAlert = (type, message) => {
    alert(`${type.toUpperCase()}: ${message}`);
};
