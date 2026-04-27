export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

    <div style="max-width:500px; margin:30px auto; background-color:#ffffff; padding:20px; border-radius:6px; box-shadow:0 0 5px rgba(0,0,0,0.1); text-align:center;">

      <h2 style="color:#333333; margin-bottom:10px;">
       fyp system password reset request
      </h2>

      <p style="color:#555555; font-size:14px; line-height:1.6;">
        You requested to reset your password.
      </p>

      <p style="color:#555555; font-size:14px; line-height:1.6;">
        Click the button below to set a new password:
      </p>

    <div style="text-align: center; margin: 30px 0;"> 
      <a href = " ${resetPasswordUrl}" style="background-color: green; color: white; padding: 10px 20px; 
               border: none; border-radius: 5px; cursor: pointer; font-size: 16px; text-decoration: none;"">
          Reset Password
      </a>
    </div>
      <p style="color:#555555; font-size:13px; line-height:1.6; margin-top:20px;">
        If you did not request this, please ignore this email.
      </p>

      <p style="color:#555555; font-size:13px; line-height:1.6; margin-top:20px;">
        If the button aloone does not work, copy and pastee the following link into your browser.
      </p>

      <p style="font-size: 14px; color:#3b82f6: word-wrap: break-word;">
        ${resetPasswordUrl}
    </p>


      <p style="margin-top:20px; font-size:12px; color:#999999;">
        This link will expire in 15 minutes.
      </p>

    </div>

  </body>
    `
}