ci: clean tools deps lint gen package

# deps-local is called twice here because the first one is needed to generate the agent and middleware
# while the second one is used for overwriting the node modules resolved from the generated middleware
gen-local: clean deps-local gen deps-local deploy

clean:
	rm -rf generated/dialogflow-agent/* \
		generated/openapi-cloudfunctions-middleware/* \
		stage/

stage:
	mkdir -p generated/dialogflow-agent/ \
		generated/openapi-cloudfunctions-middleware/ \
		stage/

deps:
	curl https://raw.githubusercontent.com/cliffano/swaggy-jenkins/master/spec/jenkins-api.yml -o specifications/openapi-jenkins.yaml
	npm install convo-node@0.0.3 convo-jenkins-helper@0.0.2 generator-convo@0.0.4

deps-local: stage
	cd ../convo-node && npm link
	cd ../convo-jenkins-helper && npm link
	cd ../convo-generator && npm link
	npm link convo-node
	npm link convo-jenkins-helper
	npm link generator-convo
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

package: package-agent

destroy: destroy-middleware

gen-middleware: stage
	cd generated/openapi-cloudfunctions-middleware && \
		yo convo openapi-cloudfunctions-middleware ../../conf/env.yaml ../../specifications/convo-jenkins.yaml ../../specifications/openapi-jenkins.yaml --force && \
		npm install .

deploy-middleware:
	cd generated/openapi-cloudfunctions-middleware && serverless deploy

destroy-middleware:
	cd generated/openapi-cloudfunctions-middleware && serverless remove

gen-agent: stage
	cd generated/dialogflow-agent && yo convo dialogflow-agent ../../conf/env.yaml ../../specifications/convo-jenkins.yaml --force

deploy-agent:
	dialogflow-cli import --credentials ./conf/credentials.json generated/dialogflow-agent/

package-agent: stage
	cd generated/dialogflow-agent && zip ../../stage/convo-jenkins-dialogflow-agent.zip -r .

.PHONY: ci gen-local clean stage deps deps-local tools lint gen deploy package destroy gen-middleware deploy-middleware destroy-middleware gen-agent deploy-agent package-agent
