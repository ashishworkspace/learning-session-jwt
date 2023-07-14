import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const toHash = async (password) => {
  const salt = randomBytes(8).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
};

const compare = async(storedPassword, suppliedPassword) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = await scryptAsync(suppliedPassword, salt, 64);
    return buf.toString('hex') === hashedPassword; // true / false
};

export { toHash, compare };
