import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../utils/store";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity, } from "../utils/cartSlice";
import { saveCart, removeCartItem, clearCartDB, updateCartItemQuantity, purchaseCart } from "../services/buyerapis";
import "./css/Cart.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );


  const handleProceedToBuy = async () => {
  const confirmed = window.confirm(
    `Are you sure you want to purchase all items in the cart for ₹${totalPrice}?`
  );

  if (!confirmed) return;

  try {
    const items = cartItems.map((item) => ({
      bookid: item.bookid,
      quantity: item.quantity,
    }));

    const result = await purchaseCart(items);

    // console.log("after buy in cart", result);



    alert("Purchase successful!");
    dispatch(clearCart());
    navigate("/orders");
  } catch (error) {
    alert("Purchase failed. Please try again.");
    console.error(error);
  }
};

//   useEffect(() => {
//     if (cartItems.length > 0) {
//       saveCart(cartItems).catch((err) => console.error("Save failed:", err));
//     }
//   }, [cartItems]);

  return (

    <>
        <Navbar />

        <div className="cart-container">

        {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
        ) : (
            <>
            <div className="cart-items">
                {cartItems.map((item) => (
                <div key={item.bookid} className="cart-item">
                    <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p>Price: ₹{item.price}</p>
                    <div className="quantity-controls">
                        <button
                            onClick={() => {
                                const newQty = item.quantity - 1;
                                if (newQty > 0) {
                                dispatch(decreaseQuantity(item.bookid));
                                updateCartItemQuantity(item.bookid, newQty).catch(err =>
                                    console.error("Decrease failed:", err)
                                );
                                }
                            }}
                            >
                            -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                            onClick={() => {
                                const newQty = item.quantity + 1;
                                dispatch(increaseQuantity(item.bookid));
                                updateCartItemQuantity(item.bookid, newQty).catch(err =>
                                console.error("Increase failed:", err)
                                );
                            }}
                            >
                            +
                        </button>
                    </div>
                    <p>Total: ₹{item.price * item.quantity}</p>
                    </div>
                    <button
                    className="remove-btn"
                    onClick={() => {
                        dispatch(removeFromCart(item.bookid));
                        removeCartItem(item.bookid).catch((err) =>
                        console.error("Remove failed:", err)
                        );
                    }}
                    >
                    Remove
                    </button>
                </div>
                ))}
            </div>

            <div className="cart-summary">
                <h3>Cart Summary</h3>
                <p>Total Price: ₹{totalPrice}</p>
                <button className="checkout-btn" onClick={handleProceedToBuy}>Proceed to Buy</button>
                <button
                className="clear-btn"
                onClick={() => {
                    dispatch(clearCart());
                    clearCartDB().catch((err) =>
                    console.error("Clear failed:", err)
                    );
                }}
                >
                Clear Cart
                </button>
            </div>
            </>
        )}
        </div>
    </>
  );
}
