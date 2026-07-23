const User = require('../models/User');


// ==========================================
// SEARCH USERS
// ==========================================

const searchUsers = async (req, res) => {

  try {

    // Get search text from URL
    // Example:
    // /api/users/search?search=Rahul

    const search =
      req.query.search || '';


    // Remove extra spaces

    const searchText =
      search.trim();


    console.log(
      'Searching for:',
      searchText
    );


    // If search is empty
    if (!searchText) {

      return res.status(200).json({

        users: []

      });

    }


    // Search user by name OR email

    const users =
      await User.find({

        // Don't show logged-in user
        _id: {
          $ne: req.user.id
        },


        $or: [

          // Search by name

          {
            name: {
              $regex:
                searchText,

              $options:
                'i'
            }
          },


          // Search by email

          {
            email: {
              $regex:
                searchText,

              $options:
                'i'
            }
          }

        ]

      })

      // Don't send password
      .select(
        'name email'
      )

      // Maximum 10 users
      .limit(10);


    console.log(
      'Users found:',
      users
    );


    return res.status(200).json({

      message:
        'Users found successfully',

      users

    });


  } catch (error) {

    console.error(
      'Search users error:',
      error
    );


    return res.status(500).json({

      message:
        'Failed to search users',

      error:
        error.message

    });

  }

};


// Export controller

module.exports = {

  searchUsers

};