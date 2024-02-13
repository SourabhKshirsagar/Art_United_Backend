import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv'; // Import dotenv for environment variables
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT|| 5000;;
const CONNECTION_URL = process.env.CONNECTION_URL;

import postRoutes from './Routes/posts.js';  // importing all postRoutes
import userRoutes from './Routes/users.js';  // importing all authRoutes
const app = express();                   //using express app
// dotenv.config();
console.log(process.env.CONNECTION_URL);
// ----------------------------------------------------------------------------------------------------------------------------------------------------------

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


app.use('/posts',postRoutes);            //   it means every routes which is inside posts will start with the "/posts" end point
app.use('/user',userRoutes);            //   it means every routes which is inside posts will start with the "/posts" end point
//app.use(endPoint , imported file name)

app.get('/', (req,res)=>{
  res.send('APP IS RUNNING');
})

//   For DataBase connection------------------------------------------------------------------------------------------------------------------------ 
// const CONNECTION_URL = 'mongodb+srv://sourabhkshirsagar5500:Zlqmddru01@cluster0.umy3kzk.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`)))
  .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify',false);    NOT REQUIRED