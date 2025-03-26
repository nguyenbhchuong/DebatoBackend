# DebatoBackend

## Overview

DebatoBackend is a backend application designed to handle authentication and other core services for the Debato platform. It is built using NestJS, MongoDB.

## Folder Structure

- **src/auth/**: Contains all authentication-related modules, services, controllers, and strategies.
  - **auth.module.ts**: Main module file for the authentication feature.
  - **controllers/**: Handles incoming requests and returns responses.
  - **services/**: Contains business logic for authentication.
  - **google.strategy.ts**: Implements Google OAuth strategy.
  - **auth.payload.d.ts**: Defines TypeScript types for authentication payloads.
  - **jwt.strategy.ts**: Implements JWT strategy for token handling.
  - **jwt.config.ts**: Configuration settings for JWT.
  - **dto/**: Data Transfer Objects for defining data shapes.
  - **schemas/**: Schema definitions for validation or database models.

## Authentication

- The JWT token is now stored in an HTTPOnly cookie named 'jwt'
- The cookie is:
  - HTTPOnly (can't be accessed by JavaScript)
  - Secure in production (only sent over HTTPS)
  - SameSite=Lax (provides CSRF protection while allowing normal navigation)
  - Expires in 1 day
  - 
## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DebatoBackend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd DebatoBackend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the application, run:

```bash
npm start
```
## License

This project is licensed under a Custom Non-Commercial License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, and/or merge copies of the Software, subject to the following conditions:

The Software shall not be used for any commercial purposes, including but not limited to:

Selling the Software or derivatives of it
Using the Software as part of a commercial product or service
Monetizing the Software in any way
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

Any modifications or derivative works must also be released under these same license terms.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
