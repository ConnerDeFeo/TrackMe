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

resource "null_resource" "setup_rds_table" {
  depends_on = [aws_instance.bastion_host, aws_db_instance.default]

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file(var.keypair_path)
    host        = aws_instance.bastion_host.public_ip
  }

  # Upload the SQL file to bastion
  provisioner "file" {
    source      = "../Server/setup.sql"
    destination = "/tmp/setup.sql"
  }

  # Execute on bastion host
  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo amazon-linux-extras install postgresql13 -y",
      "echo 'File uploaded successfully:'",
      "ls -la /tmp/setup.sql",
      "echo 'Running database setup...'",
      "export PGPASSWORD='${var.db_password}'",
      "psql -h ${aws_db_instance.default.address} -p 5432 -U trackme_admin -d trackme -f /tmp/setup.sql"
    ]
  }

  triggers = {
    schema_hash = filemd5("../Server/setup.sql")
  }
}