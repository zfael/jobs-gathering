data "aws_lambda_function" "scrape_jobs" {
  function_name = "${var.lambda_name}-${var.environment}-scrape-jobs"
}
