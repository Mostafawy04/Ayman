// بيانات التطبيق
let customers = [
    { id: 1, name: "أحمد محمد", phone: "0123456789", address: "شارع النخيل - الرياض", orders: 5 },
    { id: 2, name: "سعيد عبدالله", phone: "0123456788", address: "حي العليا - جدة", orders: 3 },
    { id: 3, name: "خالد علي", phone: "0123456787", address: "حي الربيع - الدمام", orders: 2 }
];

let orders = [
    { id: 1, customerId: 1, customerName: "أحمد محمد", type: "بدلة كاملة", orderDate: "2023-05-01", deliveryDate: "2023-05-15", amount: 450, status: "completed", material: "صوف رمادي" },
    { id: 2, customerId: 2, customerName: "سعيد عبدالله", type: "قميص", orderDate: "2023-05-10", deliveryDate: "2023-05-25", amount: 120, status: "in-progress", material: "قطن أزرق" },
    { id: 3, customerId: 3, customerName: "خالد علي", type: "بنطال", orderDate: "2023-05-12", deliveryDate: "2023-05-20", amount: 150, status: "new", material: "كتان أسود" }
];

let measurements = [
    { id: 1, customerId: 1, customerName: "أحمد محمد", date: "2023-05-01", neck: 40, shoulder: 45, chest: 100, waist: 90, hips: 95, armLength: 60, armCircumference: 35, shirtLength: 75, pantsLength: 105, pantsWaist: 90 },
    { id: 2, customerId: 2, customerName: "سعيد عبدالله", date: "2023-05-10", neck: 38, shoulder: 42, chest: 95, waist: 85, hips: 90, armLength: 58, armCircumference: 32, shirtLength: 72, pantsLength: 102, pantsWaist: 85 }
];

let materials = [
    { id: 1, name: "قطن أزرق", type: "cotton", color: "#1e88e5", price: 25, qty: 50 },
    { id: 2, name: "صوف رمادي", type: "wool", color: "#757575", price: 45, qty: 30 },
    { id: 3, name: "كتان أسود", type: "linen", color: "#000000", price: 35, qty: 40 }
];

// متغيرات DOM
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav a');
const modalOverlay = document.getElementById('modal-overlay');
const modals = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// تهيئة التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    // تحديث الإحصائيات
    updateStats();
    
    // عرض أحدث الطلبات
    displayRecentOrders();
    
    // عرض العملاء
    displayCustomers();
    
    // عرض الطلبات
    displayOrders();
    
    // عرض القياسات
    displayMeasurements();
    
    // عرض الأقمشة
    displayMaterials();
    
    // ملء قوائم العملاء في النماذج
    populateCustomerSelects();
    
    // ملء قائمة الأقمشة في نموذج الطلب
    populateMaterialSelect();
});

// تبديل الأقسام
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        
        // إزالة النشاط من جميع الروابط والأقسام
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // إضافة النشاط للرابط والقسم المحدد
        link.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
    });
});

// فتح وإغلاق النماذج (موديلات)
document.getElementById('add-customer-btn').addEventListener('click', () => {
    openModal('add-customer-modal');
});

document.getElementById('add-order-btn').addEventListener('click', () => {
    openModal('add-order-modal');
});

document.getElementById('add-material-btn').addEventListener('click', () => {
    openModal('add-material-modal');
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    modalOverlay.style.display = 'flex';
}

function closeModal() {
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    modalOverlay.style.display = 'none';
}

// إضافة عميل جديد
document.getElementById('customer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const notes = document.getElementById('customer-notes').value;
    
    const newCustomer = {
        id: customers.length + 1,
        name,
        phone,
        address,
        notes,
        orders: 0
    };
    
    customers.push(newCustomer);
    displayCustomers();
    populateCustomerSelects();
    updateStats();
    closeModal();
    e.target.reset();
});

// إضافة طلب جديد
document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('order-customer').value);
    const customer = customers.find(c => c.id === customerId);
    const customerName = customer ? customer.name : '';
    
    const newOrder = {
        id: orders.length + 1,
        customerId,
        customerName,
        type: document.getElementById('order-type').value,
        orderDate: document.getElementById('order-date').value,
        deliveryDate: document.getElementById('delivery-date').value,
        amount: parseFloat(document.getElementById('order-amount').value),
        status: document.getElementById('order-status').value,
        material: document.getElementById('order-material').value,
        notes: document.getElementById('order-notes').value
    };
    
    orders.push(newOrder);
    
    // زيادة عدد طلبات العميل
    if (customer) {
        customer.orders += 1;
    }
    
    displayOrders();
    displayRecentOrders();
    updateStats();
    closeModal();
    e.target.reset();
});

// إضافة قياسات جديدة
document.getElementById('measurement-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('customer-for-measurement').value);
    const customer = customers.find(c => c.id === customerId);
    const customerName = customer ? customer.name : '';
    
    const newMeasurement = {
        id: measurements.length + 1,
        customerId,
        customerName,
        date: new Date().toISOString().split('T')[0],
        neck: parseFloat(document.getElementById('neck').value) || 0,
        shoulder: parseFloat(document.getElementById('shoulder').value) || 0,
        chest: parseFloat(document.getElementById('chest').value) || 0,
        waist: parseFloat(document.getElementById('waist').value) || 0,
        hips: parseFloat(document.getElementById('hips').value) || 0,
        armLength: parseFloat(document.getElementById('arm-length').value) || 0,
        armCircumference: parseFloat(document.getElementById('arm-circumference').value) || 0,
        shirtLength: parseFloat(document.getElementById('shirt-length').value) || 0,
        pantsLength: parseFloat(document.getElementById('pants-length').value) || 0,
        pantsWaist: parseFloat(document.getElementById('pants-waist').value) || 0
    };
    
    measurements.push(newMeasurement);
    displayMeasurements();
    closeModal();
    e.target.reset();
});

// إضافة قماش جديد
document.getElementById('material-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMaterial = {
        id: materials.length + 1,
        name: document.getElementById('material-name').value,
        type: document.getElementById('material-type').value,
        color: document.getElementById('material-color').value,
        price: parseFloat(document.getElementById('material-price').value),
        qty: parseFloat(document.getElementById('material-qty').value)
    };
    
    materials.push(newMaterial);
    displayMaterials();
    populateMaterialSelect();
    closeModal();
    e.target.reset();
});

// تصفية الطلبات
document.getElementById('order-filter').addEventListener('change', (e) => {
    displayOrders(e.target.value);
});

// توليد التقارير
document.getElementById('generate-report').addEventListener('click', generateReport);

// وظائف العرض
function updateStats() {
    document.getElementById('new-orders').textContent = orders.filter(o => o.status === 'new').length;
    document.getElementById('in-progress').textContent = orders.filter(o => o.status === 'in-progress').length;
    document.getElementById('completed').textContent = orders.filter(o => o.status === 'completed').length;
    document.getElementById('total-customers').textContent = customers.length;
}

function displayRecentOrders() {
    const tbody = document.querySelector('#recent-orders-table tbody');
    tbody.innerHTML = '';
    
    const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);
    
    recentOrders.forEach(order => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${getOrderTypeName(order.type)}</td>
            <td>${order.orderDate}</td>
            <td><span class="status status-${order.status}">${getStatusName(order.status)}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}

function displayCustomers() {
    const tbody = document.querySelector('#customers-table tbody');
    tbody.innerHTML = '';
    
    customers.forEach(customer => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${customer.orders}</td>
            <td>
                <button class="btn" onclick="editCustomer(${customer.id})"><i class="fas fa-edit"></i></button>
                <button class="btn" onclick="deleteCustomer(${customer.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function displayOrders(filter = 'all') {
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    
    let filteredOrders = orders;
    
    if (filter !== 'all') {
        filteredOrders = orders.filter(order => order.status === filter);
    }
    
    filteredOrders.forEach(order => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${getOrderTypeName(order.type)}</td>
            <td>${order.orderDate}</td>
            <td>${order.deliveryDate}</td>
            <td>${order.amount} ر.س</td>
            <td><span class="status status-${order.status}">${getStatusName(order.status)}</span></td>
            <td>
                <button class="btn" onclick="editOrder(${order.id})"><i class="fas fa-edit"></i></button>
                <button class="btn" onclick="deleteOrder(${order.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function displayMeasurements() {
    const tbody = document.querySelector('#measurements-table tbody');
    tbody.innerHTML = '';
    
    measurements.forEach(measurement => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${measurement.customerName}</td>
            <td>${measurement.date}</td>
            <td>${measurement.chest} سم</td>
            <td>${measurement.waist} سم</td>
            <td>${measurement.armLength} سم</td>
            <td>
                <button class="btn" onclick="viewMeasurement(${measurement.id})"><i class="fas fa-eye"></i></button>
                <button class="btn" onclick="deleteMeasurement(${measurement.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function displayMaterials() {
    const grid = document.querySelector('.materials-grid');
    grid.innerHTML = '';
    
    materials.forEach(material => {
        const card = document.createElement('div');
        card.className = 'material-card';
        
        card.innerHTML = `
            <div class="material-color" style="background-color: ${material.color};"></div>
            <div class="material-info">
                <h3>${material.name}</h3>
                <p>النوع: ${getMaterialTypeName(material.type)}</p>
                <p>السعر: ${material.price} ر.س/م</p>
                <p>الكمية: ${material.qty} م</p>
                <div class="actions">
                    <button class="btn" onclick="editMaterial(${material.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn" onclick="deleteMaterial(${material.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// وظائف المساعدة
function populateCustomerSelects() {
    const selects = document.querySelectorAll('select[id^="customer-for"], #order-customer');
    
    selects.forEach(select => {
        select.innerHTML = '<option value="">-- اختر عميل --</option>';
        
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            select.appendChild(option);
        });
    });
}

function populateMaterialSelect() {
    const select = document.getElementById('order-material');
    select.innerHTML = '<option value="">-- اختر قماش --</option>';
    
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material.name;
        option.textContent = `${material.name} (${getMaterialTypeName(material.type)})`;
        select.appendChild(option);
    });
}

function getOrderTypeName(type) {
    const types = {
        'shirt': 'قميص',
        'pants': 'بنطال',
        'suit': 'بدلة كاملة',
        'dress': 'فستان',
        'other': 'أخرى'
    };
    
    return types[type] || type;
}

function getStatusName(status) {
    const statuses = {
        'new': 'جديد',
        'in-progress': 'قيد التنفيذ',
        'completed': 'مكتمل'
    };
    
    return statuses[status] || status;
}

function getMaterialTypeName(type) {
    const types = {
        'cotton': 'قطن',
        'linen': 'كتان',
        'wool': 'صوف',
        'silk': 'حرير',
        'synthetic': 'صناعي'
    };
    
    return types[type] || type;
}

function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const reportPeriod = document.getElementById('report-period').value;
    
    let labels = [];
    let data = [];
    
    if (reportType === 'orders') {
        labels = ['جديدة', 'قيد التنفيذ', 'مكتملة'];
        data = [
            orders.filter(o => o.status === 'new').length,
            orders.filter(o => o.status === 'in-progress').length,
            orders.filter(o => o.status === 'completed').length
        ];
    } else if (reportType === 'revenue') {
        // تبسيط البيانات للتوضيح
        labels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'];
        data = [1200, 1900, 1500, 1800, 2200];
    } else if (reportType === 'customers') {
        labels = customers.slice(0, 5).map(c => c.name);
        data = customers.slice(0, 5).map(c => c.orders);
    }
    
    renderChart(labels, data, reportType);
}

function renderChart(labels, data, type) {
    const ctx = document.getElementById('report-chart').getContext('2d');
    
    // تدمير الرسم البياني القديم إذا كان موجودًا
    if (window.reportChart) {
        window.reportChart.destroy();
    }
    
    let chartType = 'bar';
    let backgroundColor = 'rgba(54, 162, 235, 0.5)';
    let borderColor = 'rgba(54, 162, 235, 1)';
    
    if (type === 'revenue') {
        chartType = 'line';
        backgroundColor = 'rgba(75, 192, 192, 0.5)';
        borderColor = 'rgba(75, 192, 192, 1)';
    } else if (type === 'customers') {
        chartType = 'pie';
        backgroundColor = [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
        ];
        borderColor = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
        ];
    }
    
    window.reportChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: type === 'revenue' ? 'الإيرادات (ر.س)' : (type === 'orders' ? 'عدد الطلبات' : 'عدد الطلبات'),
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// وظائف التعديل والحذف (يمكن تطويرها أكثر)
function editCustomer(id) {
    alert(`سيتم تعديل العميل رقم ${id}`);
    // يمكن تطوير هذه الوظيفة لفتح نموذج التعديل مع تعبئة البيانات
}

function deleteCustomer(id) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        customers = customers.filter(c => c.id !== id);
        displayCustomers();
        populateCustomerSelects();
        updateStats();
    }
}

function editOrder(id) {
    alert(`سيتم تعديل الطلب رقم ${id}`);
}

function deleteOrder(id) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        const order = orders.find(o => o.id === id);
        if (order) {
            // تقليل عدد طلبات العميل
            const customer = customers.find(c => c.id === order.customerId);
            if (customer && customer.orders > 0) {
                customer.orders -= 1;
            }
        }
        
        orders = orders.filter(o => o.id !== id);
        displayOrders();
        displayRecentOrders();
        updateStats();
    }
}

function viewMeasurement(id) {
    const measurement = measurements.find(m => m.id === id);
    if (measurement) {
        alert(`تفاصيل القياسات للعميل ${measurement.customerName}:
- الرقبة: ${measurement.neck} سم
- الكتف: ${measurement.shoulder} سم
- الصدر: ${measurement.chest} سم
- الخصر: ${measurement.waist} سم
- الأرداف: ${measurement.hips} سم
- طول الكم: ${measurement.armLength} سم
- محيط الكم: ${measurement.armCircumference} سم
- طول القميص: ${measurement.shirtLength} سم
- طول البنطال: ${measurement.pantsLength} سم
- خصر البنطال: ${measurement.pantsWaist} سم`);
    }
}

function deleteMeasurement(id) {
    if (confirm('هل أنت متأكد من حذف هذه القياسات؟')) {
        measurements = measurements.filter(m => m.id !== id);
        displayMeasurements();
    }
}

function editMaterial(id) {
    alert(`سيتم تعديل القماش رقم ${id}`);
}

function deleteMaterial(id) {
    if (confirm('هل أنت متأكد من حذف هذا القماش؟')) {
        materials = materials.filter(m => m.id !== id);
        displayMaterials();
        populateMaterialSelect();
    }
}