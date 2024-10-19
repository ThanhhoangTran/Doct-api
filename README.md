# How to run application with docker

- Create new file <code>.env</code> for environment with body:

  ```
  PORT=3000
  DATABASE_URL=postgres://postgres:hoang@1234@localhost:5432/doct-db
  REDIS_URL=
  APP_ENV=
  ```

- Run docker-compose file to start services:
  `docker-compose up`
  
