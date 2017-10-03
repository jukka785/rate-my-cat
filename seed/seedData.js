var faker = require("faker");

var data = {
  users: [],
  comments: [],
  cats: [],
  ratings: []
};

var numUsers = 3;
var numComments = 60;
var numCats = 20;
var numRatings = 100;

function randomBetween(min, max) {
  return ~~(Math.random() * (max-min)) + min;
}

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

// generate random ratings
for (var i = 0; i < numRatings; i++) {
  data.ratings.push({
    rating: randomBetween(2, 5)
  });
}

module.exports = data;
