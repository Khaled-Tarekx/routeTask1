import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    port: 3306,
  });


sequelize.authenticate().then(() => {
    console.log('authenticated to db');
}).catch((error) => {
    console.log(`failed in the process of authentication: ${error}`);
});

(async () => {
  await sequelize.sync({ alter: false, force: false });
})();
export default sequelize