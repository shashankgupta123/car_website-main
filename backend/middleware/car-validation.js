export const validateCar = (req, res, next) => {
    const { name, variant, model_no, year, date, mileage, colors } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: "Car name is required and cannot be empty" });
    }

    if (!variant || variant.trim() === '') {
        return res.status(400).json({ message: "Variant is required and cannot be empty" });
    }

    if (!model_no || model_no.trim() === '') {
        return res.status(400).json({ message: "Model number is required and cannot be empty" });
    }

    if (!year || isNaN(Number(year)) || Number(year) < 1900 || Number(year) > new Date().getFullYear()) {
        return res.status(400).json({ message: "Year is required and must be between 1900 and the current year" });
    }    

    if (!date || date.trim() === '') {
        return res.status(400).json({ message: "Date is required and cannot be empty" });
    }

    if (mileage && (typeof mileage !== 'string' || mileage.trim() === '')) {
        return res.status(400).json({ message: "Mileage must be a non-empty string if provided" });
    }

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
        return res.status(400).json({ message: "At least one color must be provided" });
    }

    for (const color of colors) {
        if (!color.color || color.color.trim() === '') {
            return res.status(400).json({ message: "Each color must have a name" });
        }
        if (!color.price || typeof color.price !== 'number' || color.price <= 0) {
            return res.status(400).json({ field: 'color price', message: "Each color must have a valid price" });
        }
        if (!Array.isArray(color.images) || color.images.length === 0) {
            return res.status(400).json({ message: "Each color must have at least one image" });
        }
    }
    next();
};
