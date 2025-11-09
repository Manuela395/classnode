import bcrypt from "bcrypt";
export const hash = (plain) => bcrypt.hash(plain, 10); // Para encriptar la contraseña
export const compare = (plain, hashed) => bcrypt.compare(plain, hashed); // compara la contraseña encriptada con la de la base de datos