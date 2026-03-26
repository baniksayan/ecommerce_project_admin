/* ===== All seed data for the admin panel ===== */

export const products = [
  { id: 1, name: 'Banana (1 dozen)', category: 'Fruits', price: 40, stock: 120, image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e43e?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['fresh', 'popular'], sku: 'FR-001', createdAt: '2026-03-01' },
  { id: 2, name: 'Apple (1 kg)', category: 'Fruits', price: 180, stock: 3, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2ead1?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['fresh'], sku: 'FR-002', createdAt: '2026-03-02' },
  { id: 3, name: 'Basmati Rice (5kg)', category: 'Grocery', price: 580, stock: 45, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['staple'], sku: 'GR-001', createdAt: '2026-02-20' },
  { id: 4, name: 'Mustard Oil (1L)', category: 'Grocery', price: 210, stock: 0, image: 'https://images.unsplash.com/photo-1474979266404-7eaafbcd87b5?auto=format&fit=crop&w=120&h=120&q=60', status: 'inactive', tags: ['oil'], sku: 'GR-002', createdAt: '2026-02-15' },
  { id: 5, name: 'Tomato (500g)', category: 'Vegetables', price: 25, stock: 200, image: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['fresh', 'daily'], sku: 'VG-001', createdAt: '2026-03-10' },
  { id: 6, name: 'Onion (1 kg)', category: 'Vegetables', price: 35, stock: 150, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['staple'], sku: 'VG-002', createdAt: '2026-03-10' },
  { id: 7, name: 'Milk (1L Packet)', category: 'Dairy', price: 60, stock: 80, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['daily', 'essential'], sku: 'DA-001', createdAt: '2026-03-05' },
  { id: 8, name: 'Classic Cigarette', category: 'Tobacco', price: 250, stock: 30, image: 'https://images.unsplash.com/photo-1527005710-45fba7e0dcea?auto=format&fit=crop&w=120&h=120&q=60', status: 'restricted', tags: ['tobacco', '18+'], sku: 'TB-001', createdAt: '2026-03-12' },
  { id: 9, name: 'Surf Excel (1kg)', category: 'Household', price: 199, stock: 60, image: 'https://images.unsplash.com/photo-1585441695325-21557f83010d?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['household'], sku: 'HH-001', createdAt: '2026-03-08' },
  { id: 10, name: 'Colgate Toothpaste', category: 'Personal Care', price: 95, stock: 2, image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=120&h=120&q=60', status: 'active', tags: ['personal'], sku: 'PC-001', createdAt: '2026-03-14' },
];

export const categories = ['Fruits', 'Vegetables', 'Grocery', 'Dairy', 'Tobacco', 'Household', 'Personal Care', 'Snacks', 'Beverages'];

export const orders = [
  { id: 'ORD-1001', customerId: 1, customerName: 'Sayan Banik', email: 'sayan@example.com', items: [{ productId: 1, name: 'Banana (1 dozen)', qty: 2, price: 40 }, { productId: 3, name: 'Basmati Rice (5kg)', qty: 1, price: 580 }], total: 660, status: 'delivered', paymentMethod: 'UPI', date: '2026-03-20', address: '12, Park Street, Kolkata' },
  { id: 'ORD-1002', customerId: 2, customerName: 'Aditi Das', email: 'aditi@example.com', items: [{ productId: 5, name: 'Tomato (500g)', qty: 3, price: 25 }, { productId: 7, name: 'Milk (1L Packet)', qty: 2, price: 60 }], total: 195, status: 'shipped', paymentMethod: 'COD', date: '2026-03-22', address: '7, Salt Lake, Kolkata' },
  { id: 'ORD-1003', customerId: 3, customerName: 'Rahul Sen', email: 'rahul@example.com', items: [{ productId: 9, name: 'Surf Excel (1kg)', qty: 1, price: 199 }], total: 199, status: 'pending', paymentMethod: 'Card', date: '2026-03-24', address: '22, Howrah' },
  { id: 'ORD-1004', customerId: 4, customerName: 'Nina Roy', email: 'nina@example.com', items: [{ productId: 2, name: 'Apple (1 kg)', qty: 2, price: 180 }, { productId: 6, name: 'Onion (1 kg)', qty: 5, price: 35 }], total: 535, status: 'pending', paymentMethod: 'UPI', date: '2026-03-25', address: '9, Jadavpur, Kolkata' },
  { id: 'ORD-1005', customerId: 5, customerName: 'Amit Ghosh', email: 'amit@example.com', items: [{ productId: 4, name: 'Mustard Oil (1L)', qty: 2, price: 210 }], total: 420, status: 'cancelled', paymentMethod: 'UPI', date: '2026-03-18', address: '5, Behala, Kolkata' },
  { id: 'ORD-1006', customerId: 1, customerName: 'Sayan Banik', email: 'sayan@example.com', items: [{ productId: 10, name: 'Colgate Toothpaste', qty: 3, price: 95 }], total: 285, status: 'delivered', paymentMethod: 'Card', date: '2026-03-15', address: '12, Park Street, Kolkata' },
  { id: 'ORD-1007', customerId: 6, customerName: 'Priya Mondal', email: 'priya@example.com', items: [{ productId: 1, name: 'Banana (1 dozen)', qty: 1, price: 40 }, { productId: 5, name: 'Tomato (500g)', qty: 2, price: 25 }], total: 90, status: 'delivered', paymentMethod: 'COD', date: '2026-03-12', address: '31, Barasat' },
];

export const users = [
  { id: 1, name: 'Sayan Banik', email: 'sayan@example.com', phone: '+91 90000 00001', status: 'active', orders: 4, spent: 1530, joinedAt: '2026-01-10', lastActive: '2026-03-25T14:30:00', avatar: null },
  { id: 2, name: 'Aditi Das', email: 'aditi@example.com', phone: '+91 90000 00002', status: 'active', orders: 2, spent: 560, joinedAt: '2026-01-15', lastActive: '2026-03-24T10:15:00', avatar: null },
  { id: 3, name: 'Rahul Sen', email: 'rahul@example.com', phone: '+91 90000 00003', status: 'blocked', orders: 1, spent: 199, joinedAt: '2026-02-01', lastActive: '2026-03-20T08:00:00', avatar: null },
  { id: 4, name: 'Nina Roy', email: 'nina@example.com', phone: '+91 90000 00004', status: 'active', orders: 3, spent: 890, joinedAt: '2026-02-10', lastActive: '2026-03-25T16:45:00', avatar: null },
  { id: 5, name: 'Amit Ghosh', email: 'amit@example.com', phone: '+91 90000 00005', status: 'active', orders: 1, spent: 420, joinedAt: '2026-02-20', lastActive: '2026-03-22T12:00:00', avatar: null },
  { id: 6, name: 'Priya Mondal', email: 'priya@example.com', phone: '+91 90000 00006', status: 'active', orders: 2, spent: 310, joinedAt: '2026-03-01', lastActive: '2026-03-23T09:30:00', avatar: null },
];

export const reviews = [
  { id: 1, productId: 1, productName: 'Banana (1 dozen)', userId: 1, userName: 'Sayan Banik', rating: 5, comment: 'Very fresh bananas, excellent quality!', date: '2026-03-21', status: 'approved' },
  { id: 2, productId: 3, productName: 'Basmati Rice (5kg)', userId: 2, userName: 'Aditi Das', rating: 4, comment: 'Good quality rice, aromatic.', date: '2026-03-22', status: 'approved' },
  { id: 3, productId: 5, productName: 'Tomato (500g)', userId: 4, userName: 'Nina Roy', rating: 3, comment: 'Tomatoes were a bit overripe.', date: '2026-03-23', status: 'pending' },
  { id: 4, productId: 7, productName: 'Milk (1L Packet)', userId: 5, userName: 'Amit Ghosh', rating: 5, comment: 'Fresh milk delivered on time.', date: '2026-03-24', status: 'approved' },
  { id: 5, productId: 9, productName: 'Surf Excel (1kg)', userId: 3, userName: 'Rahul Sen', rating: 2, comment: 'Package was damaged during delivery.', date: '2026-03-19', status: 'flagged' },
  { id: 6, productId: 2, productName: 'Apple (1 kg)', userId: 6, userName: 'Priya Mondal', rating: 4, comment: 'Good quality Shimla apples.', date: '2026-03-25', status: 'pending' },
];

export const addresses = [
  { id: 1, userId: 1, label: 'Home', line1: '12, Park Street', line2: 'Near Metro Station', city: 'Kolkata', state: 'West Bengal', pin: '700016', isDefault: true },
  { id: 2, userId: 1, label: 'Office', line1: '45, Sector V', line2: 'Salt Lake', city: 'Kolkata', state: 'West Bengal', pin: '700091', isDefault: false },
  { id: 3, userId: 2, label: 'Home', line1: '7, Salt Lake', line2: '', city: 'Kolkata', state: 'West Bengal', pin: '700064', isDefault: true },
  { id: 4, userId: 4, label: 'Home', line1: '9, Jadavpur', line2: 'Near University', city: 'Kolkata', state: 'West Bengal', pin: '700032', isDefault: true },
];

export const wishlistItems = [
  { id: 1, userId: 1, productId: 2, productName: 'Apple (1 kg)', price: 180, addedAt: '2026-03-20' },
  { id: 2, userId: 1, productId: 9, productName: 'Surf Excel (1kg)', price: 199, addedAt: '2026-03-21' },
  { id: 3, userId: 2, productId: 3, productName: 'Basmati Rice (5kg)', price: 580, addedAt: '2026-03-22' },
  { id: 4, userId: 4, productId: 7, productName: 'Milk (1L Packet)', price: 60, addedAt: '2026-03-23' },
  { id: 5, userId: 5, productId: 1, productName: 'Banana (1 dozen)', price: 40, addedAt: '2026-03-24' },
];

export const cartItems = [
  { id: 1, userId: 1, productId: 5, productName: 'Tomato (500g)', qty: 4, price: 25 },
  { id: 2, userId: 2, productId: 7, productName: 'Milk (1L Packet)', qty: 3, price: 60 },
  { id: 3, userId: 4, productId: 1, productName: 'Banana (1 dozen)', qty: 2, price: 40 },
];

export const checkouts = [
  { id: 1, orderId: 'ORD-1001', userId: 1, paymentMethod: 'UPI', paymentStatus: 'completed', amount: 660, date: '2026-03-20' },
  { id: 2, orderId: 'ORD-1002', userId: 2, paymentMethod: 'COD', paymentStatus: 'pending', amount: 195, date: '2026-03-22' },
  { id: 3, orderId: 'ORD-1003', userId: 3, paymentMethod: 'Card', paymentStatus: 'pending', amount: 199, date: '2026-03-24' },
];

export const activityLog = [
  { id: 1, user: 'Sayan Banik', action: 'Placed order ORD-1001', time: '2026-03-20T10:30:00' },
  { id: 2, user: 'Aditi Das', action: 'Placed order ORD-1002', time: '2026-03-22T14:00:00' },
  { id: 3, user: 'Admin', action: 'Updated product stock: Banana', time: '2026-03-23T09:00:00' },
  { id: 4, user: 'Admin', action: 'Shipped order ORD-1002', time: '2026-03-23T11:00:00' },
  { id: 5, user: 'Rahul Sen', action: 'Reviewed Surf Excel (1kg)', time: '2026-03-19T16:00:00' },
  { id: 6, user: 'Nina Roy', action: 'Added to wishlist: Milk', time: '2026-03-23T08:30:00' },
  { id: 7, user: 'Admin', action: 'Cancelled order ORD-1005', time: '2026-03-19T10:00:00' },
  { id: 8, user: 'Priya Mondal', action: 'Placed order ORD-1007', time: '2026-03-12T07:00:00' },
];

/* Revenue data for charts */
export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [12400, 18900, 24500, 19800, 28700, 31200],
};

export const orderTrend = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [12, 19, 8, 15, 22, 30, 18],
};

export const policiesContent = {
  privacy: `<h3 class="text-lg font-semibold mb-3">Privacy Policy</h3><p class="text-gray-600 text-sm leading-relaxed mb-3">Mandal Variety is committed to protecting user privacy. We collect only information necessary to process orders and improve your experience.</p><ul class="list-disc list-inside text-gray-600 text-sm space-y-1"><li>Personal information is encrypted and stored securely</li><li>We never share data with third parties without consent</li><li>Users can request data deletion at any time</li><li>Cookies are used only for session management</li></ul>`,
  terms: `<h3 class="text-lg font-semibold mb-3">Terms & Conditions</h3><p class="text-gray-600 text-sm leading-relaxed mb-3">By using Mandal Variety, you agree to the following terms:</p><ul class="list-disc list-inside text-gray-600 text-sm space-y-1"><li>Users must be 18+ to purchase restricted items</li><li>All prices include applicable taxes</li><li>Delivery times are estimates and may vary</li><li>Mandal Variety reserves the right to refuse service</li></ul>`,
  cancellation: `<h3 class="text-lg font-semibold mb-3">Cancellation & Refund Policy</h3><p class="text-gray-600 text-sm leading-relaxed mb-3">We want you to be satisfied with your purchases:</p><ul class="list-disc list-inside text-gray-600 text-sm space-y-1"><li>Orders can be cancelled within 1 hour of placement</li><li>Refunds are processed within 5-7 business days</li><li>Perishable items cannot be returned once delivered</li><li>Damaged items can be replaced within 24 hours</li></ul>`,
  ageRestriction: `<h3 class="text-lg font-semibold mb-3">Age Restriction Policy</h3><p class="text-gray-600 text-sm leading-relaxed mb-3">Certain products require age verification:</p><ul class="list-disc list-inside text-gray-600 text-sm space-y-1"><li>Tobacco products require 18+ age verification</li><li>Age is verified through government-issued ID</li><li>Delivery agents may request ID at delivery</li><li>Non-compliance may result in account suspension</li></ul>`,
};

export const settingsData = {
  general: { storeName: 'Mandal Variety', storeEmail: 'contact@mandalvariety.com', phone: '+91 99999 99999', currency: 'INR', timezone: 'Asia/Kolkata', language: 'English' },
  payment: { upiEnabled: true, codEnabled: true, cardEnabled: true, upiId: 'mandalvariety@upi', minOrderCOD: 100 },
  notifications: { orderEmail: true, orderSMS: false, lowStockAlert: true, lowStockThreshold: 5, reviewAlert: true },
  delivery: { freeDeliveryMin: 500, deliveryCharge: 30, estimatedDays: '1-3 days', deliveryRadius: '15 km' },
};
