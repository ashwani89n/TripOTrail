const express = require("express");
const bodyParse = require("body-parser")
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const expenseRoutes = require("./routes/expenseRoutes")
const mediaRoutes = require("./routes/mediaRoutes")
// const tripmateRoutes = require("./routes/tripmateRoutes")
const bodyParser = require("body-parser");
const { authenticateJWT } = require("./middleware/authMiddleware");

const swaggerDocument = YAML.load("./api_documentation.yaml");

const app = express();
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Routes
app.use('/auth', authRoutes);
app.use('/trips', authenticateJWT, tripRoutes);
app.use('/trips', authenticateJWT, destinationRoutes);
app.use('/trips', authenticateJWT, mediaRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/trips', authenticateJWT, expenseRoutes);
app.use('/trips', authenticateJWT, budgetRoutes);
// app.use('/trips/:tripId/tripmates', authenticateJWT, tripmateRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
