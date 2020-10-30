#!/usr/bin/env python
# coding: utf-8


# phrase VIC data

import pandas as pd
import sys
from collections import Counter
vic = pd.read_csv('vic_weed_page_full.csv',encoding='utf-8')
vic.drop(['Unnamed: 0'],axis=1, inplace=True)
vic.loc[vic.scientificName == 'Nassella trichotoma (Nees) Hack. ex Arechav.', 'Common Name'] = 'Serrated Tussock'
vic.dropna(axis=0, how='any', inplace=True)
vic.reset_index(drop=True, inplace=True)
vic.rename(columns={'Common Name':'CommonName'}, inplace=True)
new_vic= pd.DataFrame(vic.groupby(by='Suburb',as_index=False).apply(lambda x:[','.join(x['CommonName'])]))
new_vic.columns=['Suburb','CommonName']
new_vic['CommonName'] = new_vic['CommonName'].apply(lambda x: Counter(x.split(',')).most_common())
new_vic.to_csv("suburb_commonname.csv")
