import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../utils/store";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity, setCart, } from "../utils/cartSlice";
import { saveCart, removeCartItem, clearCartDB, updateCartItemQuantity, purchaseCart, getCartFromDB } from "../services/buyerapis";
import "./css/Cart.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // console.log(cartItems);

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
      navigate("/api/orders");
    } catch (error) {
      alert("Purchase failed. Please try again.");
      console.error(error);
    }
  };


  useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const dbCart = await getCartFromDB(); 
      console.log(dbCart);
      dispatch(setCart(dbCart));
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  fetchCartItems();
}, []);
  

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
                          if (newQty < 1) {
                            alert("Quantity cannot be less than 1.");
                            return;
                          }
                          dispatch(decreaseQuantity(item.bookid));
                          updateCartItemQuantity(item.bookid, newQty).catch(err =>
                            console.error("Decrease failed:", err)
                          );
                        }}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => {
                          const newQty = item.quantity + 1;
                          if (newQty > item.stock) {
                            alert(`Only ${item.stock} units available in stock.`);
                            return;
                          }
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
