import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Cart() {

  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const [total, setTotal] = useState(0);


  /* =====================================================
     FETCH CART
  ===================================================== */

  const fetchCart = async () => {

  try {

    const res = await api.get("/cart");

    setItems(res.data.items || []);

    setTotal(res.data.total || 0);

  } catch (err) {

    console.error(err);
  }
};


  /* =====================================================
     UPDATE QUANTITY
  ===================================================== */

  const updateQuantity = async (productId, quantity) => {

    if (quantity < 1) return;

    try {

      await api.put(
        `/cart/${productId}`,
        { quantity }
      );

      fetchCart();

    } catch (err) {

      console.error(err);
    }
  };


  /* =====================================================
     REMOVE ITEM
  ===================================================== */

  const removeItem = async (productId) => {

    try {

      await api.delete(`/cart/${productId}`);

      fetchCart();

    } catch (err) {

      console.error(err);
    }
  };


  /* =====================================================
     LOAD CART
  ===================================================== */

  useEffect(() => {

  const loadCart = async () => {

    await fetchCart();
  };

  loadCart();

}, []);


  /* =====================================================
     BILLING CALCULATIONS
  ===================================================== */

  const itemsTotal = total;

  const deliveryCharge =
    itemsTotal >= 1000 ? 0 : 50;

  const gstAmount =
    Number((itemsTotal * 0.05).toFixed(2));

  const platformFee = 10;

  const grandTotal =
    itemsTotal +
    deliveryCharge +
    gstAmount +
    platformFee;


  /* =====================================================
     CHECKOUT
  ===================================================== */

  const handleCheckout = () => {

    navigate("/restaurant/checkout", {
      state: {
        items,
        pricing: {
          itemsTotal,
          deliveryCharge,
          gstAmount,
          platformFee,
          grandTotal
        }
      }
    });
  };


  return (
    <div className="min-h-screen bg-white text-green-700 p-6">

      <h1 className="text-3xl font-semibold mb-6">
        🛒 Your Cart
      </h1>

      {items.length === 0 ? (

        <p className="text-green-400">
          Cart is empty
        </p>

      ) : (

        <>
          {/* =====================================================
              CART ITEMS
          ===================================================== */}

          <div className="space-y-4">

            {items.map(item => (

              <div
                key={item._id}
                className="flex items-center gap-4 border border-green-200 p-4 rounded-lg"
              >

                {/* IMAGE */}

                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />


                {/* PRODUCT DETAILS */}

                <div className="flex-1">

                  <h3 className="font-semibold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-sm text-green-500">
                    ₹{item.price}/{item.unit}
                  </p>


                  {/* QUANTITY CONTROLS */}

                  <div className="flex items-center gap-2 mt-3">

                    <button
                      onClick={() =>
                        updateQuantity(
  item.product || item._id || item.id,
  item.quantity - 1
)
                      }
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      −
                    </button>

                    <span className="font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
  item.product || item._id || item.id,
  item.quantity + 1
)
                      }
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>

                  </div>
                </div>


                {/* SUBTOTAL */}

                <div className="text-right">

                  <p className="font-semibold text-lg">
                    ₹{item.subtotal}
                  </p>

                  <button
                    onClick={() =>
                      removeItem(
  item.product || item._id || item.id
)
                    }
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                  >
                    Remove
                  </button>

                </div>
              </div>
            ))}
          </div>


          {/* =====================================================
              BILL SUMMARY
          ===================================================== */}

          <div className="mt-8 border border-green-200 rounded-lg p-5 bg-green-50">

            <h2 className="text-xl font-semibold mb-4">
              Billing Summary
            </h2>

            <div className="space-y-2">

              <div className="flex justify-between">
                <span>Items Total</span>
                <span>₹{itemsTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{gstAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-xl">

                <span>Grand Total</span>

                <span>₹{grandTotal}</span>

              </div>
            </div>
          </div>


          {/* =====================================================
              CHECKOUT BUTTON
          ===================================================== */}

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}