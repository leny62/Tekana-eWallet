import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';


export const initializeTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    return app;
};