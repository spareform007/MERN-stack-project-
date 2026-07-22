import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc Fetch assigned client profiles, skin notes, and order histories
// @route GET /api/expert/clients
export const getAssignedClients = async (req, res) => {
  try {
    // Find customers assigned to this expert or all clients for consultation
    const clients = await User.find({ role: 'customer' }).select('-password').lean();

    const clientData = await Promise.all(
      clients.map(async (client) => {
        const orders = await Order.find({ user: client._id }).sort({ createdAt: -1 });
        return {
          ...client,
          orderHistory: orders,
          consultationNotes: [
            `Recommended 24K Gold Peptides Routine for ${client.skinProfile?.skinTone || 'Medium'} ${client.skinProfile?.undertone || 'Neutral'} skin.`,
            `Client requested low-allergen EWG formulations.`
          ]
        };
      })
    );

    res.json(clientData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Receive array of SKU IDs and return pre-filled cart payload linked to expertId
// @route POST /api/expert/build-cart
export const buildExpertCart = async (req, res) => {
  const { productIds, clientEmail } = req.body;

  try {
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Product IDs array required' });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    const cartPayload = {
      expertId: req.user._id,
      expertName: req.user.name,
      clientEmail: clientEmail || '',
      items: products.map((prod) => ({
        product: prod,
        selectedShade: prod.shades?.[0] || null,
        quantity: 1
      })),
      shareableUrl: `/checkout?expertId=${req.user._id}&bundle=${productIds.join(',')}`
    };

    res.json(cartPayload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
