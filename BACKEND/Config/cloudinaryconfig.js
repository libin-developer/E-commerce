/*its for storing the files in a cloud storage (cloudinary.com)  */

import cloudinary from "cloudinary";
import serverconfig from "./serverconfig.js";

cloudinary.v2.config({
  cloud_name:serverconfig.cloudinaryname,
  api_key:serverconfig.clodinaryapikey,
  api_secret:serverconfig.clodinaryapisecret,
});


export const cloudinaryInstance = cloudinary.v2;