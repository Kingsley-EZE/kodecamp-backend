const brandModel = require(`../schema/brand_model`);

async function addNewBrand(req, res) {
    try {
        const {brandName} = req.body;
        const role = req.decoded.role;

        if (role !== "admin") {
            return res.status(403).json({ message: "Only admins can add brands" });
        }
        if(!brandName){
            return res.status(400).json({ message: "Brand name is required" });
        }

        const newBrand = await brandModel.create({brandName});
        res.status(201).json({ message: "Brand added successfully", data: newBrand });
    } catch (error) {
        console.error("Error adding brand:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateBrand(req, res) {
    try {
        const brandId = req.params.id;
        const brandName = req.body.brandName;
        const role = req.decoded.role;

        if (role !== "admin") {
            return res.status(403).json({ message: "Only admins can update brands" });
        }
        if(!brandId){
            return res.status(400).json({ message: "Brand ID is required" });
        }
        if(!brandName){
            return res.status(400).json({ message: "Brand name is required" });
        }

        const updatedBrand = await brandModel.findByIdAndUpdate(brandId, { brandName }, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json({ message: "Brand updated successfully", data: updatedBrand });
    } catch (error) {
        console.error("Error updating brand:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllBrands(req, res) {
    try {
        const brands = await brandModel.find({});
        res.status(200).json({ data: brands });
    } catch (error) {
        console.error("Error fetching brands:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteBrand(req, res) {
    try {
        const brandId = req.params.id;
        const role = req.decoded.role;

        if (role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete brands" });
        }
        if(!brandId){
            return res.status(400).json({ message: "Brand ID is required" });
        }

        const deletedBrand = await brandModel.findByIdAndDelete(brandId);
        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        console.error("Error deleting brand:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addNewBrand,
    updateBrand,
    getAllBrands,
    deleteBrand
}