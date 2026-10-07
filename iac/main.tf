# iac/main.tf
terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Servidor automático para la API REST de CandyMore
resource "aws_instance" "candymore_backend" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu Server
  instance_type = "t2.micro"

  tags = {
    Name        = "CandyMore-Backend-Server"
    Environment = "Production"
    Project     = "CandyMore"
  }
}

output "backend_public_ip" {
  description = "IP pública del servidor de aplicaciones de CandyMore"
  value       = aws_instance.candymore_backend.public_ip
}