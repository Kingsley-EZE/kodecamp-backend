
let products = [];
const stockStatuses = ["in-stock", "low-stock", "out-of-stock"];

const getAllProducts = (req, res) => {
    res.status(200).json(products);
}

const getSingleProduct = (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
}

const createNewProduct = (req, res) => {
    const { productName, cost, stockStatus } = req.body;
    if (!productName || !cost || !stockStatus) {
        return res.status(400).json({ message: "Product name, cost, and stock status are required." });
    }
    if (typeof cost !== 'number') {
        return res.status(400).json({ message: "Cost must be a valid number." });
    }
    if (!stockStatuses.includes(stockStatus)) {
        return res.status(400).json({ message: `Invalid stock status. Valid statuses are: ${stockStatuses.join(", ")}` });
    }
    const newProduct = {
        id: products.length + 1,
        productName,
        cost,
        stockStatus,
        createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
}

const updateProduct = (req, res) => {
    const productId = parseInt(req.params.id);
    const { productName, cost } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (productName) {
        product.productName = productName;
    }
    if (cost && typeof cost === 'number') {
        product.cost = cost;
    }
    res.status(200).json(product);
}

const updateProductStockStatus = (req, res) => {
    const productId = parseInt(req.params.id);
    const stockStatus = req.params.status;
    if (!stockStatuses.includes(stockStatus)) {
        return res.status(400).json({ message: `Invalid stock status. Valid statuses are: ${stockStatuses.join(", ")}` });
    }
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    product.stockStatus = stockStatus;
    res.status(200).json(product);
}

const deleteProduct = (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }
    products.splice(productIndex, 1);
    res.status(200).json({ message: "Product deleted successfully" });
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createNewProduct,
    updateProduct,
    updateProductStockStatus,
    deleteProduct
}