import mongoose from "mongoose";
import { toHash } from "../services/password.js";
import { scrypt, randomBytes} from "crypto";
import { promisify } from "util";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (done) {
  if (!this.isModified("password")) {
    done();
  }
  this.password = await toHash(this.password);
  done();
});

const scryptAsync = promisify(scrypt);


userSchema.methods.toComparePassword = async(storedPassword, suppliedPassword) => {
  const [hashedPassword, salt] = storedPassword.split(".");
  const buf = await scryptAsync(suppliedPassword, salt, 64);
  return buf.toString("hex") === hashedPassword; // true / false
}

const User = mongoose.model("User", userSchema);

export default User;
