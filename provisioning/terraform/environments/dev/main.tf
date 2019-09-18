locals {
  profile = "jobeer"
  region  = "us-east-1"
}

provider "aws" {
  version = "~> 2.6.0"
  profile = "${local.profile}"
}

module "resources" {
  source = "../../modules/resources"

  region      = "${local.region}"
  environment = "dev"
}
