resource "aws_elasticache_cluster" "redis" {
  cluster_id      = "redis-cache"
  engine          = "redis"
  node_type       = "cache.t3.micro"
  num_cache_nodes = 1
  port            = 6379
}

output "endpoint" {
  value = aws_elasticache_cluster.redis.cache_nodes[0].address
}
