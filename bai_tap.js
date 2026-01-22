// --- CÂU 1: Khai báo constructor function Product ---
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// --- CÂU 2: Khởi tạo mảng products ---
// Yêu cầu: Ít nhất 6 sản phẩm, tối thiểu 2 danh mục khác nhau
let products = [
    new Product(1, "Laptop Dell XPS 15", 45000000, 5, "Laptop", true),
    new Product(2, "iPhone 15 Pro Max", 32000000, 0, "Phone", true), // Hết hàng
    new Product(3, "Chuột Logitech MX Master 3", 2500000, 15, "Accessories", true),
    new Product(4, "Bàn phím cơ Keychron", 3500000, 8, "Accessories", true),
    new Product(5, "Tai nghe Sony WH-1000XM5", 8000000, 10, "Accessories", false), // Ngừng bán
    new Product(6, "Samsung Galaxy S24", 28000000, 12, "Phone", true)
];

console.log("--- Danh sách sản phẩm ban đầu ---");
console.log(products);

// --- CÂU 3: Tạo mảng mới chỉ chứa name và price ---
let productNamesAndPrices = products.map(p => {
    return { name: p.name, price: p.price };
});
console.log("\n--- Câu 3: Mảng chỉ chứa tên và giá ---");
console.log(productNamesAndPrices);

// --- CÂU 4: Lọc các sản phẩm còn hàng trong kho (quantity > 0) ---
let inStockProducts = products.filter(p => p.quantity > 0);
console.log("\n--- Câu 4: Sản phẩm còn hàng ---");
console.log(inStockProducts);

// --- CÂU 5: Kiểm tra có ít nhất một sản phẩm giá trên 30.000.000 hay không ---
let hasExpensiveProduct = products.some(p => p.price > 30000000);
console.log("\n--- Câu 5: Có sản phẩm giá trên 30tr không? ---");
console.log(hasExpensiveProduct); // Kết quả: true

// --- CÂU 6: Kiểm tra tất cả sản phẩm thuộc danh mục "Accessories" có đang bán (isAvailable = true) hay không ---
// Bước 1: Lọc ra danh mục Accessories trước
// Bước 2: Kiểm tra tính chất isAvailable trên danh sách đó
let accessories = products.filter(p => p.category === "Accessories");
let allAccessoriesAvailable = accessories.every(p => p.isAvailable === true);
console.log("\n--- Câu 6: Tất cả phụ kiện đều đang bán? ---");
console.log(allAccessoriesAvailable); // Kết quả: false (vì tai nghe Sony đang false)

// --- CÂU 7: Tính tổng giá trị kho hàng (price * quantity) ---
let totalInventoryValue = products.reduce((total, p) => {
    return total + (p.price * p.quantity);
}, 0);
console.log("\n--- Câu 7: Tổng giá trị kho hàng ---");
console.log(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalInventoryValue));

// --- CÂU 8: Dùng for...of duyệt mảng và in ra: Tên - Danh mục - Trạng thái ---
console.log("\n--- Câu 8: Duyệt mảng bằng for...of ---");
for (let p of products) {
    let status = p.isAvailable ? "Đang bán" : "Ngừng bán";
    console.log(`${p.name} - ${p.category} - ${status}`);
}

// --- CÂU 9: Dùng for...in để in ra tên thuộc tính và giá trị tương ứng ---
// Thường dùng for...in để duyệt qua các key của một OBJECT cụ thể. 
// Ở đây mình sẽ duyệt qua sản phẩm đầu tiên trong danh sách làm ví dụ.
console.log("\n--- Câu 9: Duyệt thuộc tính sản phẩm đầu tiên bằng for...in ---");
let firstProduct = products[0];
for (let key in firstProduct) {
    console.log(`${key}: ${firstProduct[key]}`);
}

// --- CÂU 10: Lấy danh sách tên các sản phẩm đang bán (isAvailable = true) VÀ còn hàng (quantity > 0) ---
let sellingAndInStockNames = products
    .filter(p => p.isAvailable === true && p.quantity > 0)
    .map(p => p.name);

console.log("\n--- Câu 10: Tên sản phẩm đang bán và còn hàng ---");
console.log(sellingAndInStockNames);