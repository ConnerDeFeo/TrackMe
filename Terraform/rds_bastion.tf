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