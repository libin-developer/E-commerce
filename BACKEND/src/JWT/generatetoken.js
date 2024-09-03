import jwt from "jsonwebtoken"
import serverconfig from "../Config/serverconfig.js";


    const generateToken = (email) => {
    return jwt.sign({ data: email }, serverconfig.token || "", { expiresIn: "1d" });
  };
  
  export default generateToken;


