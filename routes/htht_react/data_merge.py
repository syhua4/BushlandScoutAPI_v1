#!/usr/bin/env python
# coding: utf-8

# Merge new weeds and old one

import pandas as pd
import sys
old = pd.read_csv('vic_weed_page_full.csv',encoding='utf-8')
new = pd.read_csv('scientific_common.csv',encoding='utf-8')

old['COMMON_NAME']=old['COMMON_NAME'].str.lower()
new['Name']=new['Name'].str.lower()
res = pd.merge(old, new, left_on="scientificName", right_on="scientificName", how="left")
res.loc[(res.scientificName == 'Cynara cardunculus L.'), 'commonName'] = 'Cardoon'
res.loc[(res.scientificName == 'Opuntia stricta (Haw.) Haw.'), 'commonName'] = 'Erect prickly pear'
res.to_csv("new_weed_info.csv")






