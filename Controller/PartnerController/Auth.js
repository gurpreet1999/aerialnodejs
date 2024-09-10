const jwt = require("jsonwebtoken");
const sendToken = require("../../utils/jwtToken");




const generateTokenAndLogin = async (userData, res) => {
  const { user_id, partner_role} = userData;

  // Generate JWT token
  const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  return res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user: userData
  });
};

const checkUser = async (req, res, next) => {
  try {
    const { fullName, email, profileImage, googleId } = req.body;
    const connection = await pool.getConnection();

    // Check if user exists based on email or Google ID
    const [results] = await connection.execute(
      "SELECT * FROM partners WHERE email = ?",
      [email]
    );

    if (results.length > 0) {
      // User exists, log them in
      await generateTokenAndLogin(results[0], res);
    } else {
      const [userDetails] = await connection.execute(
        "INSERT INTO partners (google_id, email, username, profile_image_url, userurl) VALUES (?, ?, ?, ?, ?)",
        [googleId, email, fullName, profileImage, ""]
      );

      const userUrl = fullName.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, "-") + '-' + userDetails.insertId;

      await connection.execute(
        "UPDATE partners SET userurl = ? where user_id = ?", [userUrl, userDetails.insertId]
      );

      // Fetch newly registered user
      const [newResults] = await connection.execute(
        "SELECT * FROM partners WHERE email = ?",
        [email]
      );
      await generateTokenAndLogin(newResults[0], res);
    }

    await connection.release();
  } catch (err) {
    console.error("Check user error:", err);
    res.status(500).json({ success: false, message: "Error checking user" });
  }
};

// Logout user
const logoutPartner = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};

module.exports = { 
    logoutPartner, checkUser };

