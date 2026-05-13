const User = require("../models/User");

/* ================= GET PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safe location log
    if (user.location) {
      console.log("LAT:", user.location.lat);
      console.log("LNG:", user.location.lng);
    }

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
    if (req.body.lat !== undefined && req.body.lng !== undefined) {
      const lat = parseFloat(req.body.lat);
      const lng = parseFloat(req.body.lng);

      if (!isNaN(lat) && !isNaN(lng)) {
        updates.location = { lat, lng };
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
        if (profile.role === "restaurant") {
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

    /* ================= UPDATE ================= */
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
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