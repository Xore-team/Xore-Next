import XoreClient from "./src/client/XoreClient";
import dotenv from "dotenv";
import Server from "./api/Server";

dotenv.config();

let xore = new XoreClient();
new Server(xore);

(async () => {
    await xore.instance.login(await xore.getToken());
    await xore.connectDB();
})();