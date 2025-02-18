import Car from "../Models/car.js";

// Create a new car
export const createCar = async (req, res) => {
    try {
        console.log("Received data:", req.body);
        const existingCar = await Car.findOne({ name: req.body.name });
        if (existingCar) {
            return res.status(400).json({ message: "Car name must be unique" });
        }
        const car = new Car(req.body);
        await car.save();
        res.status(201).json({ message: "Car created successfully", car });
    } catch (error) {
        console.error("Error creating car: ", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Get all cars with shuffled data
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({});
        // Shuffle the data
        const shuffledCars = cars.sort(() => Math.random() - 0.5);
        res.status(200).json(shuffledCars);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Get a single car by name
export const getCarByName = async (req, res) => {
    try {
        const { name } = req.params;
        const car = await Car.findOne({ name }); 
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a car by name
export const updateCar = async (req, res) => {
    try {
        const { name } = req.params; 
        const updatedCar = await Car.findOneAndUpdate(
            { name },               
            req.body,               
            { new: true, runValidators: true } 
        );
        if (!updatedCar) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json({ message: "Car updated successfully", updatedCar });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a car by name
export const deleteCar = async (req, res) => {
    const { name } = req.params; 
    if (!name) {
        return res.status(400).json({ message: "Car name is required" });
    }

    try {
        const deletedCar = await Car.findOneAndDelete({ name });
        if (!deletedCar) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const filterCarsByPrice = async (req, res) => {
    try {
        // Use req.query instead of req.params to get query parameters
        const { minPrice, maxPrice } = req.query;

        console.log("Filtering cars by price range:", minPrice, maxPrice);

        // Find cars within the price range
        const cars = await Car.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        // Log the result
        console.log("Found cars:", cars);

        if (cars.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No cars found within the specified price range.",
            });
        }

        res.status(200).json({
            success: true,
            message: `Found ${cars.length} car(s) within the specified price range.`,
            data: cars,
        });

    } catch (error) {
        console.error("Error filtering cars by price:", error.message);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
        });
    }
};


export const checkPriceFieldExists = async (req, res) => {
    try {
        // Check if 'price' field exists in the Car schema
        const car = await Car.findOne({ price: { $exists: true } }).limit(1);
        
        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Price field does not exist in any car."
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Price field exists in at least one car."
        });
    } catch (error) {
        console.error("Error checking price field existence:", error.message);
        res.status(500).json({
            success: false,
            message: "An error occurred while checking the price field."
        });
    }
};


// Filter cars by variant
export const filterCarsByVariant = async (req, res) => {
    try {
        const { variant } = req.query;

        // Check if variant is provided
        if (!variant) {
            return res.status(400).json({ message: "Variant must be provided." });
        }

        // Case-insensitive search for variant
        const cars = await Car.find({
            variant: { $regex: variant, $options: "i" }
        });

        // Check if no cars found
        if (cars.length === 0) {
            return res.status(404).json({ message: `No cars found with variant: ${variant}` });
        }

        // Return the filtered cars
        return res.status(200).json(cars);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const filterCarsByColor = async (req, res) => {
    try {
        const { color } = req.query;

        // Check if color is provided
        if (!color) {
            return res.status(400).json({ message: "Color must be provided." });
        }

        // Search for cars with the specified color
        const cars = await Car.find({
            colors: { $in: [color] } // Check if the color is in the colors array
        });

        // Check if no cars found
        if (cars.length === 0) {
            return res.status(404).json({ message: `No cars found with color: ${color}` });
        }

        // Return the filtered cars
        return res.status(200).json(cars);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const filterCarsCombined = async (req, res) => {
    try {
        const { minPrice, maxPrice, variant, color } = req.query;
        let filter = {}; // Initialize filter object

        console.log("Filter Parameters:", { minPrice, maxPrice, variant, color });

        // Apply price filter if both minPrice and maxPrice are provided
        if (minPrice && maxPrice) {
            const parsedMinPrice = parseFloat(minPrice);
            const parsedMaxPrice = parseFloat(maxPrice);

            if (isNaN(parsedMinPrice) || isNaN(parsedMaxPrice)) {
                return res.status(400).json({ message: "Both 'minPrice' and 'maxPrice' must be valid numbers." });
            }

            filter.price = { $gte: parsedMinPrice, $lte: parsedMaxPrice };
        }

        // Apply variant filter if provided
        if (variant) {
            filter.variant = { $regex: variant, $options: "i" };
        }

        // Apply color filter if provided
        if (color) {
            filter.colors = { $in: [color] };
        }

        console.log("MongoDB Filter Object:", filter);

        // Execute query with the combined filter
        const cars = await Car.find(filter);

        // Check if no cars were found
        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found matching the filter criteria." });
        }

        // Return the filtered cars
        return res.status(200).json(cars);

    } catch (error) {
        console.error("Error during filtering:", error);
        res.status(400).json({ message: error.message });
    }
};

export const LocationgetCars = async (req, res) => {
    try {
        const books = await Book.find().populate("locations"); // Populates the locations field
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
};
