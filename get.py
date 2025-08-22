import requests
import yaml
import os
from datetime import datetime
# from dotenv import load_dotenv

# # 新增：加载 .env 文件中的环境变量
# load_dotenv()

# --- 配置部分 ---
NEODB_API_BASE_URL = "https://neodb.social/api/me/shelf/complete"  # 基础API URL
OUTPUT_BASE_DIR = "data"  
CATEGORIES = ["movie", "tv", "book"]  # 需要获取的媒体类型
PAGE_SIZE = 100  # 每页获取的数据量

def fetch_data_from_api(base_url: str, token: str, category: str) -> list:
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }

    all_items = []
    page = 1

    while True:
        api_url = f"{base_url}?category={category}&page={page}&page_size={PAGE_SIZE}"

        print(f"正在从 {api_url} 获取 {category} 数据 (第 {page} 页)...")

        try:
            response = requests.get(api_url, headers=headers)
            response.raise_for_status()  

            response_data = response.json()

            if 'data' in response_data and isinstance(response_data['data'], list):
                items = response_data['data']
                print(f"第 {page} 页获取到 {len(items)} 条 {category} 数据")

                if not items:
                    break

                all_items.extend(items)

                if len(items) < PAGE_SIZE:
                    break

                page += 1
            else:
                print(f"第 {page} 页响应格式不符合预期，没有找到data字段")
                break

        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP 错误发生: {http_err}")
            if page == 1:
                break
            else:
                print(f"第 {page} 页请求失败，跳过该页")
                break

        except requests.exceptions.RequestException as req_err:
            print(f"请求发生未知错误: {req_err}")
            break

    print(f"{category} 数据获取完成，共获取 {len(all_items)} 条数据")
    return all_items

def format_date(created_time: str) -> str:
    """
    将 created_time 格式化为 YYYY-MM-DD 格式（保留年月日）。
    """
    if not created_time or not isinstance(created_time, str):
        return None

    try:
        # 处理ISO格式时间（如带时区的格式）
        dt = datetime.fromisoformat(created_time.replace('Z', '+00:00'))
        return dt.strftime("%Y-%m-%d")  # 改为年月日格式
    except ValueError:
        # 处理非ISO格式，但包含至少10个字符的情况（YYYY-MM-DD长度为10）
        if len(created_time) >= 10:
            return created_time[:10]  # 截取前10个字符（如2023-10-05）
        return None

def process_raw_data(raw_items: list, category_name: str) -> list:
    processed_category_items = []

    print(f"正在处理 {len(raw_items)} 条 {category_name} 数据...")

    for entry in raw_items:
        if 'item' not in entry or entry['item'] is None:
            print(f"警告: 跳过一个缺少 'item' 键的 {category_name} 条目")
            continue

        item = entry['item']

        # 提取完整日期（年月日）
        created_time = entry.get('created_time')
        date = format_date(created_time)  # 调用修改后的日期格式化函数

        if not date:
            print(f"警告: 无法从 {created_time} 提取日期，跳过 {category_name} 条目: {item.get('title', '未知标题')}")
            continue

        processed_entry = {
            'title': item.get('title'),
            'cover': item.get('cover_image_url'),
            'rating': item.get('rating'),
            'date': date,  # 字段名从year改为date，更符合实际内容
        }

        processed_category_items.append(processed_entry)

    # 按日期降序排序（最新的在前）
    processed_category_items = sorted(
        processed_category_items,
        key=lambda x: x.get('date', '0000-00-00'),
        reverse=True
    )

    print(f"{category_name} 数据处理完成。")
    return processed_category_items

def save_to_yaml(data: list, filename: str):
    print(f"正在将数据保存到 {filename}...")

    try:
        output_dir = os.path.dirname(filename)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"已创建目录: {output_dir}")

        with open(filename, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
        print(f"数据已成功保存到 {filename}")
    except IOError as io_err:
        print(f"文件写入错误: {io_err}")
    except Exception as e:
        print(f"保存 YAML 文件时发生未知错误: {e}")

def main():
    neodb_auth_token = os.environ.get("NEODB_AUTH_TOKEN")
    if not neodb_auth_token:
        print("错误: 环境变量 NEODB_AUTH_TOKEN 未设置。请设置此环境变量。")
        exit(1) 
    all_processed_data_for_stats = {
        "movie": [],
        "tv": [],
        "book": []
    }

    for category in CATEGORIES:
        raw_items = fetch_data_from_api(NEODB_API_BASE_URL, neodb_auth_token, category)

        if raw_items:
            processed_category_list = process_raw_data(raw_items, category)
            all_processed_data_for_stats[category] = processed_category_list  # 存储用于统计

            output_filename = os.path.join(OUTPUT_BASE_DIR, f"{category}s.yaml")
            save_to_yaml(processed_category_list, output_filename)
        else:
            print(f"未获取到有效 {category} 数据")

    print("\n--- 汇总统计 ---")
    for category in CATEGORIES:
        items_count = len(all_processed_data_for_stats[category])
        print(f"{category.capitalize()} 类别包含 {items_count} 条处理后数据")
        if items_count > 0:
            # 由于数据已按日期降序排列，第一个是最新，最后一个是最早
            latest_date = all_processed_data_for_stats[category][0].get('date', '未知')
            earliest_date = all_processed_data_for_stats[category][-1].get('date', '未知')
            print(f"  时间范围: {earliest_date} 到 {latest_date}")
        else:
            print(f"  无数据")

if __name__ == "__main__":
    main()