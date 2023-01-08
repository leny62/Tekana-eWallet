### tekana-eWallet

Strategy:
    
    1. First, gather requirements from the business team and other stakeholders to understand the needs and goals of the project.
    This will involve working closely with the product owner, UI/UX designers, and other subject matter experts to define the features and functionality of the new back-end solution.

    2. Next, assess the current technology stack and identify any potential bottlenecks or areas for improvement.
    This will involve reviewing the existing codebase, as well as analyzing data on system performance, user behavior, and other relevant metrics.

    3. Based on the requirements and assessment of the current technology stack, develop a plan for the new back-end solution.
    This will involve selecting the appropriate technologies and frameworks, designing the architecture and data model, and identifying any dependencies or integration points with other systems.

    4. Engage with the front-end team to ensure that the back-end solution aligns with the needs and goals of the user interface. 
    This will involve collaborating on API design and other integration points, as well as providing guidance on how to consume the back-end APIs and services.

    5. As the back-end solution is being developed, focus on writing clean, maintainable, and well-documented code that adheres to best practices and industry standards.
    This will involve using version control, testing frameworks, and other tools to ensure the quality and reliability of the codebase.

    6. Before going live with the new back-end solution, conduct thorough testing and QA to ensure that it meets the requirements and performs well in a production environment. 
    This will involve collaborating with the QA team to define and execute test cases, as well as working with the operations team to prepare for the deployment of the new system.

    7. Once the new back-end solution is live, continue to monitor and optimize its performance and stability, and iterate on the codebase as needed to address any issues or add new features.

Strategy break-down:

- Planning:

    * Understand the business and technical requirements of the project.
    * Collaborate with product manager and other teams to clarify any questions or issues.
    * Determine the appropriate technology stack and tools to use, based on the requirements and constraints of the project.
    * Create a high-level plan for delivering the project in small, incremental iterations (sprints).

- Implementation:

    * Design the database schema, taking into consideration the relationships between the entities and the performance requirements of the system.
    * Implement the data models, controllers, and services for the required features (customers, wallets, transactions).
    * Write clean, well-documented code that is easy to maintain and test.
    * Configure the application for deployment, including Dockerization and testing.
  
- Evaluation and Improvement:

    * Review the implementation with the product manager and other stakeholders to ensure it meets the requirements and expectations.
    * Conduct thorough testing to ensure the system is reliable and performs well.
    * Collaborate with the QA team to identify and fix any issues.
    * Continuously monitor and measure the performance and user experience of the system, and make improvements as needed.

### How to clone and use this project
# Requirements
 1. Node.js
 2. Postgres
 3. Docker (Just in case you want to run the project in a container)

- Clone the project

    git clone

- create a .env file in the root directory of the project and add variables as shown in the .env.example file

- Install dependencies

    npm install

# Commands to apply migrations and seeds

    npm run prisma:deploy

- Run the project

    npm start:dev

- Running the docker container
    in .env change the db host from localhost to psqldb and run the following command:
    * docker-compose up

### Checking database with prisma studio

  prisma offers a GUI to view and edit data in the database,
    to use it run the following command:
    
        npm run prisma:studio


    



