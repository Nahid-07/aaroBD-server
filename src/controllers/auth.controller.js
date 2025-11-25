export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // 1. Debug: Log the received token (first 20 chars for safety)
    console.log("Received Google Token:", token ? token.substring(0, 20) + "..." : "No Token");

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error(" GOOGLE_CLIENT_ID is missing in backend .env");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // 2. Verify Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    // 3. Debug: Log the payload from Google
    console.log("Google Payload:", { email: payload.email, name: payload.name });

    const { name, email, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      console.log("User found, logging in:", user.email);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      console.log("User not found, registering new user:", email);
      // Register new user
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      user = await User.create({
        name,
        email,
        password: randomPassword,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("Google Auth Error:", error.message); // Log the specific error
    res.status(400).json({ message: "Google Authentication Failed: " + error.message });
  }
};