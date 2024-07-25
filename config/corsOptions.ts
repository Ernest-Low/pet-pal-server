const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: allowedOrigins, // Allow specific origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

export default corsOptions