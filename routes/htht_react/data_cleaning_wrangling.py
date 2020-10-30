#!/usr/bin/env python
# coding: utf-8

# get postcode for each suburb

import requests
from lxml import html
import pandas as pd
import sys


def get_postcode(suburb):
    url = 'https://auspost.com.au/postcode/'+ suburb
    page = requests.Session().get(url)
    tree = html.fromstring(page.text)
    result = tree.xpath('//div[@class="card"]//a/text()')
    for i in result:
        if i.startswith('3'):
            return i

# embed postcode into weed_info

df = pd.read_csv('final.csv',encoding='utf-8')
suburb = list(set(df['Suburb'].tolist()))
dic = {}
for i in suburb:
    print(i, ':', get_postcode(i))
    dic[i] = get_postcode(i)
for i, j in dic.items():
    df.loc[(df.Suburb == i), 'Postcode'] = j
df = pd.read_csv('final.csv',encoding='utf-8')
df.dropna(axis=0, how='any', inplace=True)
species = list(set(df['commonName'].tolist()))
j = 1
for i in species:
    df.loc[(df.commonName == i), 'Species_ID'] = int(j)
    j += 1
df['Species_ID'] = df['Species_ID'].apply(int)


# modify datetime
df['Datetime'] = df['Datetime'].apply(lambda x:str(x))
df['Datetime'] = df['Datetime'].apply(lambda x:x[:8])
df.to_csv("final.csv",index=False)

# assign ID for each file
df1 = pd.read_csv('WEED_INFO.csv',encoding='utf-8')
df2 = pd.read_csv('final.csv',encoding='utf-8')
dic = {k: g["Common_name"].tolist() for k,g in df2.groupby("Species_ID")}
res = {}
for k, v in dic.items():
    res[k] = v[0]
for k, v in res.items():
    df1.loc[(df1.COMMON_NAME == v), 'Species_ID'] = int(k)
df1['Species_ID'] = df1['Species_ID'].apply(int)
df1.to_csv("final_WEED_INFO.csv",index=False)
