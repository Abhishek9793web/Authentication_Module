const Notification = require('../models/Notification');


// ==========================================
// GET ALL MY NOTIFICATIONS
// GET /api/notifications
// ==========================================

const getNotifications = async (req, res) => {

  try {

    // Get logged-in user's ID
    const userId = req.user.id;


    // Find notifications
    // belonging to this user
    const notifications =
      await Notification.find({
        receiver: userId
      })
      .populate(
        'sender',
        'name email'
      )
      .populate(
        'conversation'
      )
      .populate(
        'message'
      )
      .sort({
        createdAt: -1
      });


    // Return notifications
    return res.status(200).json({

      message:
        'Notifications fetched successfully',

      notifications

    });


  } catch (error) {

    console.error(
      'Get notifications error:',
      error
    );


    return res.status(500).json({

      message:
        'Something went wrong'

    });

  }

};


// ==========================================
// MARK NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ==========================================

const markNotificationAsRead = async (
  req,
  res
) => {

  try {

    // Get notification ID
    const {
      id
    } = req.params;


    // Get logged-in user
    const userId =
      req.user.id;


    // Find notification
    //
    // IMPORTANT:
    // receiver must be current user
    //
    // This prevents User A from marking
    // User B's notification as read
    const notification =
      await Notification.findOne({

        _id:
          id,

        receiver:
          userId

      });


    // Notification not found
    if (!notification) {

      return res.status(404).json({

        message:
          'Notification not found'

      });

    }


    // Mark as read
    notification.isRead = true;


    // Save changes
    await notification.save();


    // Return response
    return res.status(200).json({

      message:
        'Notification marked as read',

      notification

    });


  } catch (error) {

    console.error(
      'Mark notification error:',
      error
    );


    return res.status(500).json({

      message:
        'Something went wrong'

    });

  }

};


module.exports = {

  getNotifications,

  markNotificationAsRead

};