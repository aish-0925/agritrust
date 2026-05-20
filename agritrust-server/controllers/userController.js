const User = require("../models/User");
const axios = require("axios");

/* ================= GET PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safe location log
    // if (user.location) {
    //   console.log("LAT:", user.location.lat);
    //   console.log("LNG:", user.location.lng);
    // }

    res.json(user);

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    /* ================= COMMON ================= */
    const commonFields = [
      "name",
      "phone",
      "city",
      "address",
      "state",
      "pincode"
    ];

    commonFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updates[field] = req.body[field];
      }
    });

    /* ================= LOCATION ================= */
 /* ================= AUTO LOCATION ================= */

if (
  req.body.city &&
  req.body.state
) {

  try {

    const geoRes = await axios.get(
      "https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: `${req.body.city},${req.body.state},India`,
          limit: 1,
          appid: process.env.WEATHER_API_KEY
        }
      }
    );

    console.log("GEO RESPONSE:", geoRes.data);

    if (geoRes.data.length > 0) {

      updates.location = {
        lat: geoRes.data[0].lat,
        lng: geoRes.data[0].lon
      };

      console.log("UPDATES OBJECT:", updates);

    }

  } catch (err) {

    console.error("Geocoding failed:", err.message);

  }

}

    /* ================= FARMER ================= */
    if (user.role === "farmer") {
      const farmerFields = [
        "farmName",
        "farmLocation",
        "farmSize",
        "cropTypes",
        "organicCertified",
        "farmingExperience"
      ];

      farmerFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      /* ===== PAYMENT DETAILS ===== */
if (
  req.body.upiId ||
  req.body.accountNumber ||
  req.body.ifsc ||
  req.body.accountName
) {
  updates.farmerPayment = {
    upiId: req.body.upiId || "",
    name: req.body.accountName || "",
    bankAccount: {
      accountNumber: req.body.accountNumber || "",
      ifsc: req.body.ifsc || ""
    }
  };
}
    }

    /* ================= RESTAURANT ================= */
    if (user.role === "restaurant") {
      const restaurantFields = [
        "restaurantName",
        "businessAddress",
        "pricePreference",
        "deliveryType"
      ];

      restaurantFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      /* ===== SAFE ARRAY PARSING ===== */
      try {
        if (user.role === "restaurant") {
        if (req.body.cuisineTypes) {
          updates.cuisineTypes = req.body.cuisineTypes.startsWith("[")
            ? JSON.parse(req.body.cuisineTypes)
            : req.body.cuisineTypes.split(",").map(i => i.trim());
        }

        if (req.body.preferredIngredients) {
          updates.preferredIngredients = req.body.preferredIngredients.startsWith("[")
            ? JSON.parse(req.body.preferredIngredients)
            : req.body.preferredIngredients.split(",").map(i => i.trim());
        }

      }

        if (
          req.body.dailyDemand &&
          req.body.dailyDemand !== "" &&
          req.body.dailyDemand !== "undefined"
        ) {
          updates.dailyDemand = JSON.parse(req.body.dailyDemand);
        }

      } catch (err) {
        console.error("JSON PARSE ERROR:", err);
        return res.status(400).json({ message: "Invalid JSON format" });
      }
    }

    /* ================= IMAGE ================= */
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    /* ================= EMPTY CHECK ================= */
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    /* ================= PROFILE COMPLETION ================= */
    const merged = (field) => updates[field] ?? user[field];

    let profileCompleted = false;

    if (user.role === "farmer") {
      profileCompleted = !!(
        merged("farmName") &&
        merged("phone") &&
        merged("city")
      );
    }

    if (user.role === "restaurant") {
      profileCompleted = !!(
        merged("restaurantName") &&
        merged("phone") &&
        merged("city")
      );
    }

    updates.profileCompleted = profileCompleted;

    /* ================= DEBUG ================= */
    // console.log("BODY:", req.body);
    // console.log("UPDATES:", updates);
console.log("FINAL UPDATE DATA:", updates);
    /* ================= UPDATE ================= */
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
       updates,
      {
        returnDocument: "after",
        runValidators: false
      }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};