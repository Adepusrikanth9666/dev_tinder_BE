const isAdmin = (req, res, next) => {
  console.log("Admin middleware called");
  const token = "abcd";
  const isAdmin = token === "abcd";
  if (!isAdmin) {
    return res.status(403).send("Access denied. Admins only.");
  } else {
    console.log("admin data connection authorized");
  }
  next();
};

const isUser = (req, res, next) => {
  console.log("User middleware called");
  const token = "abcd";
  const isAdmin = token === "abcd";
  if (!isAdmin) {
    return res.status(403).send("Access denied. User only.");
  } else {
    console.log("User data connection authorized");
  }
  next();
};

module.exports = { isAdmin, isUser };
