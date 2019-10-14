locals {
  jobsTable = "jobs_${var.environment}"
}

resource "aws_dynamodb_table" "jobs" {
  name           = "${local.jobsTable}"
  hash_key       = "url"
  range_key      = "creationTime"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 1

  attribute {
    name = "url"
    type = "S"
  }

  attribute {
    name = "creationTime"
    type = "N"
  }

  ttl {
    attribute_name = "expirationTime"
    enabled        = true
  }
}
