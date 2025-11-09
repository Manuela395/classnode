import cors from "cors";
 
export const corsConfig = cors({
  origin: true, // ["https://tu-dominio.com", "https://app.tu-dominio.com"],
  credentials: true,
  //methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  //allowedHeaders: ["Content-Type","Authorization"],
});