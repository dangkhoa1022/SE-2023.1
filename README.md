# SE-2023.1

# Note
Do tất cả đang sử dụng remote database nên khi có thay đổi database (model, data) thì mọi người cẩn thận do có thể ảnh hưởng đến database của người khác đang sử dụng

# Set up database
- Install `Mongo Compass`: https://www.mongodb.com/try/download/shell
- Connect to database url: `mongodb+srv://dangphuckhoa2003:22102003@laptopstore.1h30oun.mongodb.net/test` to connect to remote database

# How to run project
- Run `npm i` to install all dependencies for project
- Run `npm start` to run project at `localhost:8000`


# Project technologies
- Using `NodeJS (ExpressJS)` for BE
- Using `JavaSript, Pug, Bootstrap v4` for FE
- Using `MongoDB , Mongoose` for Database
- Using MVC model

# Project Structure
## FE
- `./views` contain .pug files for UI
- `./public/css` contain css file for UI
- `./public/js` contain javascript file for Front-End
- `./public/laptop` contain image used in UI

## BE
- `./models` contain database schema
- `./data` contain data in JSON file and command to import to database
- `./routes` define route for web
- `./controllers` contain controllers to handle logic between BE and database
- `./utils` contain utilities 

## Database
- `./data/laptop.json`: contains all data of laptop in JSON format
- `./data/store.json`: contains all data of store in JSON format
- `./data/importData.mjs`: contains code to import laptop data from JSON file to MongoDB database

## How to update laptop data in database
- Update data in `./data/laptop.json`
- Add/Update images for updated/new laptop in `./public/laptop`
- Cd to `root` folder
- Run `npm import-laptop` at `root` folder to clear laptop data in database and import new laptop data from `laptop.json` to database


