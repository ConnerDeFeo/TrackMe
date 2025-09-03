// Private subnets
resource "aws_subnet" "private_subnet1" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.private_subnet_cidr[0]
  availability_zone       = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "trackme-private-subnet-1"
    type = "private"
  }
}
resource "aws_subnet" "private_subnet2" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.private_subnet_cidr[1]
  availability_zone       = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "trackme-private-subnet-2"
    type = "private"
  }
}

resource "aws_db_subnet_group" "rds_private" {
  name       = "trackme-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet1.id, aws_subnet.private_subnet2.id]

  tags = {
    Name = "trackme-db-subnet-group"
  }
}

// RDS instance
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

resource "aws_instance" "rds_viewer"{
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t4g.nano"
  subnet_id     = aws_subnet.private_subnet1.id
  iam_instance_profile = aws_iam_instance_profile.ssm_role.name

  tags = {
    Name = "RDS Viewer"
  }
}