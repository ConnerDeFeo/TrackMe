# Private subnet 1
resource "aws_subnet" "private_subnet1" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.private_subnet_cidr[0]
  availability_zone       = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "trackme-private-subnet-1"
    type = "private"
  }
}
# Private subnet 2
resource "aws_subnet" "private_subnet2" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.private_subnet_cidr[1]
  availability_zone       = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "trackme-private-subnet-2"
    type = "private"
  }
}

# Private subnet group for RDS instance
resource "aws_db_subnet_group" "rds_private" {
  name       = "trackme-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet1.id, aws_subnet.private_subnet2.id]

  tags = {
    Name = "trackme-db-subnet-group"
  }
}

# RDS instance for TrackMe application
resource "aws_db_instance" "default" {
  identifier           = "trackmedb"
  engine               = "postgres"
  engine_version       = "17.5"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  username             = "trackme_admin"
  password             = var.db_password
  db_name              = "trackme"

  db_subnet_group_name = aws_db_subnet_group.rds_private.name
  skip_final_snapshot  = true
}

# S3 bucket for profile pictures
resource "aws_s3_bucket" "profile_pictures" {
  bucket = "trackme-profile-pictures"

  tags = {
    Name = "trackme-profile-pictures"
  }
}

# Publicly allow S3 read access to the profile pictures bucket
resource "aws_s3_bucket_policy" "profile_pictures_policy" {
  bucket = aws_s3_bucket.profile_pictures.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = ["s3:GetObject"]
        Resource = "${aws_s3_bucket.profile_pictures.arn}/*"
      }
    ]
  })
}

# s3 vcp endpoint to allow lambda access to s3 within vpc
resource "aws_vpc_endpoint" "s3_endpoint" {
  vpc_id            = data.aws_vpc.default.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"

  route_table_ids = [data.aws_vpc.default.main_route_table_id]

  tags = {
    Name = "trackme-s3-endpoint"
  }
}