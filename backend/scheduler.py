# scheduler.py
import os
from redis import Redis
from rq_scheduler import Scheduler
import time

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
conn = Redis.from_url(redis_url)
print("RQ Scheduler started... outside the loop")
if __name__ == '__main__':
    scheduler = Scheduler(queue_name='default', connection=conn)
    print("RQ Scheduler started...")
    while True:
        scheduler.run()
        time.sleep(1)