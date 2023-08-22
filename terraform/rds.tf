resource "aws_security_group" "rds_sg" {
  name        = "rds_sg"
  vpc_id      = aws_vpc.Travel-Tales-vpc.id
  description = "Security group for the RDS instance"

  ingress {
    from_port       = 5432  # PostgreSQL default port
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.Travel-Tales-Sec-Group.id]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

resource "aws_subnet" "rds_subnet1" {
  vpc_id                  = aws_vpc.Travel-Tales-vpc.id  # Replace with your existing VPC ID
  cidr_block              = "10.0.1.0/24"   # Adjust as needed for your subnet CIDR block
  availability_zone       = var.availability_zones[0]

}

resource "aws_subnet" "rds_subnet2" {
  vpc_id                  = aws_vpc.Travel-Tales-vpc.id  # Replace with your existing VPC ID
  cidr_block              = "10.0.2.0/24"   # Adjust as needed for your subnet CIDR block
  availability_zone       = var.availability_zones[1]

}

resource "aws_route_table" "rds_route_table" {
  vpc_id = aws_vpc.Travel-Tales-vpc.id  # Replace with your existing VPC ID
}

resource "aws_route" "route" {
  route_table_id         = aws_route_table.rds_route_table.id
  destination_cidr_block = "0.0.0.0/0"  # Route all traffic
  gateway_id             = aws_internet_gateway.Travel-Tales-igw.id  # Replace with your existing internet gateway ID
}

resource "aws_route_table_association" "association1" {
  subnet_id      = aws_subnet.rds_subnet1.id
  route_table_id = aws_route_table.rds_route_table.id
}

resource "aws_route_table_association" "association2" {
  subnet_id      = aws_subnet.rds_subnet2.id
  route_table_id = aws_route_table.rds_route_table.id
}


resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = [aws_subnet.rds_subnet1.id, aws_subnet.rds_subnet2.id]
}

resource "aws_db_instance" "travel_tales_db" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "14.6"
  instance_class       = "db.t3.micro"
  db_name              = "travel_tales_db"
  username             = "postgre"
  password             = "DarOrNir!2"
  publicly_accessible = false
  db_subnet_group_name  = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}

