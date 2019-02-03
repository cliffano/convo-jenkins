ci: clean tools deps lint gen package-agent

build-local: clean deps-local gen deps-local deploy

clean:
	rm -rf generated/dialogflow-agent/*
	rm -rf generated/openapi-cloudfunctions-middleware/*
	rm -rf stage

deps:
	curl https://raw.githubusercontent.com/cliffano/swaggy-jenkins/master/spec/jenkins-api.yml -o specifications/openapi-jenkins.yaml
	npm install convo-node@0.0.3 convo-jenkins-helper@0.0.2 generator-convo@0.0.3

deps-local:
	cd ../convo-node && npm link
	cd ../convo-jenkins-helper && npm link
	cd ../convo-generator && npm link
	cd generated/openapi-cloudfunctions-middleware && \
		npm link convo-node && \
		npm link convo-jenkins-helper && \
		npm link generator-convo

tools:
	npm install -g dialogflow-cli@1.0.4 serverless@1.30.3 yaml-lint@1.2.4 yo@2.0.5

lint:
	yamllint specifications/*.yaml

gen: gen-middleware gen-agent

deploy: deploy-middleware deploy-agent

destroy: destroy-middleware

gen-middleware:
	cd generated/openapi-cloudfunctions-middleware && \
		yo convo openapi-cloudfunctions-middleware ../../conf/env.yaml ../../specifications/convo-jenkins.yaml ../../specifications/openapi-jenkins.yaml --force && \
		npm install .

deploy-middleware:
	cd generated/openapi-cloudfunctions-middleware && serverless deploy

destroy-middleware:
	cd generated/openapi-cloudfunctions-middleware && serverless remove

gen-agent:
	cd generated/dialogflow-agent && yo convo dialogflow-agent ../../conf/env.yaml ../../specifications/convo-jenkins.yaml --force

deploy-agent:
	dialogflow-cli import --credentials ./conf/credentials.json generated/dialogflow-agent/

package-agent:
	mkdir -p stage
	cd generated/dialogflow-agent && zip ../../stage/convo-jenkins-dialogflow-agent.zip -r .

.PHONY: ci build-local clean deps deps-local tools lint gen deploy destroy gen-middleware deploy-middleware destroy-middleware gen-agent package-agent deploy-agent
