"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const conn_1 = __importDefault(require("./config/conn"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const address_route_1 = __importDefault(require("./routes/address.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const webhook_route_1 = __importDefault(require("./routes/webhook.route"));
const port = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname));
app.disable('x-powered-by');
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/api/v1/user', user_route_1.default);
app.use('/api/v1/product', product_route_1.default);
app.use('/api/v1/address', address_route_1.default);
app.use('/api/v1/order', order_route_1.default);
app.use('/api/v1/webhook', webhook_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.all('*', (req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});
(0, conn_1.default)()
    .then(() => {
    try {
        app.listen(port, () => console.log(`Server listening & database connected on ${port}`));
    }
    catch (e) {
        console.log('Cannot connect to the server');
    }
})
    .catch((e) => {
    console.log('Invalid database connection...! ', e);
});
