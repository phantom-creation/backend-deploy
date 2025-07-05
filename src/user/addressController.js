// src/user/addressController.js
import User from "./userModel.js";

// Add new address
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, pincode, country, latitude, longitude } = req.body;

    const user = await User.findById(req.user.id);
    user.addresses.push({ label, street, city, state, pincode, country, latitude, longitude });
    await user.save();

    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user.id);
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    Object.assign(address, updates);
    await user.save();

    res.status(200).json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
