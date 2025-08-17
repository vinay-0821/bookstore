import React, { useEffect, useState } from "react";
import "./css/SellerApprovalPage.css";
import AdminNavbar from "./AdminNavbar";
import { decideSeller, fetchPendingSellers, Seller } from "../services/adminapis";

export default function SellerApprovalPage() {
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSellers = async () => {
      try {
        const data = await fetchPendingSellers();
        setPendingSellers(data);
        console.log("Pending Sellers: ", data);
      } catch (error) {
        console.error("Error fetching pending sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSellers();
  }, []);

  const handleDecision = async (id: number, action: "approve" | "reject") => {
    try {
      await decideSeller(id, action);
      setPendingSellers((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(`Error trying to ${action} seller:`, error);
    }
  };

  return (
    <div className="approval-container">
      <AdminNavbar />
      <div className="approval-sellers">
        <h1 className="approval-title">
          Hey, admin you can decide who can sell,{" "}
          <span>
            <strong>approve sellers below</strong>
          </span>
        </h1>

        {loading ? (
          <p>Loading sellers...</p>
        ) : pendingSellers.length === 0 ? (
          <p className="empty-msg">No pending seller requests right now.</p>
        ) : (
          <div className="card-list">
            {pendingSellers.map((seller) => (
              <div className="approval-card" key={seller.id}>
                <div className="seller-info">
                  <h2>{seller.name}</h2>
                  <p>
                    <strong>Email:</strong> {seller.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {seller.phoneNo}
                  </p>
                  <p>
                    <strong>Address:</strong> {seller.address}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(seller.date_of_birth).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Join Date:</strong>{" "}
                    {new Date(seller.join_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="btn-group">
                  <button
                    className="btn-approve"
                    onClick={() => handleDecision(seller.id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleDecision(seller.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
