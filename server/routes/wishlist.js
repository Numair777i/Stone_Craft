const router = require("express").Router();
const Wishlist = require("../models/Wishlist");

// Get user's wishlist
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const wishlist = await Wishlist.findOne({ userId });
    res.json(wishlist || { userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to wishlist
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, name, price, img } = req.body;

    if (!userId || !productId || !name || price === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [{ productId, name, price, img }],
      });
    } else {
      // Check if product already in wishlist
      const exists = wishlist.items.find((item) => item.productId === productId);
      if (!exists) {
        wishlist.items.push({ productId, name, price, img });
      }
    }

    const savedWishlist = await wishlist.save();
    res.json(savedWishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from wishlist
router.post("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter((item) => item.productId !== productId);
    const savedWishlist = await wishlist.save();
    res.json(savedWishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear entire wishlist
router.post("/clear", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.items = [];
    const savedWishlist = await wishlist.save();
    res.json(savedWishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
