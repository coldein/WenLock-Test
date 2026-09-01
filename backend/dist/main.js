"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const configure_app_1 = require("./configure-app");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    (0, configure_app_1.configureApp)(app);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('WenLock Users API')
        .setDescription('API REST para gerenciamento de usuários do teste prático WenLock')
        .setVersion('1.0')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, swaggerDocument);
    const configService = app.get(config_1.ConfigService);
    const port = configService.getOrThrow('PORT');
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map