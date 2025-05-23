import os
import redis
from rq import Worker, Queue

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
conn = redis.from_url(redis_url)
listen = ['default']

if __name__ == '__main__':
    queues = [Queue(name, connection=conn) for name in listen]
    worker = Worker(queues, connection=conn)
    worker.work()