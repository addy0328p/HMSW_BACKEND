// Mongoose aur validator modules ko import kar rahe hain
import mongoose from "mongoose";
import validator from "validator";

// Message schema define kar rahe hain, jo ki message model ko structure dega
const messageSchema = new mongoose.Schema({
  // First name ka field, required aur minimum length validation
  firstName: {
    type: String,  // Field type String hona chahiye
    required: true,  // Ye field required hai
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],  // First name me kam se kam 3 characters hone chahiye
  },
  
  // Last name ka field, required aur minimum length validation
  lastName: {
    type: String,  // Field type String hona chahiye
    required: true,  // Ye field bhi required hai
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],  // Last name me bhi kam se kam 3 characters hone chahiye
  },
  
  // Email field, required aur email format validate karne ke liye validator.isEmail use kar rahe hain
  email: {
    type: String,  // Field type String hona chahiye
    required: true,  // Ye field bhi required hai
    validate: [validator.isEmail, "Provide A Valid Email!"],  // Is field ki value ko email format me hona chahiye, agar nahi toh custom error message dikhaye
  },
  
  // Phone number field, exact 10 digits hona chahiye
  phone: {
    type: String,  // Field type String hona chahiye because number me length define nhi kar sakte
    required: true,  // Ye field required hai
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],  // Phone number me minimum 10 digits hone chahiye
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],  // Phone number me maximum 10 digits hone chahiye
  },
  
  // Message field, required aur minimum length validation
  message: {
    type: String,  // Field type String hona chahiye
    required: true,  // Ye field bhi required hai
    minLength: [10, "Message Must Contain At Least 10 Characters!"],  // Message ka length kam se kam 10 characters hona chahiye
  },
});

// Schema ke upar Message model banate hain
export const Message = mongoose.model("Message", messageSchema);  // Is schema ko "Message" name ke model se export kar rahe hain
