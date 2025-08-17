import { Camera, Save, Lock, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./css/AdminProfile.css";
import AdminNavbar from "./AdminNavbar";
import { changeAdminPassword, getAdminProfile, updateAdminProfile } from "../services/adminapis";

export default function AdminProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");

  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getAdminProfile();
    //   console.log("This is admin data: ", data);
      const formattedDob = (mysqlDate: string | Date): string => {
        const d = new Date(mysqlDate);
        return d.getFullYear() + "-" +
                String(d.getMonth() + 1).padStart(2, "0") + "-" +
                String(d.getDate()).padStart(2, "0");
        };
        // console.log(formattedDob);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phoneNo);
      setAddress(data.address);
      setDob(formattedDob(data.date_of_birth));
      setOriginalData({
        name: data.name,
        email: data.email,
        phone: data.phoneNo,
        address: data.address,
        dob: formattedDob(data.date_of_birth),
      });
    };
    fetchProfile();
  }, []);

  const handlePassword = async () => {
    const res = await changeAdminPassword(password);

    if(res.message){
        alert("Password Changed successfully");
        setPassword("");
    }
    else {
        alert("Falied to change Password");
    }
  }

  const handleSave = async () => {
    const updatedData = { name, email, phone, address, dob };
    // console.log(updatedData);
    const res = await updateAdminProfile(updatedData);

    if (res.message) {
      alert("Profile updated successfully");
      setOriginalData(updatedData); 
    } else {
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setName(originalData.name);
    setEmail(originalData.email);
    setPhone(originalData.phone);
    setAddress(originalData.address);
    setDob(originalData.dob);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-pic-container">
            <img
              src={require("../assets/bookmain.jpg")}
              alt="Profile"
              className="profile-pic"
            />
            <button className="change-pic-btn">
              <Camera size={16} /> Change Picture
            </button>
          </div>

          <div className="change-password">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="save-password-btn" onClick={handlePassword}>
              <Lock size={16} /> Update Password
            </button>
          </div>
        </div>

        <div className="profile-details">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <button className="cancel-btn" onClick={handleCancel}>
              <X size={16} /> Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
