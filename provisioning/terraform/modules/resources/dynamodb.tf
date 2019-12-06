locals {
  jobsTable   = "jobs_${var.environment}"
  jobIdsTable = "job_ids_${var.environment}"
}

resource "aws_dynamodb_table" "jobs" {
  name           = "${local.jobsTable}"
  hash_key       = "url"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
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
    name            = "sourceIndex"
    hash_key        = "source"
    range_key       = "creationTime"
    read_capacity   = 20
    write_capacity  = 1
    projection_type = "INCLUDE"

    non_key_attributes = [
      "snippet",
      "url",
      "creationTime",
      "title",
      "shareLink"
    ]
  }

  ttl {
    attribute_name = "expirationTime"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "job_ids" {
  name           = "${local.jobIdsTable}"
  hash_key       = "id"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 1

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "url"
    type = "S"
  }

  global_secondary_index {
    name            = "urlIndex"
    hash_key        = "url"
    read_capacity   = 10
    write_capacity  = 1
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "expirationTime"
    enabled        = true
  }
}
