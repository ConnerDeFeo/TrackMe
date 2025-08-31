resource "aws_db_instance" "default" {
  identifier = "mydbinstance"
  engine     = "postgres"
  username   = "ConnerDeFeo"
  password   = var.db_password
  db_name    = "trackme"
  instance_class = "db.t2.micro"
  allocated_storage = 20
}