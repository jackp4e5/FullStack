import mongoose from "mongoose";

const conectarDB =  async ()=>{
   try {
     const DB = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology:true
     });

     const url = `${DB.connection.host}:${DB.connection.port}`;

     console.log(url);
   } catch (error) {
      console.log(`Error ${error.message}`);
      process.exit(1);
   }
}

export default conectarDB;