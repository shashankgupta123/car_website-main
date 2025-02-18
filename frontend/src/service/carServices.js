import axios from "axios";

// Get all Cars
export const getCars = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/cars`);
        
        return response.data;
    } catch (error) {
        console.error("Error fetching cars:", error);
        return []; 
    }
};

// Function to add a car
export const addCar = async (carData) => {
    console.log("Form Data:", carData);

    try {
        const response = await axios.post('http://localhost:5000/api/cars/add', carData);
        return response.data; 
    } catch (error) {
        console.error("Error occurred while adding car:", error.response?.data || error);
        if (error.response && error.response.status === 400 && error.response.data) {
            throw {
                message: "Validation failed",
                field: error.response.data.field, 
                messageDetail: error.response.data.message, 
            };
        }
        throw { message: "An error occurred, please try again later" };
    }
};

// Update a Car by name
export const updateCar = async (carName, carData) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/cars/${carName}`, carData); 
        return response.data;
    } catch (error) {
        console.error("Error updating car:", error);
        throw error.response?.data || { message: "An error occurred while updating the car" };
    }
};

//delete Car by name
export const deleteCar = async (name) => {
    if (!name) {
        console.error("No name provided for deleting car");
        return { success: false };
    }

    try {
        const response = await axios.delete(`http://localhost:5000/api/cars/${name}`);
        return { success: response.status === 200 }; 
    } catch (error) {
        console.error("Error deleting car:", error);
        return { success: false, error: error.message }; 
    }
};

// Update a Car by name
export const getCarByName = async (carName, carData) => {
    console.log("CarNam",carName);
    
    try {
        const response = await axios.get(`http://localhost:5000/api/cars/${carName}`)
        // , {
        //     methods:'GET',
        //     headers:{
        //         'Content-Type': 'application/json'
        //     }
        // }); 
        return response.data;
    } catch (error) {
        console.error("Error Getting car:", error);
        throw error.response?.data || { message: "An error occurred while Getting the car" };
    }
};

