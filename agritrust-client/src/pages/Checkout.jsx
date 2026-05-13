import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import api from "../services/api";

export default function Checkout() {

  const navigate = useNavigate();

  const location = useLocation();

  const {
    items = [],
    pricing = {}
  } = location.state || {};


  /* =====================================================
     FORM STATE
  ===================================================== */

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({

    billingDetails: {

      name: "",

      phone: "",

      email: "",

      address: "",

      city: "",

      state: "",

      pincode: ""
    },

    address: {

      name: "",

      phone: "",

      address: "",

      city: "",

      state: "",

      pincode: ""
    },

    paymentMethod: "cod",

    termsAccepted: false
  });


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (
    section,
    field,
    value
  ) => {

    setFormData(prev => ({

      ...prev,

      [section]: {

        ...prev[section],

        [field]: value
      }
    }));
  };


  /* =====================================================
     SAME AS BILLING
  ===================================================== */

  const copyBillingAddress = () => {

    setFormData(prev => ({

      ...prev,

      address: {
        ...prev.billingDetails
      }
    }));
  };


  /* =====================================================
     PLACE ORDER
  ===================================================== */

const placeOrder = async () => {

  if (loading) return;

  try {

    setLoading(true);

    /* =========================================
       AUTO DELIVERY ADDRESS
    ========================================= */

    const finalAddress =
      formData.address.address
        ? formData.address
        : formData.billingDetails;


    /* =========================================
       VALIDATION
    ========================================= */

    if (
      !formData.billingDetails.name ||
      !formData.billingDetails.phone ||
      !formData.billingDetails.address ||
      !formData.billingDetails.city ||
      !formData.billingDetails.state ||
      !formData.billingDetails.pincode
    ) {
      alert("Please fill billing details");
      return;
    }

    if (!formData.termsAccepted) {
      alert("Please accept terms");
      return;
    }


    /* =========================================
       PAYLOAD
    ========================================= */

    const payload = {

      items: items.map(item => ({

  product:
    item.product?._id ||
    item.product ||
    item._id,

  quantity: item.quantity

})),

      paymentMethod:
        formData.paymentMethod,

      billingDetails:
        formData.billingDetails,

      address:
        finalAddress,

      termsAccepted:
        formData.termsAccepted
    };


    console.log("ORDER PAYLOAD");
    console.log(payload);


    /* =========================================
       API CALL
    ========================================= */

    const res = await api.post(
      "/orders",
      payload
    );

    console.log(res.data);

    alert("Order placed successfully");

    navigate("/restaurant/orders");

  } catch (err) {

    console.error(err);

    console.log(
      err.response?.data
    );

    alert(
      err?.response?.data?.message ||
      "Order failed"
    );

  } finally {

    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white p-6 text-green-700">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>


      {/* =====================================================
          BILLING DETAILS
      ===================================================== */}

      <div className="border rounded-lg p-5 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Billing Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded"
            value={formData.billingDetails.name}
            onChange={(e) =>
              handleChange(
                "billingDetails",
                "name",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Phone"
            className="border p-3 rounded"
            value={formData.billingDetails.phone}
            onChange={(e) =>
              handleChange(
                "billingDetails",
                "phone",
                e.target.value
              )
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded"
            value={formData.billingDetails.email}
            onChange={(e) =>
              handleChange(
                "billingDetails",
                "email",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="City"
            className="border p-3 rounded"
            value={formData.billingDetails.city}
            onChange={(e) =>
              handleChange(
                "billingDetails",
                "city",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="State"
            className="border p-3 rounded"
            value={formData.billingDetails.state}
            onChange={(e) =>
              handleChange(
                "billingDetails",
                "state",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Pincode"
            className="border p-3 rounded"
            value={formData.billingDetails.pincode}
            onChange={(e) =>
              handleChange(
                "billingDetails",
                "pincode",
                e.target.value
              )
            }
          />

        </div>

        <textarea
          placeholder="Full Address"
          className="border p-3 rounded w-full mt-4"
          rows={3}
          value={formData.billingDetails.address}
          onChange={(e) =>
            handleChange(
              "billingDetails",
              "address",
              e.target.value
            )
          }
        />

      </div>


      {/* =====================================================
          DELIVERY ADDRESS
      ===================================================== */}

      <div className="border rounded-lg p-5 mb-6">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            Delivery Address
          </h2>

          <button
            onClick={copyBillingAddress}
            className="text-sm bg-green-100 px-3 py-1 rounded"
          >
            Same as Billing
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Receiver Name"
            className="border p-3 rounded"
            value={formData.address.name}
            onChange={(e) =>
              handleChange(
                "address",
                "name",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Phone"
            className="border p-3 rounded"
            value={formData.address.phone}
            onChange={(e) =>
              handleChange(
                "address",
                "phone",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="City"
            className="border p-3 rounded"
            value={formData.address.city}
            onChange={(e) =>
              handleChange(
                "address",
                "city",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="State"
            className="border p-3 rounded"
            value={formData.address.state}
            onChange={(e) =>
              handleChange(
                "address",
                "state",
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Pincode"
            className="border p-3 rounded"
            value={formData.address.pincode}
            onChange={(e) =>
              handleChange(
                "address",
                "pincode",
                e.target.value
              )
            }
          />

        </div>

        <textarea
          placeholder="Delivery Address"
          className="border p-3 rounded w-full mt-4"
          rows={3}
          value={formData.address.address}
          onChange={(e) =>
            handleChange(
              "address",
              "address",
              e.target.value
            )
          }
        />

      </div>


      {/* =====================================================
          ORDER SUMMARY
      ===================================================== */}

      <div className="border rounded-lg p-5 mb-6 bg-green-50">

        <h2 className="text-xl font-semibold mb-4">
          Order Summary
        </h2>

        <div className="space-y-2">

          <div className="flex justify-between">
            <span>Items Total</span>
            <span>₹{pricing.itemsTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>
              ₹{pricing.deliveryCharge}
            </span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹{pricing.gstAmount}</span>
          </div>

          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹{pricing.platformFee}</span>
          </div>

          <div className="border-t pt-3 flex justify-between text-xl font-bold">

            <span>Grand Total</span>

            <span>
              ₹{pricing.grandTotal}
            </span>

          </div>
        </div>
      </div>


      {/* =====================================================
          PAYMENT METHOD
      ===================================================== */}

      <div className="border rounded-lg p-5 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Payment Method
        </h2>

        <label className="flex items-center gap-2">

          <input
            type="radio"
            checked={
              formData.paymentMethod === "cod"
            }
            onChange={() =>
              setFormData(prev => ({
                ...prev,
                paymentMethod: "cod"
              }))
            }
          />

          Cash on Delivery

        </label>

      </div>


      {/* =====================================================
          TERMS
      ===================================================== */}

      <div className="mb-6">

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                termsAccepted:
                  e.target.checked
              }))
            }
          />

          I agree to terms and conditions

        </label>

      </div>


      {/* =====================================================
          PLACE ORDER BUTTON
      ===================================================== */}

      <button
        onClick={placeOrder}
        disabled={loading}
        className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-500 transition disabled:opacity-50"
      >
        {loading
          ? "Placing Order..."
          : "Place Order"}
      </button>
    </div>
  );
}