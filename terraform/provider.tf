provider "aws" {
  region = "us-east-1"
}

variable "aws_account_id" {
  description = "The AWS account ID"
  default     = "643600054334"
}
