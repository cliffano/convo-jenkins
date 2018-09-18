
'use strict';

const convo = require('convo-node');
const jenkinsClient = require('swaggy-jenkins');
let textRenderer = new convo.TextRenderer();

const jenkinsHelper = require('convo-jenkins-helper');


let apis = {};

const remoteAccessApi = new jenkinsClient.RemoteAccessApi();
remoteAccessApi.apiClient.basePath = 'http://overwrite-me-jenkins-url:8080';
apis.remoteAccessApi = remoteAccessApi;

const blueOceanApi = new jenkinsClient.BlueOceanApi();
blueOceanApi.apiClient.basePath = 'http://overwrite-me-jenkins-url:8080';
apis.blueOceanApi = blueOceanApi;


const jenkinsInstance = jenkinsClient.ApiClient.instance;

let jenkinsAuth = jenkinsInstance.authentications['jenkins_auth'];
jenkinsAuth.username = 'overwrite-me-jenkins-username';
jenkinsAuth.password = 'overwrite-me-jenkins-password';


function handleRequest(agent, request, response) {

  // Create a callback for handling error.
  // This callback logs an error message and then responds with a reply payload containing the error message.
  function createErrorCallback(done) {
    return function(replyText) {
      replyText = textRenderer.renderText(replyText);
      console.error('Sending reply with error message: ' + replyText);
      const replyPayload = agent.payload.createReply(replyText);
      done(null, replyPayload);
    };
  }

  // Create a callback for handling API call result.
  // The callback signature with error, data, and response is defined by OpenAPI Generator.
  function createApiCallback(replyText, done) {
    return function(err, data, _response) {
      console.log('Payload from API service: ', data);
      console.log('With response headers: ', _response.headers);
      textRenderer.addParams({ data: data, headers: _response.headers });
      if (err) {
        createErrorCallback(done)(err.message);
      } else {
        replyText = textRenderer.renderText(replyText);
        console.info('Sending reply with success message: ' + replyText);
        const replyPayload = agent.payload.createReply(replyText);
        done(null, replyPayload);
      }
    };
  }

  // Call API method using a Convo Helper if it has a callApi function,
  // otherwise the API will be called directly without Convo Helper by mapping
  // the query to the operation ID.
  function callApi(api, method, params, replyText, opts, done) {
    const apiCb = createApiCallback(replyText, done);
    let args = [];
    
      if (jenkinsHelper.textHelpers) {
        textRenderer.addParams(jenkinsHelper.textHelpers);
      }
      if (jenkinsHelper.callApi) {
        let errorCb = createErrorCallback(done);
        console.info('Using Convo Helper: %s', jenkinsHelper.getInfo());
        jenkinsHelper.callApi(api, method, params, apiCb, errorCb, opts);
      } else {
        args.push(apiCb);
        api[method](...args);
      }
    
  }

  // Callback for handling HTTP request.
  // It receives the payload from Convo Agent, the payload details will then be matched to the queries
  // defined in Convo specification. An API call will then be made to the OpenAPI service, which response
  // will then be used to construct the reply back to the Agent.
  function httpCallback(done) {

    if (request.headers['convo-token'] !== 'overwrite-me-convo-token') {
      createErrorCallback(done)('Invalid Convo token: ' + request.headers['convo-token']);
    } else {

      const queryName = agent.payload.getQueryName(request.body);
      const queryLanguage = agent.payload.getQueryLanguage(request.body);
      const queryParams = agent.payload.getQueryParams(request.body);

      console.info('Receiving query: %s, using language: %s', queryName, queryLanguage);
      console.log('Payload from agent: ', request.body);

      textRenderer.addParams(queryParams);

      let convoOpts = {
        apis: apis,
        queryName: queryName,
        queryLanguage: queryLanguage
      };

      switch (queryName) {
      
        case 'Find out current version':
          switch (queryLanguage) {
          
            case 'en':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'headJenkins');
              callApi(remoteAccessApi, 'headJenkins', queryParams, 'I am on version {{headers.x-jenkins}}', convoOpts, done);
              break;
          
            case 'en-au':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'headJenkins');
              callApi(remoteAccessApi, 'headJenkins', queryParams, 'I am on version {{headers.x-jenkins}}', convoOpts, done);
              break;
          
            case 'de':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'headJenkins');
              callApi(remoteAccessApi, 'headJenkins', queryParams, 'Ich bin auf Version {{headers.x-jenkins}}', convoOpts, done);
              break;
          
            case 'id':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'headJenkins');
              callApi(remoteAccessApi, 'headJenkins', queryParams, 'Saya sekarang menggunakan versi {{headers.x-jenkins}}', convoOpts, done);
              break;
          
            case 'ja':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'headJenkins');
              callApi(remoteAccessApi, 'headJenkins', queryParams, '私の現在のバージョンは{{headers.x-jenkins}}です', convoOpts, done);
              break;
          
            default:
              createErrorCallback(done)('Unsupported reply language: ' + queryLanguage);
          }
          break;
      
        case 'Find out how many executors':
          switch (queryLanguage) {
          
            case 'en':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'getComputer');
              callApi(remoteAccessApi, 'getComputer', queryParams, 'I have {{data.totalExecutors}} executors', convoOpts, done);
              break;
          
            case 'en-au':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'getComputer');
              callApi(remoteAccessApi, 'getComputer', queryParams, 'I have {{data.totalExecutors}} executors', convoOpts, done);
              break;
          
            default:
              createErrorCallback(done)('Unsupported reply language: ' + queryLanguage);
          }
          break;
      
        case 'Find out how many busy executors':
          switch (queryLanguage) {
          
            case 'en':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'getComputer');
              callApi(remoteAccessApi, 'getComputer', queryParams, 'I have {{data.busyExecutors}} executors', convoOpts, done);
              break;
          
            case 'en-au':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'getComputer');
              callApi(remoteAccessApi, 'getComputer', queryParams, 'I have {{data.busyExecutors}} executors', convoOpts, done);
              break;
          
            default:
              createErrorCallback(done)('Unsupported reply language: ' + queryLanguage);
          }
          break;
      
        case 'Find out how many queued jobs':
          switch (queryLanguage) {
          
            case 'en':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'getQueue');
              callApi(remoteAccessApi, 'getQueue', queryParams, 'I have {{count(data.items)}} jobs in the queue', convoOpts, done);
              break;
          
            case 'en-au':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'getQueue');
              callApi(remoteAccessApi, 'getQueue', queryParams, 'I have {{count(data.items)}} jobs in the queue', convoOpts, done);
              break;
          
            default:
              createErrorCallback(done)('Unsupported reply language: ' + queryLanguage);
          }
          break;
      
        case 'Build job':
          switch (queryLanguage) {
          
            case 'en':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'postJobBuild');
              callApi(remoteAccessApi, 'postJobBuild', queryParams, 'Job {{jobName}} has been added to the queue.', convoOpts, done);
              break;
          
            case 'en-au':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'postJobBuild');
              callApi(remoteAccessApi, 'postJobBuild', queryParams, 'Job {{jobName}} has been added to the queue.', convoOpts, done);
              break;
          
            case 'de':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'postJobBuild');
              callApi(remoteAccessApi, 'postJobBuild', queryParams, 'Job {{jobName}} wurde hinzugefugt.', convoOpts, done);
              break;
          
            case 'id':
              console.info('Calling API: %s, with method: %s', 'remoteAccessApi', 'postJobBuild');
              callApi(remoteAccessApi, 'postJobBuild', queryParams, 'Pekerjaan {{jobName}} sudah ditambahkan ke antrian.', convoOpts, done);
              break;
          
            default:
              createErrorCallback(done)('Unsupported reply language: ' + queryLanguage);
          }
          break;
      
        default:
          createErrorCallback(done)('Unsupported query: ' + queryName);
      }
    }
  }

  agent.http.handleRequest(request, response, httpCallback);
}

// Declare all Convo Agent-specific endpoint(s) here.
// Agent payload and http processing methods should be implemented in convo-node.
exports.dialogflow = (request, response) => {
  handleRequest(convo.dialogFlow, request, response);
};
