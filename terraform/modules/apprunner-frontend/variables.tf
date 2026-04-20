variable "service_name" {}
variable "image" {}
variable "env" {
  type = map(string)
}
variable "subnet_ids" {
  type = list(string)
}

variable "sg_id" {}