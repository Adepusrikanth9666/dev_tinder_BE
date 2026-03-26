const validate = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Name is not valid!!");
  } else if (firstName.length < 4 || lastName.length < 4) {
    throw new Error("Name should be in between 4-50 characters long");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Email is not valid!!");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Password is not valid!!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "imageUrl",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key),
  );
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
