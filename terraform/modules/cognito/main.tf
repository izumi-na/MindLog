resource "aws_cognito_user_pool" "main" {
  name = format("%s-%s-user-pool", var.env, var.project)

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }

  username_attributes = ["email"]

  auto_verified_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  deletion_protection = var.env == "prd" ? "ACTIVE" : "INACTIVE"

  // TODO:ログイン用URLを追記する
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "MindLog - メールアドレスの確認"
    email_message        = <<-EOF
MindLogへようこそ！

以下の確認コードを入力してメールアドレスを確認してください。

確認コード: {####}
EOF
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name = format("%s-%s-user-pool-client", var.env, var.project)

  user_pool_id        = aws_cognito_user_pool.main.id
  generate_secret     = false
  explicit_auth_flows = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH", "ALLOW_USER_PASSWORD_AUTH"]

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30
}
