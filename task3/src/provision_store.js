
class ProvisionStore {
    #shopName
    #location
    #stockStatuses = ["in-stock", "low-stock", "out-of-stock"];
    #products = [];

    constructor(shopName, location) {
        this.#shopName = shopName;
        this.#location = location;
        this.#products.push({
            id: 1,
            productName: "Laptop",
            cost: 50000,
            stockStatus: this.#stockStatuses[Math.floor(Math.random() * this.#stockStatuses.length)],
            createdAt: new Date().toISOString(),
        });
    }

    getAllProducts() {
        return this.#products;
    }

    getProductById(productId) {
        return this.#products.find(product => product.id === productId) || "Product not found";
    }

    addNewProduct(productName, cost, status) {
        if (!productName || !cost || !status) {
            return "Product name, cost, and status are required.";
        }
        if(typeof cost !== 'number') {
            return "Cost must be a valid amount.";
        }
        if(!this.#stockStatuses.includes(status)) {
            return "Invalid stock status. Valid statuses are: " + this.#stockStatuses.join(", ");
        }
        const newProduct = {
            id: this.#products.length + 1,
            productName: productName,
            cost: cost,
            stockStatus: status,
            createdAt: new Date().toISOString(),
        };
        this.#products.push(newProduct);
        return this.#products;
    }

    updateProduct(productId, productName, cost){
        if(!productId || !productName || !cost) {
            return "Product ID, name, and cost are required.";
        }
        const product = this.getProductById(productId);
        if (typeof product === "string") {
            return "No product found with ID " + productId;
        }
        if (productName) {
            product.productName = productName;
        }
        if (cost && typeof cost === 'number') {
            product.cost = cost;
        }
        return product;
    }

    updateProductStockStatus(productId, status) {
        if (!productId || !status) {
            return "Product ID and status are required.";
        }
        if (!this.#stockStatuses.includes(status)) {
            return "Invalid stock status. Valid statuses are: " + this.#stockStatuses.join(", ");
        }
        const product = this.getProductById(productId);
        if (typeof product === "string") {
            return "No product found with ID " + productId;
        }
        product.stockStatus = status;
        return product;
    }

    deleteProduct(productId) {
        const productIndex = this.#products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            return "No product found with ID " + productId;
        }
        this.#products.splice(productIndex, 1);
        console.log("Product with ID " + productId + " has been deleted.");
        return this.#products;
    }

}

const store = new ProvisionStore("Kingsley's Store", "Lagos");
console.log("==============ALL-PRODUCTS======================");
console.log(store.getAllProducts());
console.log("===============SINGLE-PRODUCT=====================");
console.log(store.getProductById(1));
console.log("===============NEWLY-ADDED-PRODUCT=====================");
console.log(store.addNewProduct("Mouse", 1500, "in-stock"));
console.log("================UPDATED-PRODUCT====================");
console.log(store.updateProduct(1, "Macbook", 60000));
console.log("================UPDATED-PRODUCT-STOCK====================");
console.log(store.updateProductStockStatus(1, "low-stock"));
console.log("================DELETED-PRODUCT====================");
console.log(store.deleteProduct(1));
