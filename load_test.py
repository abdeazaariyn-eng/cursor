from __future__ import annotations

import argparse
import concurrent.futures
import statistics
import threading
import time
import urllib.error
import urllib.request
from collections import Counter


def fetch(url: str, timeout: float) -> tuple[int, float]:
    start = time.perf_counter()
    req = urllib.request.Request(url, headers={"User-Agent": "mahdbaby-load-test/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            response.read(256)
            status = response.getcode()
    except urllib.error.HTTPError as exc:
        status = exc.code
    except Exception:
        status = 0
    elapsed_ms = (time.perf_counter() - start) * 1000
    return status, elapsed_ms


def percentile(values: list[float], pct: float) -> float:
    if not values:
        return 0.0
    if len(values) == 1:
        return values[0]
    ordered = sorted(values)
    index = min(len(ordered) - 1, max(0, round((pct / 100) * (len(ordered) - 1))))
    return ordered[index]


def main() -> int:
    parser = argparse.ArgumentParser(description="Simple concurrent HTTP load test")
    parser.add_argument("url")
    parser.add_argument("--total", type=int, default=1000)
    parser.add_argument("--concurrency", type=int, default=100)
    parser.add_argument("--timeout", type=float, default=10.0)
    args = parser.parse_args()

    latencies: list[float] = []
    statuses: Counter[int] = Counter()
    lock = threading.Lock()

    start = time.perf_counter()
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = [executor.submit(fetch, args.url, args.timeout) for _ in range(args.total)]
        for future in concurrent.futures.as_completed(futures):
            status, latency = future.result()
            with lock:
                statuses[status] += 1
                latencies.append(latency)
    duration = time.perf_counter() - start

    success = sum(count for status, count in statuses.items() if 200 <= status < 400)
    failures = args.total - success
    rps = args.total / duration if duration else 0.0

    print(f"URL: {args.url}")
    print(f"Total requests: {args.total}")
    print(f"Concurrency: {args.concurrency}")
    print(f"Duration: {duration:.2f}s")
    print(f"Requests/sec: {rps:.2f}")
    print(f"Success: {success}")
    print(f"Failures: {failures}")
    print(f"Status counts: {dict(sorted(statuses.items()))}")

    if latencies:
        print(f"Latency avg: {statistics.mean(latencies):.2f}ms")
        print(f"Latency p50: {percentile(latencies, 50):.2f}ms")
        print(f"Latency p95: {percentile(latencies, 95):.2f}ms")
        print(f"Latency p99: {percentile(latencies, 99):.2f}ms")
        print(f"Latency max: {max(latencies):.2f}ms")

    return 0 if failures == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())