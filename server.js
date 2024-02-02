/* eslint-disable node/no-missing-require */
/* eslint-disable import/extensions */
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError")
const globalError = require('./middlewares/errorMiddleware')
const dbConnection = require('./config/database')
const categoryRouter = require('./routes/gategoryRoute')
const brandRouter = require('./routes/brandRoute')
const productRouter = require('./routes/productRoute')
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const subCategoryRouter = require('./routes/subCategoryRoute')

// Connect with db
dbConnection()

// express app
const app = express();

// Middlewares
app.use(express.json())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode :${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories',categoryRouter)
app.use('/api/v1/subcategories',subCategoryRouter)
app.use('/api/v1/brands',brandRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);

app.all("*",(req,res,next)=>{
// Create error and send it to error handling middleware
  next(new ApiError(`Can't find this route: ${req.originalUrl} `,400))
})

// Global error handling middleware
app.use(globalError)

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

// Handle rejection outside express
process.on('unhandledRejection',(err)=>{
  console.error(`UnhandleRejection Errors: ${err.name} | ${err.message}`)
  server.close(()=>{
    console.error(`Shutting down....`)
    process.exit(1)
  })
})
