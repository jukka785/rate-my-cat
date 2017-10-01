var faker = require("faker");

var data = {
  users: [],
  comments: [],
  cats: []
};

var numUsers = 3;
var numComments = 10;
var numCats = 6;

// generate random users
for (var i = 0; i < numUsers; i++) {
  data.users.push({
    username: faker.internet.userName(),
    password: "1234"
  });
}

// generate random cats
for (var i = 0; i < numCats; i++) {
  data.cats.push({
    name: faker.name.firstName(),
    image: faker.image.imageUrl(),
    description: faker.lorem.paragraph(),
    author: randomEntry(data.users).username
  });
}

// generate random comments
for (var i = 0; i < numComments; i++) {
  data.comments.push({
    text: faker.lorem.paragraph(),
    author: randomEntry(data.users).username,
    cat: randomEntry(data.cats).name
  });
}

function randomEntry(array) {
  return array[~~(Math.random() * array.length)];
}

module.exports = data;
