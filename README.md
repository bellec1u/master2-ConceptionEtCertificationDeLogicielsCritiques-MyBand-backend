# master2-ConceptionEtCertificationDeLogicielsCritiques-MyBand-backend
## Team :
 - Léopold BELLEC
 - Karim DJENKAL

## Initial configuration
Installing the package manager :
```
$ npm install -g npm@latest
$ npm install -g yarn
$ ng set —global packageManager=yarn
```

## Install dependencies
This project is based on [nw-school-back](https://github.com/njl07/nwt-school-back) and use [Hapiness framework](https://github.com/hapinessjs/hapiness).
For a complete installation, use the following command at the root of the project :
```
$ yarn install
```

## Project settings
All the different server configuration parameters are contained in `config/default.yml`.

### Server configuration
```
server:
  host: 0.0.0.0   // server host
  port: 4443      // server port
```

### Data base configuration
The project uses a Mongo database.

[How to install MongoDB](https://docs.mongodb.com/manual/administration/install-community/).

```
mongodb:
  host: 0.0.0.0   // data base host
  port: 27017     // data base port (basic value chosen by Mongo)
  db: mybanddb    // name of the data base
```
Before starting the project, you need to create, in MongoDB, the database with the same name that you gave in the file `config/default.yml`.

## Launch server 
```
$ yarn run dev:watch
```
