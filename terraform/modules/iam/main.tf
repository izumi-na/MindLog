data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_ssm_parameter" "api_gateway_id" {
    name = "/${var.project}/${var.env}/api-gateway-id"
  }

// バックエンドデプロイ用ロール
resource "aws_iam_role" "backend_deploy_role" {
  name = format("%s-%s-backend-deploy-role", var.env, var.project)

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:izumi-na/MindLog:*"
          }
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
        }
      },
    ]
  })
}
// バックエンドデプロイ用ポリシー
resource "aws_iam_role_policy" "backend_deploy_policy" {
  name = format("%s-%s-backend-deploy-policy", var.env, var.project)
  role = aws_iam_role.backend_deploy_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "cloudformation:*",
        ]
        Effect   = "Allow"
        Resource = [
            "arn:aws:cloudformation:${data.aws_region.current.id}:${data.aws_caller_identity.current.account_id}:stack/${var.env}-test-${var.project}-*",
            "arn:aws:cloudformation:ap-northeast-1:aws:transform/Serverless-2016-10-31"
        ]
      },
       {
        Action = [
          "lambda:*",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:lambda:${data.aws_region.current.id}:${data.aws_caller_identity.current.account_id}:function:${var.env}-${var.project}-*"
      },
       {
        Action = [
          "apigateway:*",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:apigateway:${data.aws_region.current.id}::/restapis/${data.aws_ssm_parameter.api_gateway_id.value}/*"
      },
      {
        Action = [
          "dynamodb:*",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:${data.aws_region.current.id}:${data.aws_caller_identity.current.account_id}:table/${var.env}-${var.project}-*"
      },
      {
        Action = [
          "s3:*",
        ]
        Effect   = "Allow"
        Resource = [
            "arn:aws:s3:::${var.env}-test-${var.project}-sam-artifacts",
            "arn:aws:s3:::${var.env}-test-${var.project}-sam-artifacts/*"
        ]
      },
      {
        Action = [
            "ssm:GetParameter",
            "ssm:PutParameter",
            ]
            Effect   = "Allow"
            Resource = "arn:aws:ssm:${data.aws_region.current.id}:${data.aws_caller_identity.current.account_id}:parameter/${var.project}/${var.env}/*"
      }
    ]
  })
}

// terraformデプロイ用ロール
resource "aws_iam_role" "terraform_deploy_role" {
  name = format("%s-%s-terraform-deploy-role", var.env, var.project)

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:izumi-na/MindLog:*"
          }
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
        }
      },
    ]
  })
}
// terraformデプロイ用ポリシー
resource "aws_iam_role_policy" "terraform_deploy_policy" {
  name = format("%s-%s-terraform-deploy-policy", var.env, var.project)
  role = aws_iam_role.terraform_deploy_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "cognito-idp:CreateUserPool",
          "cognito-idp:DeleteUserPool",
          "cognito-idp:DescribeUserPool",
          "cognito-idp:UpdateUserPool",
          "cognito-idp:CreateUserPoolClient",
          "cognito-idp:DeleteUserPoolClient",
          "cognito-idp:DescribeUserPoolClient",
          "cognito-idp:UpdateUserPoolClient",
          "cognito-idp:TagResource",
          "cognito-idp:UntagResource",
          "cognito-idp:ListUserPools"
        ]
        Effect   = "Allow"
        Resource = ["*"]
      },
       {
        Action = [
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:GetRole",
          "iam:UpdateRole",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:GetRolePolicy",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListRolePolicies",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:PassRole"
        ]
        Effect   = "Allow"
        Resource = ["*"]
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
          ]
          Effect = "Allow"
          Resource = [
            "arn:aws:s3:::${var.env}-test-${var.project}-tfstate",
            "arn:aws:s3:::${var.env}-test-${var.project}-tfstate/*"
          ]
      }
    ]
  })
}