require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');
const { getEventDetail } = require('./services');
const moment = require('moment');
const { getRaceTitleAndDescription, replaceOpenGraphTagsContent } = require('./helpers');

const defaultOpenGraphImage = '/hero-homepage-3.jpg';
const defaultTitle = "SYRF - The home of sailing.";
const defaultDescription = "Sailing Yacht Research Foundation";
const buildPath = process.env.BUILD_FOLDER_PATH;
const defaultUrl = process.env.SITE_URL;

app.get('/', function (request, response) {
  const filePath = path.resolve(__dirname, buildPath, 'index.html');
  // read in the index.html file
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    result = replaceOpenGraphTagsContent(
      defaultTitle,
      defaultDescription,
      defaultUrl,
      defaultOpenGraphImage,
      data
    );

    response.send(result);
  });
});

app.get('/about', function (request, response) {
  const filePath = path.resolve(__dirname, buildPath, 'index.html');

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    result = replaceOpenGraphTagsContent(
      'SYRF - About',
      'The Science Behind Sailboat Performance',
      defaultUrl + request.url,
      defaultOpenGraphImage,
      data
    );

    response.send(result);
  });
});

app.get('/events/:eventId', function (request, response) {
  const filePath = path.resolve(__dirname, buildPath, 'index.html');
  let eventData;

  fs.readFile(filePath, 'utf8',async function (err, data) {
    if (err) {
      return console.log(err);
    }
    
    try {
      eventData = await getEventDetail(request.params?.eventId);
    } catch(e) {
      console.error(e);
    }

    result = replaceOpenGraphTagsContent(
      eventData.name ? eventData.name : defaultTitle,
      eventData.description ? [eventData.description, moment(eventData.approximateStartTime).format('MMM. D, YYYY [at] h:mm A z'), eventData.approximateStartTime_zone].join(', ')  : defaultDescription,
      defaultUrl + request.url,
      eventData.openGraphImage ?? defaultOpenGraphImage,
      data
    );

    response.send(result);
  });
});

app.get('/playback', async function (request, response) {
  let raceDescription;
  const filePath = path.resolve(__dirname, buildPath, 'index.html');

  try {
    raceDescription = await getRaceTitleAndDescription(request.query.raceId);
  } catch (e) {
    console.error(e);
  }

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    result = replaceOpenGraphTagsContent(
      raceDescription.title ?? 'SYRF - Playback',
      raceDescription.description ?? 'Replay races in the sailing world.',
      defaultUrl + request.url,
      defaultOpenGraphImage,
      data
    );

    response.send(result);
  });
});

app.use(express.static(path.resolve(__dirname, buildPath)));

app.get('*', function (request, response) {
  const filePath = path.resolve(__dirname, buildPath, 'index.html');
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    // replace the special strings with server generated strings
    result = replaceOpenGraphTagsContent(
      defaultTitle,
      defaultDescription,
      defaultUrl,
      defaultOpenGraphImage,
      data
    );

    response.send(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));