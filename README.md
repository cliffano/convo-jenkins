<img align="right" src="https://raw.github.com/cliffano/convo-jenkins/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://img.shields.io/travis/cliffano/convo-jenkins.svg)](http://travis-ci.org/cliffano/convo-jenkins)

Convo Jenkins
-------------

Convo Jenkins is a [Convo](https://github.com/cliffano/convo-jenkins) agent and middleware for [Jenkins](https://jenkins.io/).

The middleware will be deployed to [GCP Cloud Functions](https://cloud.google.com/functions/), the agent needs to be imported into [Dialogflow agent](https://dialogflow.com/docs/agents). They will then be integrated with Jenkins, voice devices and/or messaging applications.

[![Architecture Diagram](https://raw.github.com/cliffano/convo-jenkins/master/docs/architecture.jpg)](https://raw.github.com/cliffano/convo-jenkins/master/docs/architecture.jpg)

Install
-------

Install required tools:

    make tools

Install dependencies:

    make deps

Usage
-----

1. [Create a CloudFunctions project](https://cloud.google.com/functions/docs/quickstart-console)
2. [Create a Dialogflow project](https://developers.google.com/actions/dialogflow/project-agent)
3. Set Convo Jenkins environment configuration
4. Generate Convo Jenkins agent and middleware using command `make gen`
5. Deploy Convo Jenkins middleware using command `make deploy`
6. Because Jenkins agent deployment hasn't been automated, manually import `stage/convo-jenkins-dialogflow-agent.zip` to your Dialogflow project
7. Integrate your Dialogflow project with any device/application you have
8. Talk to Jenkins

Configuration
-------------

Modify environment configuration file at `conf/env.yaml` to suit your environment.

| Property | Description |
|----------|-------------|
| convo.token | Token used for linking the Dialogflow agent with the CloudFunctions middleware |
| cloudfunctions.url | The URL of your GCP CloudFunctions project |
| openapi.url | Jenkins URL |
| openapi.username | Username of a the Jenkins user you'd like to use as service account |
| openapi.password | Password of the above Jenkins user |

Colophon
--------

Related Projects:

* [Convo](http://github.com/cliffano/convo) - Specification based voice and text conversation app
* [Convo Generator](http://github.com/cliffano/convo-generator) - Convo agent and middleware generator
* [convo-node](http://github.com/cliffano/convo-node) - node.js utility module for Convo
* [Convo Jenkins Helper](http://github.com/cliffano/convo-jenkins-helper) - Helper node.js module for Convo Jenkins
* [Swaggy Jenkins](https://github.com/cliffano/swaggy-jenkins) - A set of Jenkins API clients in multiple languages
* [Convo ipify](http://github.com/cliffano/convo-ipify) - Convo agent and middleware for ipify
