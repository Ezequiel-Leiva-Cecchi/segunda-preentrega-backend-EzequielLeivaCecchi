import{ Router } from 'express';
import { GestorProductsMongo } from '../dao/managerMongoDB/productsMongoManager.js';

const viewsRouters = Router();
const productManager = new GestorProductsMongo(); 

viewsRouters.get("/", async (req, res) => {
  try {
    const resultado = await productManager.obtenerProductos();
    
    if (resultado.resultado === "Éxito") {
      res.render('home.handlebars', { title: 'Home', data: resultado.listaProductos });
    } else {
      res.status(400).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' + error.message });
  }
});
viewsRouters.get('/realtimeproducts', async (req, res) => {
  try {
    const resultado = await productManager.obtenerProductos();
    
    if (resultado.resultado === "Éxito") {
      res.render('realtimeproducts.handlebars', { title: 'RealTime Products', data: resultado.listaProductos });
    } else {
      res.status(400).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los productos' + err.message });
  }
});

export default viewsRouters;
