module "cognito" {
  source = "../../modules/cognito"

  project = var.project
  env     = var.env
}

module "iam" {
  source = "../../modules/iam"

  project = var.project
  env     = var.env
}