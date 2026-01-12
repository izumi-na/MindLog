module "cognito" {
  source = "../../modules/cognito"

  project = var.project
  env     = var.env
}