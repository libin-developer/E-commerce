import jwt from "jsonwebtoken"
import serverconfig from "../Config/serverconfig.js";





    const adminToken = (user) => {
    return jwt.sign({ data: user.email, role: user.role },serverconfig.token, {expiresIn: "1d",});
  }
  export default adminToken;