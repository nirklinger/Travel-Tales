resource "aws_key_pair" "travle_tales_app_key_or_acc" {
  key_name   = "travle_tales_app_key_or_acc"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_security_group" "Travel-Tales-Sec-Group" {
  vpc_id      = aws_vpc.Travel-Tales-vpc.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "all"
    cidr_blocks = ["46.117.170.138/32"]
    description = "Ors ip"
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "all"
    cidr_blocks = ["46.121.211.35/32"]
    description = "Nirs ip"
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "all"
    cidr_blocks = ["109.186.53.83/32"]
    description = "Dars ip"
  }

  ingress {
    from_port   = 0
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "customers"
  }
}



resource "aws_instance" "Travel-Tales-Web-Server" {
  ami           = "ami-0dba2cb6798deb6d8"
  instance_type = "t3.large"
  key_name      = "travle_tales_app_key_or_acc"
  #iam_instance_profile = "LabInstanceProfile"
  subnet_id = aws_subnet.Travel-Tales-subnet-public1.id
  vpc_security_group_ids = [aws_security_group.Travel-Tales-Sec-Group.id]
}


