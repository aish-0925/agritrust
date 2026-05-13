import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import ProfileAvatar from "../components/ProfileAvatar";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    api.get("/users/profile")
      .then(res => {
        const data = res.data;

        // flatten payment data
        if (data.farmerPayment) {
          data.upiId = data.farmerPayment.upiId || "";
          data.accountName = data.farmerPayment.name || "";
          data.accountNumber = data.farmerPayment.bankAccount?.accountNumber || "";
          data.ifsc = data.farmerPayment.bankAccount?.ifsc || "";
        }

        setProfile(data);

        setPreview(
          data.profileImage
            ? `http://localhost:5000${data.profileImage}`
            : ""
        );
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= INPUT ================= */
  const change = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    setProfile(prev => ({
      ...prev,
      profileImage: file
    }));
  };

  /* ================= LOCATION ================= */
  const getLocation = () => {
    setLocationStatus("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile(prev => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }));
        setLocationStatus("Location added");
      },
      () => setLocationStatus("Permission denied")
    );
  };

  const normalizeToArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(",").map(i => i.trim()).filter(Boolean);
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      const fields = [
        "name",
        "phone",
        "city",
        "state",
        "pincode",
        "address",
        "farmName",
        "farmLocation",
        "restaurantName",
        "businessAddress",

        //PAYMENT
        "upiId",
        "accountName",
        "accountNumber",
        "ifsc"
      ];

      fields.forEach((f) => {
        if (profile[f]) formData.append(f, profile[f]);
      });

      if (profile.lat && profile.lng) {
        formData.append("lat", profile.lat);
        formData.append("lng", profile.lng);
      }

      if (profile.cuisineTypes) {
        formData.append(
          "cuisineTypes",
          JSON.stringify(normalizeToArray(profile.cuisineTypes))
        );
      }

      if (profile.preferredIngredients) {
        formData.append(
          "preferredIngredients",
          JSON.stringify(normalizeToArray(profile.preferredIngredients))
        );
      }

      if (profile.profileImage instanceof File) {
        formData.append("profileImage", profile.profileImage);
      }

      await api.put("/users/profile", formData);

      setSuccess("Profile updated successfully");

    } catch {
      setError("Update failed");
    }

    setSaving(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <motion.div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow flex gap-6 items-center">
        <div className="relative">
          <ProfileAvatar user={profile} preview={preview} />
          <input type="file" className="hidden" onChange={handleImage} />
        </div>

        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500 capitalize">{profile.role}</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* PERSONAL */}
        <h3 className="font-semibold">Personal Info</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" value={profile.name || ""} onChange={change} placeholder="Name" className="input" />
          <input value={profile.email || ""} disabled className="input bg-gray-100" />
          <input name="phone" value={profile.phone || ""} onChange={change} placeholder="Phone" className="input" />
          <input name="city" value={profile.city || ""} onChange={change} placeholder="City" className="input" />
          <input name="state" value={profile.state || ""} onChange={change} placeholder="State" className="input" />
          <input name="pincode" value={profile.pincode || ""} onChange={change} placeholder="Pincode" className="input" />
          <input name="address" value={profile.address || ""} onChange={change} placeholder="Address" className="input" />
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-4">
          <button type="button" onClick={getLocation} className="text-green-600 text-sm">
            📍 Use Current Location
          </button>
          <span className="text-xs text-gray-500">{locationStatus}</span>
        </div>

        {/* FARMER */}
        {profile.role === "farmer" && (
          <>
            <h3 className="font-semibold">Farm Details 🌾</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="farmName" value={profile.farmName || ""} onChange={change} className="input" />
              <input name="farmLocation" value={profile.farmLocation || ""} onChange={change} className="input" />
            </div>

            {/*PAYMENT */}
            <h3 className="font-semibold">Payment Details 💳</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="upiId" value={profile.upiId || ""} onChange={change} placeholder="UPI ID" className="input" />
              <input name="accountName" value={profile.accountName || ""} onChange={change} placeholder="Account Name" className="input" />
              <input name="accountNumber" value={profile.accountNumber || ""} onChange={change} placeholder="Account Number" className="input" />
              <input name="ifsc" value={profile.ifsc || ""} onChange={change} placeholder="IFSC Code" className="input" />
            </div>
          </>
        )}

        {/* RESTAURANT */}
        {profile.role === "restaurant" && (
          <>
            <h3 className="font-semibold">Restaurant Details 🍽</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="restaurantName" value={profile.restaurantName || ""} onChange={change} className="input" />
              <input name="businessAddress" value={profile.businessAddress || ""} onChange={change} className="input" />
              <input name="cuisineTypes" value={Array.isArray(profile.cuisineTypes)? profile.cuisineTypes.join(", "): profile.cuisineTypes || ""} onChange={change} className="input" />
              <input name="preferredIngredients" value={Array.isArray(profile.preferredIngredients)? profile.preferredIngredients.join(", "): profile.preferredIngredients || ""} onChange={change} className="input" />
            </div>
          </>
        )}

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <button className="btn-primary w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </motion.div>
  );
}