resource "aws_cloudwatch_event_rule" "kenoby_rule" {
  name = "scrape-jobs-cron-kenoby"
  schedule_expression = "cron(0 15,22 * * ? *)"
}

resource "aws_cloudwatch_event_target" "kenoby_target" {
  rule = "${aws_cloudwatch_event_rule.kenoby_rule.name}"
  target_id = "kenoby_rule"
  arn = "${data.aws_lambda_function.scrape_jobs.arn}"
  input = "{ \"target\": \"Kenoby\" }"
}

resource "aws_cloudwatch_event_rule" "geekhunter_rule" {
  name = "scrape-jobs-cron-geekhunter"
  schedule_expression = "cron(0 16,23 * * ? *)"
}

resource "aws_cloudwatch_event_target" "geekhunter_target" {
  rule = "${aws_cloudwatch_event_rule.geekhunter_rule.name}"
  target_id = "geekhunter_rule"
  arn = "${data.aws_lambda_function.scrape_jobs.arn}"
  input = "{ \"target\": \"GeekHunter\" }"
}

resource "aws_cloudwatch_event_rule" "infojobs_rule" {
  name = "scrape-jobs-cron-infojobs"
  schedule_expression = "cron(0 13,20 * * ? *)"
}

resource "aws_cloudwatch_event_target" "infojobs_target" {
  rule = "${aws_cloudwatch_event_rule.infojobs_rule.name}"
  target_id = "infojobs_rule"
  arn = "${data.aws_lambda_function.scrape_jobs.arn}"
  input = "{ \"target\": \"InfoJobs\" }"
}
resource "aws_cloudwatch_event_rule" "programathor_rule" {
  name = "scrape-jobs-cron-programathor"
  schedule_expression = "cron(0 12,19 * * ? *)"
}

resource "aws_cloudwatch_event_target" "programathor_target" {
  rule = "${aws_cloudwatch_event_rule.programathor_rule.name}"
  target_id = "programathor_rule"
  arn = "${data.aws_lambda_function.scrape_jobs.arn}"
  input = "{ \"target\": \"programathor\" }"
}
resource "aws_cloudwatch_event_rule" "tramposco_rule" {
  name = "scrape-jobs-cron-tramposco"
  schedule_expression = "cron(0 14,21 * * ? *)"
}

resource "aws_cloudwatch_event_target" "tramposco_target" {
  rule = "${aws_cloudwatch_event_rule.tramposco_rule.name}"
  target_id = "tramposco_rule"
  arn = "${data.aws_lambda_function.scrape_jobs.arn}"
  input = "{ \"target\": \"Trampos.co\" }"
}
