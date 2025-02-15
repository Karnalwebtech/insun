import app from "./app";
import dbconnect from "./config/db";
dbconnect()
app.listen(9000, () => console.log("server start"))