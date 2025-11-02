import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("La variable de entorno MONGO_URI no está definida");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("Conectado a la base de datos MongoDB");
  } catch (error) {
    console.error("Error al conectar a la base de datos MongoDB:", error);
    process.exit(1);
  }
};