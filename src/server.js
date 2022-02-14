const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const { parse } = require('path');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Object to route requests
const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/getUsers': jsonHandler.getUsers,
        notFound: jsonHandler.notFound,
    },
    HEAD: {
        '/getUsers': jsonHandler.getUsersMeta,
        notFound: jsonHandler.notFoundMeta,
    },
};

// onRequest function to handle requests
const onRequest = (request, response) => {
    // parse the url using the url module
    const parsedUrl = url.parse(request.url);
    
    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    } else if (request.method === 'GET' || request.method === 'HEAD') {
        // check if the path name (the /name part of the url) matches
        // any in our url object. If so call that function. If not, default to index.
        if (urlStruct[parsedUrl.pathname]) {
            urlStruct[parsedUrl.pathname](request, response, params, acceptedTypes);
        } else {
            // otherwise send them to the index (normally this would be the 404 page)
            urlStruct.index(request, response, params, acceptedTypes);
        }
    }
};

const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {
        const body = [];

        request.on('error', (e) => {
            response.statusCode = 400;
            response.end();
        });

        request.on('data', (chunk) => {
            body.push(chunk);
        });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);

            jsonHandler.addUser(request, response, bodyParams);
        });
    }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);