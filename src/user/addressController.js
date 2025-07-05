import User from "./userModel.js";

// Add new address
export const addAddress = async (req, res) => {
  try {
    const {
      label,
      houseNumber,
      street,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
    } = req.body;

    if (!houseNumber || !street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Missing required address fields",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.addresses.push({
      label,
      houseNumber,
      street,
      city,
      state,
      pincode,
      country,
      latitude,
      longitude,
    });

    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, addresses: user.addresses || [] });
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
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    // Apply updates only to valid fields
    const allowedFields = [
      "label",
      "houseNumber",
      "street",
      "city",
      "state",
      "pincode",
      "country",
      "latitude",
      "longitude",
    ];

    for (let key of allowedFields) {
      if (updates[key] !== undefined) {
        address[key] = updates[key];
      }
    }

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
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
