# getItemPrice.py

from bs4 import BeautifulSoup
import requests
import pandas as pd
import re

def extract_price(price_str):
    price_match = re.search(r'\$([\d,.]+)', price_str)
    if price_match:
        return float(price_match.group(1).replace(',', ''))
    return None

def get_average_price():
    ebay_url = 'https://www.ebay.com/sch/i.html'
    search_query = search_query.replace(' ', "+")
    
    ebay_filters = {
        "item_conditions": {
            "New without tags": 1500,
        },
        "item_locations": {
            "Domestic": 1,
        },
        "directories": {
            "Clothing, Shoes & Accessories": 11450,
        },
        "categories": {
            "No Category": 0,
        },
        "sort_order": {
            "Time: newly listed": 10,
        }
    }

    params = {
        '_from': 'R40',
        '_nkw': search_query,
        'LH_ItemCondition': ebay_filters["item_conditions"]["New without tags"],
        'LH_PrefLoc': ebay_filters["item_locations"]["Domestic"],
        '_udlo': '10',
        '_udhi': '100',
        '_dcat': ebay_filters["directories"]["Clothing, Shoes & Accessories"],
        '_sacat': ebay_filters["categories"]["No Category"],
        '_sop': ebay_filters["sort_order"]["Time: newly listed"],
        'LH_Sold': '1',
        'LH_Complete': '1',
        'LH_BIN': '0',
        'LH_Auction': '0',
        'LH_BO': '0',
        'LH_FS': '0',
        '_ipg': '50',
        'rt': 'nc'
    }

    page_number = 0
    items_list = []

    while page_number < 2:
        page_number += 1
        params['_pgn'] = page_number
        response = requests.get(ebay_url, params=params)
        soup = BeautifulSoup(response.text, 'html.parser')

        if soup.find('button', class_='pagination__next', type='next', attrs={'aria-disabled': 'true'}):
            break

        items = soup.find_all('div', class_='s-item__wrapper clearfix')
        for item in items[2:]:
            try:
                title = item.find('div', class_='s-item__title').text
                price = item.find('span', class_='s-item__price').text
                image_url = item.find('div', class_='s-item__image-wrapper image-treatment').find('img').get('src', 'No image URL')
                link = item.find('a', class_='s-item__link')['href'].split('?')[0]

                items_list.append({
                    'Title': title,
                    'Price': price,
                    'Link': link,
                    'Image Link': image_url
                })
            except Exception:
                continue

    df = pd.DataFrame(items_list)
    df['Price Numeric'] = df['Price'].apply(extract_price)
    df.dropna(subset=['Price Numeric'], inplace=True)

    if df.empty:
        return None

    return round(df['Price Numeric'].mean(), 2)
