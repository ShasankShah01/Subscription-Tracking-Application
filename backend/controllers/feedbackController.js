const Feedback = require('../models/Feedback');
const BadWords = require('bad-words');

// Initialize BadWords filter instance
const FilterClass = BadWords.Filter || BadWords;
const filter = new FilterClass();

// Custom array of modern / Gen Z slang, bypasses, toxic terms, and evasion patterns
const modernToxicityWords = [
  'gyatt',
  'rizzler',
  'skibidi',
  'kys',
  'killyourself',
  'stfu',
  'fck',
  'f*ck',
  'fu*k',
  'b!tch',
  'btch',
  'sh!t',
  'sh1t',
  'a$$',
  'a$$hole',
  'asshole',
  'bitch',
  'fuck',
  'shit',
  'dick',
  'cunt',
  'dumbass',
  'dipshit',
  'jackass',
  'retard',
  'trashapp',
  'garbageapp',
  'scam',
  'scammer',
  'fraud',
];
filter.addWords(...modernToxicityWords);

// Safe cleaning helper to handle strings gracefully
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  try {
    return filter.clean(text.trim());
  } catch (err) {
    return text.trim();
  }
};

// @desc    Submit new feedback
// @route   POST /api/feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, role, rating, message, feedback: feedbackField, tag } = req.body;
    const rawFeedback = message || feedbackField;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    if (!rawFeedback || !rawFeedback.trim()) {
      return res.status(400).json({ success: false, message: 'Feedback message is required' });
    }

    const numericRating = Number(rating) || 5;
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Phase 3: Sanitize name and feedback message before saving to MongoDB
    const sanitizedName = sanitizeText(name);
    const sanitizedFeedback = sanitizeText(rawFeedback);
    const sanitizedRole = role && role.trim() ? sanitizeText(role) : 'App User';
    const sanitizedTag = tag && tag.trim() ? sanitizeText(tag) : 'Community Feedback';

    const feedback = new Feedback({
      name: sanitizedName,
      role: sanitizedRole,
      rating: numericRating,
      message: sanitizedFeedback,
      tag: sanitizedTag,
      user: req.user?._id || req.user?.id || null,
    });

    const savedFeedback = await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting feedback',
    });
  }
};

// @desc    Get all community feedback
// @route   GET /api/feedback
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching feedback',
    });
  }
};
