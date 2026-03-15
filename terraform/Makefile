.PHONY: init plan apply destroy validate fmt check clean

PLAN_FILE=terraform.plan

init:
	terraform init

$(PLAN_FILE): plan

plan:
	terraform plan -out=$(PLAN_FILE)

apply: $(PLAN_FILE)
	terraform apply $(PLAN_FILE)

destroy:
	terraform destroy

validate:
	terraform validate

fmt:
	terraform fmt -recursive

check: fmt validate plan

clean:
	rm -rf .terraform
	rm -f terraform.tfstate* $(PLAN_FILE)
