import  mongoose from 'mongoose'

const URI = "mongodb+srv://shashank:shashank123@sem6-project.lfg2l.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Sem6-Project";

const connectDb = async () => {
    try{
        await mongoose.connect(URI);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Not Connected");
        process.exit(1);
    }
};

export default connectDb;