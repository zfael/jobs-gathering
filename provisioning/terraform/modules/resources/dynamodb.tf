locals {
  jobsTable = "jobs_${var.environment}"
}

resource "aws_dynamodb_table" "jobs" {
  name           = "${local.jobsTable}"
  hash_key       = "url"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 1

  attribute {
    name = "url"
    type = "S"
  }

  attribute {
    name = "source"
    type = "S"
  }

  attribute {
    name = "creationTime"
    type = "N"
  }

  global_secondary_index {
    name               = "sourceIndex"
    hash_key           = "source"
    range_key          = "creationTime"
    projection_type    = "INCLUDE"
    non_key_attributes = ["url", "creationTime", "title", "snippet"]

    read_capacity  = 20
    write_capacity = 1
  }

  ttl {
    attribute_name = "expirationTime"
    enabled        = true
  }
}
