resource "aws_elasticache_cluster" "redis" {
  cluster_id         = "redis-cache"
  engine             = "redis"
  node_type          = "cache.t3.micro"
  num_cache_nodes    = 1
  port               = 6379
  security_group_ids = [aws_security_group.redis.id]
  subnet_group_name  = aws_elasticache_subnet_group.main.name
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "redis-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}
