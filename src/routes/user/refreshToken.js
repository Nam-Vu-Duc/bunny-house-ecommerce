const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  // Check if refresh token is in our storage
  if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, SECRET_REFRESH, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Refresh token expired" });

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Replace the old refresh token with the new one
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    refreshTokens.push(newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  })
})

module.exports = router