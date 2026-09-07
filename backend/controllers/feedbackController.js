const Feedback = require('../models/Feedback');

// @desc    Submit new feedback
// @route   POST /api/feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, role, rating, message, tag } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Feedback message is required' });
    }

    const numericRating = Number(rating) || 5;
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({
      name: name.trim(),
      role: role && role.trim() ? role.trim() : 'App User',
      rating: numericRating,
      message: message.trim(),
      tag: tag && tag.trim() ? tag.trim() : 'Community Feedback',
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
