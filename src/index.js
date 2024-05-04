const dotenv = require('dotenv');
dotenv.config({
    path: "./.env",
});
const { httpServer } = require("./app.js");

const startServer = () => {
    httpServer.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port:  " + process.env.PORT);
    });
};

try {
    startServer();
} catch (error) {
    console.log(error);
}
