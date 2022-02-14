const users = {};

const respondJSON = (request, response, status, object, type) => {
    const headers = {
        'Content-Type': type,
    }

    response.writeHead(status, headers);
    response.write(object);
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

const getUsers = (request, response) => {
    const responseJSON = {
      users,
    };
  
    respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
}

const addUser = (request, response, body) => {
    //default json message
    const responseJSON = {
      message: 'Name and age are both required.',
    };
  
    //check to make sure we have both fields
    //We might want more validation than just checking if they exist
    //This could easily be abused with invalid types (such as booleans, numbers, etc)
    //If either are missing, send back an error message as a 400 badRequest
    if (!body.name || !body.age) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
  
    //default status code to 204 updated
    let responseCode = 204;
  
    //If the user doesn't exist yet
    if(!users[body.name]) {
      
      //Set the status code to 201 (created) and create an empty user
      responseCode = 201;
      users[body.name] = {};
    }
  
    //add or update fields for this user name
    users[body.name].name = body.name;
    users[body.name].age = body.age;
  
    //if response is created, then set our created message
    //and sent response with a message
    if (responseCode === 201) {
      responseJSON.message = 'Created Successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }
    // 204 has an empty payload, just a success
    // It cannot have a body, so we just send a 204 without a message
    // 204 will not alter the browser in any way!!!
    return respondJSONMeta(request, response, responseCode);
};

module.exports = {
    getUsers,
    getUsersMeta,
    addUser,
}