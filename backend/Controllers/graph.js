import Purchase from '../Models/purchase.js';

export const getWeeklyIncome = async (req, res) => {
  try {
    const data = await Purchase.aggregate([
      {
        $project: {
          month: { $month: "$pickupDate" },  // Extract the month
          dayOfMonth: { $dayOfMonth: "$pickupDate" },  // Extract the day of the month
          price: 1,
        },
      },
      {
        $addFields: {
          weekOfMonth: { $ceil: { $divide: ["$dayOfMonth", 7] } },  // Calculate week of the month
        },
      },
      {
        $group: {
          _id: { month: "$month", week: "$weekOfMonth" },  // Group by month and week of the month
          purchases: { $push: { price: "$price", pickupDate: "$pickupDate" } },  // Keep individual purchase records
        },
      },
      {
        $sort: { "_id.month": 1, "_id.week": 1 },  // Sort by month and week
      },
    ]);

    res.json(data);  // Return the purchase records by week and month
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Controller to get total income
export const getTotalIncome = async (req, res) => {
    try {
        const data = await Purchase.aggregate([
          {
            $project: {
              carName: 1,  // Include carName field
              price: 1,    // Include price field
            },
          },
          {
            $group: {
              _id: { carName: "$carName" },  // Group by carName only
              totalPurchases: { $push: { price: "$price" } },  // Collect all prices for the same car
              count: { $sum: 1 },  // Count the number of times this car is purchased
            },
          },
          {
            $sort: { "_id.carName": 1 },  // Sort by carName
          },
        ]);
    
        res.json(data);  // Return the grouped data
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  };
  
export const getCarsLentByWeek = async (req, res) => {
    try {
      const data = await Purchase.aggregate([
        {
          // Add fields for month and week of the month based on pickupDate
          $project: {
            month: { $month: "$pickupDate" },  // Extract the month
            dayOfMonth: { $dayOfMonth: "$pickupDate" },  // Extract the day of the month
            carName: 1,  // Include carName for grouping
          },
        },
        {
          // Add a weekOfMonth field based on the day of the month
          $addFields: {
            weekOfMonth: { $ceil: { $divide: ["$dayOfMonth", 7] } },  // Calculate the week of the month
          },
        },
        {
          // Group by month and weekOfMonth, and count the number of cars lent
          $group: {
            _id: { month: "$month", week: "$weekOfMonth", carName: "$carName" },  // Group by month, week, and carName
            carCount: { $sum: 1 },  // Sum the number of cars lent during that week
          },
        },
        {
          // Now, group again by month and week to combine data for the same week
          $group: {
            _id: { month: "$_id.month", week: "$_id.week" },  // Group by month and week
            cars: {
              $push: { carName: "$_id.carName", carCount: "$carCount" },  // Push carName and its count into an array
            },
            totalCarCount: { $sum: "$carCount" },  // Calculate total car count for this week
          },
        },
        {
          // Sort by month and week to ensure chronological order
          $sort: { "_id.month": 1, "_id.week": 1 },
        },
      ]);
  
      // Check if data is found and return it
      if (data.length === 0) {
        return res.status(404).json({ message: 'No car rentals found for the specified period.' });
      }
  
      res.json(data);  // Return the grouped data
    } catch (err) {
      res.status(500).json({ error: err.message });  // Handle any errors
    }
  };
   


  export const getCarsByStatus = async (req, res) => {
      try {
          const today = new Date(); // Get today's date
  
          const data = await Purchase.aggregate([
              {
                  $project: {
                      month: { $month: "$pickupDate" },
                      dayOfMonth: { $dayOfMonth: "$pickupDate" },
                      carName: 1,
                      pickupDate: 1,
                      dropoffDate: 1,
                  },
              },
              {
                  $addFields: {
                      weekOfMonth: { $ceil: { $divide: ["$dayOfMonth", 7] } }, 
                      status: {
                          $cond: { 
                              if: { $gte: ["$dropoffDate", today] }, 
                              then: "current", 
                              else: "past" 
                          }
                      }
                  }
              },
              {
                  $group: {
                      _id: { month: "$month", week: "$weekOfMonth", carName: "$carName", status: "$status" },
                      carCount: { $sum: 1 }
                  }
              },
              {
                  $group: {
                      _id: { month: "$_id.month", week: "$_id.week" },
                      currentRentals: {
                          $push: {
                              $cond: [{ $eq: ["$_id.status", "current"] }, { carName: "$_id.carName", carCount: "$carCount" }, "$$REMOVE"]
                          }
                      },
                      pastRentals: {
                          $push: {
                              $cond: [{ $eq: ["$_id.status", "past"] }, { carName: "$_id.carName", carCount: "$carCount" }, "$$REMOVE"]
                          }
                      }
                  }
              },
              {
                  $sort: { "_id.month": 1, "_id.week": 1 }
              }
          ]);
  
          res.json(data);
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  };
  
  