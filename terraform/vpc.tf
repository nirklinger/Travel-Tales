resource "aws_vpc" "Travel-Tales-vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "Travel-Tales-vpc"
  }
}

resource "aws_subnet" "Travel-Tales-subnet-private1" {
  vpc_id     = aws_vpc.Travel-Tales-vpc.id
  cidr_block = "10.0.11.0/24"

  tags = {
    Name = "Travel-Tales-subnet-private1"
  }
}

resource "aws_subnet" "Travel-Tales-subnet-public1" {
  vpc_id     = aws_vpc.Travel-Tales-vpc.id
  cidr_block = "10.0.12.0/24"

  tags = {
    Name = "Travel-Tales-subnet-public1"
  }
}

resource "aws_internet_gateway" "Travel-Tales-igw" {
  vpc_id = aws_vpc.Travel-Tales-vpc.id

  tags = {
    Name = "Travel-Tales-NAT-GW"
  }
}

resource "aws_eip" "Travel-Tales-NAT-GW_eip" {
  vpc = true
}

resource "aws_nat_gateway" "Travel-Tales-NAT-GW" {
  allocation_id = aws_eip.Travel-Tales-NAT-GW_eip.id
  subnet_id     = aws_subnet.Travel-Tales-subnet-private1.id
}


# Create a new route table
resource "aws_route_table" "Travel-Tales-rtb-public" {
  vpc_id = aws_vpc.Travel-Tales-vpc.id
}

# Create a new route in the route table to route all internet traffic through the NAT gateway
resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.Travel-Tales-rtb-public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.Travel-Tales-igw.id
}

# Associate the route table with the public subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.Travel-Tales-subnet-public1.id
  route_table_id = aws_route_table.Travel-Tales-rtb-public.id
}

# Create a new routing table for private subnet
resource "aws_route_table" "Travel-Tales-rtb-private1" {
  vpc_id = aws_vpc.Travel-Tales-vpc.id
}

# Create a new route in the private routing table to route all internet traffic through the NAT gateway
resource "aws_route" "private_nat" {
  route_table_id         = aws_route_table.Travel-Tales-rtb-private1.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.Travel-Tales-NAT-GW.id
}

# Associate the private routing table with the private subnet
resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.Travel-Tales-subnet-private1.id
  route_table_id = aws_route_table.Travel-Tales-rtb-private1.id
}

