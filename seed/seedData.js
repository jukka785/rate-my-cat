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

// generate random comments
for (var i = 0; i < numComments; i++) {
  data.comments.push({
    text: faker.lorem.paragraph()
  });
}

// generate random cats
for (var i = 0; i < numCats; i++) {
  data.cats.push({
    name: faker.name.firstName(),
    age: faker.random.number({ min: 1, max: 20}),
    image: faker.image.imageUrl(),
    description: faker.lorem.paragraph()
  });
}

module.exports = data;
