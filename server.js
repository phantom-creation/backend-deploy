import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './src/config/dbConfig.js';
import productRoutes from './src/product/productRoutes.js';
import dishTypeRoutes from './src/dishType/dishTypeRoutes.js';
import foodRoutes from './src/food/foodRoutes.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

app.use('/api', productRoutes);
app.use('/api', dishTypeRoutes);
app.use('/api', foodRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Product API');
});

const PORT = process.env.PORT || 3001;
//connect to the database
connectDb()

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})