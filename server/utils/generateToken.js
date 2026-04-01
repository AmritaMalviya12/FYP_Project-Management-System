export const generateToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  res.status(statusCode).cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  })
  .json({
    success: true,
    user,
    message,
    token,
  })
};


// NOTE -> yahan par user model ke andar hi jwt token generate ho rha hai aur phir yahan par generate token function mei hamne res.status.cookie bheji hai..jo ki jab hum koi token generate karate hain toh bhejte hi hain.