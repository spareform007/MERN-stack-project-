import Product from '../models/Product.js';

// @desc AI Skin Tone & Product Recommendation Engine
// @route POST /api/ai/recommend
export const getAIRecommendations = async (req, res) => {
  const { skinType, skinTone, undertone, concerns = [], preferredFinish } = req.body;

  try {
    const allProducts = await Product.find({});

    // Intelligent Scoring Algorithm
    const scoredProducts = allProducts.map((prod) => {
      let score = 50; // Base score

      // 1. Skin Type Match
      if (skinType && prod.skinTypes && prod.skinTypes.includes(skinType)) {
        score += 25;
      }

      // 2. Finish Match
      if (preferredFinish && prod.finish === preferredFinish) {
        score += 15;
      }

      // 3. Shade Matching for Foundations/Lipsticks
      if (skinTone || undertone) {
        const matchingShade = prod.shades?.find((s) => {
          const matchTarget = `${skinTone || ''} ${undertone || ''}`.toLowerCase();
          return s.isBestMatchFor?.toLowerCase().includes(matchTarget) ||
                 s.shadeName.toLowerCase().includes((undertone || '').toLowerCase()) ||
                 s.shadeName.toLowerCase().includes((skinTone || '').toLowerCase());
        });

        if (matchingShade) {
          score += 30;
        }
      }

      // 4. Skin Concern Match (Hyper-pigmentation, Dryness, Aging, Sensitivity, Acne)
      if (concerns.length > 0) {
        concerns.forEach((concern) => {
          const concernLower = concern.toLowerCase();
          if (prod.description?.toLowerCase().includes(concernLower) ||
              prod.tagline?.toLowerCase().includes(concernLower) ||
              prod.keyIngredients?.some(ing => ing.purpose?.toLowerCase().includes(concernLower))) {
            score += 15;
          }
        });
      }

      // Rating boost
      score += (prod.rating || 4.5) * 5;

      return {
        product: prod,
        matchScore: Math.min(99, Math.floor(score)),
        recommendedShade: prod.shades?.find((s) => {
          const target = `${skinTone || ''} ${undertone || ''}`.toLowerCase();
          return s.isBestMatchFor?.toLowerCase().includes(target);
        }) || prod.shades?.[0]
      };
    });

    // Sort by highest match score
    scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

    // Group recommendations by routine steps
    const foundationMatch = scoredProducts.filter(p => p.product.category === 'Makeup' || p.product.subcategory?.includes('Foundation'))[0];
    const lipMatch = scoredProducts.filter(p => p.product.category === 'Lipstick' || p.product.subcategory?.includes('Lip'))[0];
    const skincareMatch = scoredProducts.filter(p => p.product.category === 'Skincare')[0];
    const eyeMatch = scoredProducts.filter(p => p.product.category === 'Eyes' || p.product.category === 'Cheeks')[0];

    res.json({
      profileAnalysis: {
        summary: `Tailored for ${skinTone || 'Medium'} skin with ${undertone || 'Neutral'} undertones & ${skinType || 'Combination'} skin type.`,
        keyIngredientsSuggested: ['Hyaluronic Acid', 'Niacinamide', 'Botanical Squalane', 'Gold Peptide Complex'],
        routineName: 'Mae\' Glowing Radiance Routine'
      },
      topMatches: scoredProducts.slice(0, 6),
      routineBundle: {
        foundation: foundationMatch,
        lip: lipMatch,
        skincare: skincareMatch,
        eye: eyeMatch
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
