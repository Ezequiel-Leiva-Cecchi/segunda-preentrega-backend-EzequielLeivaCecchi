// Importación de módulos
import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewRoutes from "./routes/views.routes.js";
import { GestorProductsMongo } from "./dao/managerMongoDB/productsMongoManager.js";

const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
const io = new Server(httpServer);

const productManager = new GestorProductsMongo();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB
mongoose.connect("mongodb+srv://ezequielleivacecchi:85ixLqC5qRqh93VJ@productscoder.9liypih.mongodb.net/");

// Configuración de Handlebars
const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", "src/views");
app.set("view engine", "handlebars");
app.use("/", viewRoutes);

// Rutas API
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Sockets
const socketServer = new Server(httpServer);

// Conexión Socket.io
socketServer.on("connection", async (socket) => {
  console.log("New client connected");

  socket.on("addProd", async (prod) => {
    try {
      const result = await productManager.addProduct(prod);
      if (result.message === "OK") {
        const products = await productManager.getProducts();
        if (products.message === "OK") {
          socket.emit("getAllProducts", products.res);
        }
      }
      return result;
    } catch (error) {
      console.log("Error adding a product: ", error);
    }
  });

  socket.on("delProd", async (id) => {
    const result = await productManager.deleteProduct(id);
    if (result.message === "OK") {
      const products = await productManager.getProducts();
      if (products.message === "OK") {
        socket.emit("getAllProducts", products.res);
      }
    } else {
      console.log("Error deleting a product: ", result.res);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});