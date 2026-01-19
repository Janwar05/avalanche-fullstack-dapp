"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Simple Storage dApp API)')
        .setDescription(`
The Simple Storage dApp API description<br><br>
Nama: Janwar<br>
NIM: 231011400203
`)
        .setVersion('1.0')
        .addTag('simple-storage')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('documentation', app, documentFactory);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
    console.error('Error during application bootstrap:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map