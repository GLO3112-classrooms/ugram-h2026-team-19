.PHONY: init plan apply destroy validate fmt check clean force-plan

PLAN_FILE=terraform.plan

apply: $(PLAN_FILE)
	time terraform apply $(PLAN_FILE)

$(PLAN_FILE): force-plan

force-plan: check
	@true

check: fmt validate

fmt:
	terraform fmt -recursive

validate:
	terraform validate

plan: init
	terraform plan -out=$(PLAN_FILE)

apply-fresh:
	make clean-plan
	make apply

clean-plan:
	rm -f $(PLAN_FILE)

init:
	terraform init

destroy:
	time terraform destroy

clean: clean-plan
	rm -rf .terraform
	rm -f terraform.tfstate*
