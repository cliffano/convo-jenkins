ci: clean tools deps lint gen

clean:
	rm -rf generated/dialogflow-agent/*
	rm -rf generated/openapi-cloudfunctions-middleware/*
	rm -rf stage

deps:
	curl https://raw.githubusercontent.com/cliffano/swaggy-jenkins/master/spec/jenkins-api.yml -o specifications/openapi-jenkins.yaml

deps-local:
	cd ../convo-node && npm link
	cd ../convo-jenkins-helper && npm link
	cd ../convo-generator && npm link
	cd generated/openapi-cloudfunctions-middleware && npm link convo-node && npm link convo-jenkins-helper

tools:
	npm install -g serverless yaml-lint yo

lint:
	yamllint specifications/*.yaml

gen: gen-middleware gen-agent

deploy: deploy-middleware package-agent

destroy: destroy-middleware

gen-middleware:
	cd generated/openapi-cloudfunctions-middleware && yo convo openapi-cloudfunctions-middleware ../../conf/env.yaml ../../specifications/convo-jenkins.yaml ../../specifications/openapi-jenkins.yaml --force

deploy-middleware:
	cd generated/openapi-cloudfunctions-middleware && npm install . && serverless deploy

destroy-middleware:
	cd generated/openapi-cloudfunctions-middleware && serverless remove

gen-agent:
	cd generated/dialogflow-agent && yo convo dialogflow-agent ../../conf/env.yaml ../../specifications/convo-jenkins.yaml --force

package-agent:
	mkdir -p stage
	cd generated/dialogflow-agent && zip ../../stage/convo-jenkins-dialogflow-agent.zip -r .

.PHONY: ci clean deps deps-local tools lint gen-middleware destroy-middleware gen-agent
