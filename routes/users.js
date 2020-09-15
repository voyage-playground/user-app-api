var express = require('express');
var faker = require('faker');
var lodash = require('lodash');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  const queryParams = req.query || {};
  const records = 1000;
  const limit = queryParams.limit || 1000;
  const parseLimit = parseInt(limit, 10);
  const totalPages = records / parseLimit;
  const pageToDisplay = queryParams.page || 1;
  const parsePage = parseInt(pageToDisplay, 10);
  const sortByColumn = queryParams.sortBy;
  const direction = queryParams.direction;

  const sizeArr = [...Array(records).keys()];

  let data = sizeArr.map((_, i) => ({
    id: i,
    name: faker.name.findName(),
    email: faker.internet.email(),
    company: faker.company.companyName(),
    avatar: faker.image.avatar(),
  }));

  if (sortByColumn) {
    data = lodash.sortBy(data, sortByColumn);
  }

  if (direction === 'desc') {
    data = data.reverse();
  }

  const startOffset = parsePage > 1 ? parsePage * parseLimit - 1 : 0;
  const endOffset = startOffset + parseLimit;

  const sliceData = data.slice(startOffset, endOffset);

  res.json({
    data: sliceData,
    ...(req.query && {
      pagination: {
        current: parsePage,
        total: Math.round(totalPages),
        limit: parseLimit,
      },
    }),
  });
});

module.exports = router;
