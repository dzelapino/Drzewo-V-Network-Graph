const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 5,
    max: 15,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  neoId: {
    type: Number,
    required: true,
  },
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 11, (err, hashedPassword) => {
    if (err) return next(err);
    this.password = hashedPassword;
    next();
  });
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return callback(err);
    else {
      if (!isMatch) return callback(null, isMatch);
      return callback(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
