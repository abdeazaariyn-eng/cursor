import csv

# Read the CSV file
with open('orders mahdbaby - الورقة1.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f'Total rows: {len(rows)}\n')

# Display all rows
for i, row in enumerate(rows, 1):
    order_id = row.get('ordered ', '').strip()
    name = row.get('name', '').strip()
    product = row.get('product', '').strip()
    sku = row.get('sku', '').strip()
    print(f'Row {i}: OrderID={order_id} | Name={name} | Product={product} | SKU={sku}')

# Find duplicates based on order ID
print('\n--- DUPLICATES ---')
from collections import Counter
order_ids = [row.get('ordered ', '').strip() for row in rows]
duplicates = [oid for oid, count in Counter(order_ids).items() if count > 1 and oid]

for dup_id in duplicates:
    print(f'\nOrder ID "{dup_id}" appears {order_ids.count(dup_id)} times:')
    for i, row in enumerate(rows, 1):
        if row.get('ordered ', '').strip() == dup_id:
            print(f'  Row {i}: {row.get("name")} - {row.get("product")}')
