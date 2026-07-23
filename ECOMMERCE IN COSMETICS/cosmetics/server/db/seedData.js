import User from '../models/User.js';
import Product from '../models/Product.js';
import Blog from '../models/Blog.js';
import Review from '../models/Review.js';

export const seedDatabase = async () => {
  try {
    const prodCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    if (prodCount > 0 && userCount > 0) {
      console.log(`[Seed Engine] Preserving existing MongoDB Atlas database (${prodCount} products, ${userCount} users).`);
      return;
    }

    if (userCount === 0) {
      console.log('[Seed Engine] Seeding default admin, expert, and customer users...');
      await User.create({
        name: 'Mae Executive Admin',
        email: 'admin@maebeauty.com',
        password: 'adminpassword123',
        role: 'admin',
        loyaltyPoints: 15000,
        loyaltyTier: 'Noir VIP'
      });

      await User.create({
        name: 'Julian Vance (Store Manager)',
        email: 'manager@maebeauty.com',
        password: 'managerpassword123',
        role: 'expert',
        loyaltyPoints: 4200,
        loyaltyTier: 'Gold'
      });

      await User.create({
        name: 'Camille Dubois (Faculty Artist)',
        email: 'expert@maebeauty.com',
        password: 'expertpassword123',
        role: 'expert',
        loyaltyPoints: 3100,
        loyaltyTier: 'Gold'
      });

      await User.create({
        name: 'Sophia Laurent (VIP Client)',
        email: 'user@maebeauty.com',
        password: 'userpassword123',
        role: 'customer',
        loyaltyPoints: 850,
        loyaltyTier: 'Gold',
        skinProfile: {
          skinType: 'Combination',
          undertone: 'Neutral',
          skinTone: 'Medium',
          concerns: ['Dryness', 'Hyper-pigmentation'],
          preferredFinish: 'Dewy'
        }
      });

      await User.create({
        name: 'Elena Rostova (Client)',
        email: 'sophia@maebeauty.com',
        password: 'userpassword123',
        role: 'customer',
        loyaltyPoints: 450,
        loyaltyTier: 'Bronze',
        skinProfile: {
          skinType: 'Sensitive',
          undertone: 'Cool',
          skinTone: 'Fair',
          concerns: ['Redness'],
          preferredFinish: 'Satin'
        }
      });
    }

    if (prodCount === 0) {
      console.log('[Seed Engine] Catalog empty. Generating 210+ luxury products across 21 subcategories...');
      const customerUser = await User.findOne({ role: 'customer' });

      // Subcategory definitions (21 subcategories)
      const subCategories = [
        // Makeup (6)
        { cat: 'Makeup', sub: 'Foundation', finish: 'Dewy', coverage: 'Full', priceBase: 88, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Makeup', sub: 'Concealer', finish: 'Satin', coverage: 'Full', priceBase: 42, img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Makeup', sub: 'Powder', finish: 'Matte', coverage: 'Sheer', priceBase: 54, img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Makeup', sub: 'Bronzer', finish: 'Radiant', coverage: 'Buildable', priceBase: 62, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Makeup', sub: 'Blush', finish: 'Dewy', coverage: 'Buildable', priceBase: 48, img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Makeup', sub: 'Highlighter', finish: 'Radiant', coverage: 'Buildable', priceBase: 58, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },

        // Skincare (6)
        { cat: 'Skincare', sub: 'Serums', finish: 'Radiant', coverage: 'N/A', priceBase: 125, img: 'https://images.unsplash.com/photo-1608248597263-00079e96e57a?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Skincare', sub: 'Moisturizers', finish: 'Dewy', coverage: 'N/A', priceBase: 98, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Skincare', sub: 'Cleansers', finish: 'N/A', coverage: 'N/A', priceBase: 46, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Skincare', sub: 'Eye Care', finish: 'Satin', coverage: 'N/A', priceBase: 84, img: 'https://images.unsplash.com/photo-1608248597263-00079e96e57a?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Skincare', sub: 'Face Masks', finish: 'Radiant', coverage: 'N/A', priceBase: 72, img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Skincare', sub: 'Sunscreen', finish: 'Satin', coverage: 'Sheer', priceBase: 52, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800' },

        // Lipstick & Lip Care (5)
        { cat: 'Lipstick', sub: 'Velvet Matte', finish: 'Matte', coverage: 'Full', priceBase: 46, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Lipstick', sub: 'Liquid Lip', finish: 'Satin', coverage: 'Full', priceBase: 44, img: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Lipstick', sub: 'Gloss', finish: 'Glossy', coverage: 'Medium', priceBase: 38, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Lipstick', sub: 'Lip Balms', finish: 'Dewy', coverage: 'Sheer', priceBase: 32, img: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Lipstick', sub: 'Lip Liners', finish: 'Matte', coverage: 'Full', priceBase: 28, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800' },

        // Eyes (4)
        { cat: 'Eyes', sub: 'Eyeshadow Palettes', finish: 'Satin', coverage: 'Buildable', priceBase: 78, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Eyes', sub: 'Eyeliner', finish: 'Matte', coverage: 'Full', priceBase: 36, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Eyes', sub: 'Mascara', finish: 'Satin', coverage: 'Full', priceBase: 40, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800' },
        { cat: 'Eyes', sub: 'Eyebrow Kits', finish: 'Matte', coverage: 'Buildable', priceBase: 44, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800' }
      ];

      const luxuryNamesPrefix = [
        '24K Gold Royal', 'Imperial Satin', 'Elixir De Radiance', 'Astral Couture',
        'Velvet Noir', 'Luminous Squalane', 'Damask Rose', 'Caviar Renewal',
        'Supreme Diamond', 'Celestial Glow'
      ];

      const generatedProducts = [];

      subCategories.forEach((sc, scIdx) => {
        for (let i = 1; i <= 10; i++) {
          const prefix = luxuryNamesPrefix[(i - 1) % luxuryNamesPrefix.length];
          const name = `${prefix} ${sc.sub} Vol. ${i}`;
          const price = sc.priceBase + (i * 3);

          generatedProducts.push({
            name,
            tagline: `Infused with Pure 24K Gold Peptides & Botanical Squalane (${sc.sub} Edition)`,
            brand: "MAE' BEAUTY",
            price,
            originalPrice: price + 20,
            category: sc.cat,
            subCategory: sc.sub,
            rating: Number((4.6 + (i * 0.03)).toFixed(1)),
            numReviews: 25 + (i * 8),
            isFeatured: i <= 2,
            isBestSeller: i <= 3,
            isNewArrival: i === 1,
            isVisible: true,
            shades: [
              { shadeName: '010 Fair Porcelain', colorHex: '#FBF0E4', isBestMatchFor: 'Fair Cool' },
              { shadeName: '020 Light Rose', colorHex: '#F6E4D3', isBestMatchFor: 'Light Cool' },
              { shadeName: '030 Medium Neutral', colorHex: '#E5C4A8', isBestMatchFor: 'Medium Neutral' },
              { shadeName: '040 Warm Amber', colorHex: '#D3A37C', isBestMatchFor: 'Tan Warm' },
              { shadeName: '050 Deep Espresso', colorHex: '#69432B', isBestMatchFor: 'Deep Neutral' }
            ],
            finish: sc.finish,
            coverage: sc.coverage,
            skinTypes: ['Dry', 'Normal', 'Combination', 'Sensitive', 'Oily'],
            keyIngredients: [
              { name: '24K Gold Micro-Peptides', purpose: 'Boosts Collagen & Radiance', ewgScore: 1, isKeyActive: true },
              { name: 'Multi-Weight Hyaluronic Acid', purpose: 'Deep Hydration', ewgScore: 1, isKeyActive: true },
              { name: 'Damask Rose Stem Cells', purpose: 'Soothes Redness', ewgScore: 1, isKeyActive: false }
            ],
            fullIngredientsList: 'Aqua, 24K Gold Peptides, Hyaluronic Acid, Rose Extract, Squalane, Niacinamide, Glycerin.',
            allergenWarnings: ['Contains Natural Rose Extract (Dermatologist Tested)'],
            cleanBeauty: true,
            vegan: true,
            crueltyFree: true,
            images: [sc.img],
            heroImage: sc.img,
            description: `Formulated in Paris and New York, the ${name} delivers ultra-refined texture with long-lasting weightless performance. Tested for all skin types.`,
            howToUse: 'Apply evenly using Mae Velvet Couture Applicator or fingertips.',
            proTips: 'Mix 1 drop of Royal Nectar Serum for an amplified glass-skin glow.',
            stock: 50 + (i * 10)
          });
        }
      });

      const created = await Product.insertMany(generatedProducts);

      if (customerUser) {
        await Review.create({
          product: created[0]._id,
          user: customerUser._id,
          userName: customerUser.name,
          userAvatar: customerUser.avatar,
          rating: 5,
          title: 'Flawless 24K Gold Coverage!',
          comment: 'The texture is insanely smooth and feels weightless all day long.',
          verifiedShade: '030 Medium Neutral',
          skinType: 'Combination'
        });
      }

      await Blog.create({
        title: 'Ultimate 24K Gold Glass Skin Guide 2026',
        slug: 'glass-skin-guide-2026',
        category: 'Tutorial',
        readTime: '6 min read',
        author: 'Julian Vance',
        authorRole: 'Master Makeup Artist',
        heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
        excerpt: 'Master the art of luminous, dewy skin with our step-by-step luxury skincare and foundation layering masterclass.',
        content: 'Achieving true glass skin is all about barrier hydration and seamless liquid formulation layering...',
        isBeginnerFriendly: true,
        taggedProducts: [created[0]._id, created[1]._id]
      });

      console.log(`[Seed Engine] Successfully populated ${created.length} luxury products across 21 subcategories!`);
    }
  } catch (error) {
    console.error(`[Seed Engine Error] ${error.message}`);
  }
};
