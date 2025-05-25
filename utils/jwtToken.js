// Token generate karne ka function export kiya ja raha hai
export const generateToken = (user, message, statusCode, res) => {

    // User model ka method use karke JWT token generate kar rahe hain
    const token = user.generateJsonWebToken();
  
    // Role ke basis par cookie ka naam decide kar rahe hain
    // Agar admin hai to cookie ka naam 'adminToken' hoga, nahi to 'patientToken'
    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';
  
    // Response send kar rahe hain
    res
      .status(statusCode) // HTTP response status code set kar rahe hain
      .cookie(cookieName, token, { // Cookie set kar rahe hain browser mein
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ), // Cookie expire hone ka time set kiya gaya hai (environment variable se)
        httpOnly: true, // Cookie browser ke JS se access nahi ki ja sakti (security ke liye)
      secure:true,
   sameSite:"None" })
      .json({
        success: true, // Success status send kar rahe hain
        message,       // Custom message send kar rahe hain (jaise "Login Successful")
        user,          // User ka data bhej rahe hain response mein
        token,         // JWT token bhi bhej rahe hain (frontend use kar sakta hai agar chaahe)
      });
  };
  