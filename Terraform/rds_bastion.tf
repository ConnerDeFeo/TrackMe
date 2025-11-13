#Public Ip address of the machine running Terraform for use in security group rules
data "http" "myip" {
  url = "https://ipv4.icanhazip.com"
}

#Allow batstion to connect to rds instance in the default security group
resource "aws_security_group_rule" "allow_bastion_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion_sg.id
  security_group_id        = data.aws_security_group.default.id
}

# Create a public subnet
resource "aws_subnet" "bastion_subnet" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "bastion-public-subnet-1"
    type = "public"
  }
}

# Route table for public subnet
resource "aws_route_table" "bastion_route_table" {
  vpc_id = data.aws_vpc.default.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = data.aws_internet_gateway.default.id
  }

  tags = {
    Name = "bastion-public-route-table"
  }
}

# Associate the route table with the bastion subnet
resource "aws_route_table_association" "bastion_igw_association" {
  subnet_id      = aws_subnet.bastion_subnet.id
  route_table_id = aws_route_table.bastion_route_table.id
}

# Security group for the bastion host
resource "aws_security_group" "bastion_sg" {
  name        = "bastion-security-group"
  description = "Security group for the bastion host"
  vpc_id      = data.aws_vpc.default.id
  depends_on  = [data.http.myip]

  # SSH access from your IP
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.myip.response_body)}/32"]
  }

  # Outbound to RDS
  egress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [data.aws_security_group.default.id]
  }

  # General internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Bastion host EC2 instance
resource "aws_instance" "bastion_host" {
  ami                         = "ami-0ea3c35c5c3284d82"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.bastion_subnet.id
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  associate_public_ip_address = true
  key_name                    = var.keypair_name

  # Install PostgreSQL client automatically
  user_data = <<-EOF
              #!/bin/bash
              sudo apt update
              sudo apt install -y postgresql
              EOF

  tags = {
    Name = "trackme-bastion-host"
  }
}

output "bastion_host_public_ip" {
  description = "The public IP address of the bastion host"
  value       = aws_instance.bastion_host.public_ip
}
