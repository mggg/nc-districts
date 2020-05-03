import time, json
import requests
import geopandas as gpd
from osgeo import ogr

api_key = "81bae7d10ba7690a0a0d593fbff3bb0f1e8394d7"

state = '37'
county_fips = []
saveblocks = {}

for coded in range(1, 199 + 1):
    if coded % 2 == 0:
        continue
    saved = str(coded)
    while len(saved) < 3:
        saved = '0' + saved
    county_fips.append(saved)

# add population from Census API
"""
for county in county_fips:
    cols = [
        # racial
        'B03002_001E','B03002_003E','B03002_004E','B03002_005E','B03002_006E',
        'B03002_007E','B03002_008E','B03002_009E','B03002_012E',
        # HISP + race breakdown (not included in my script)
    ]
    name_of = {
        'B03002_001E': "TOTPOP",
        'B03002_003E': "NH_WHITE",
        'B03002_004E': "NH_BLACK",
        'B03002_005E': "NH_AMIN",
        'B03002_006E': "NH_ASIAN",
        'B03002_007E': "NH_NHPI",
        'B03002_008E': "NH_OTHER",
        'B03002_009E': "NH_2MORE",
        'B03002_012E': "HISP",
    }
    url = 'https://api.census.gov/data/2018/acs/acs5?get=' + ','.join(cols) + '&for=block group:*&in=state:' + state + '+county:' + county + '&key=' + api_key
    resp = requests.get(url)
    blocks = resp.json()
    print(county + ": " + str(len(blocks)))

    headers = None
    for block in blocks:
        if headers is None:
            headers = block
        else:
            blockid = block[headers.index('state')] + block[headers.index('county')] + block[headers.index('tract')] + block[headers.index('block group')]

            saveblocks[blockid] = {}
            for pvar in cols:
                saveblocks[blockid][name_of[pvar]] = int(block[headers.index(pvar)])

    time.sleep(1)

driver = ogr.GetDriverByName('ESRI Shapefile')
dataSource = driver.Open("../public/nc-geo/tl_2018_37_bg/tl_2018_37_bg.shp", 1)
layer = dataSource.GetLayer()

for item in saveblocks.keys():
    fields = saveblocks[item].keys()
    break

print('creating columns')
for field in fields:
fldDef = ogr.FieldDefn(field, ogr.OFTInteger)
layer.CreateField(fldDef)

print('setting columns')
feature = layer.GetNextFeature()
while feature:
    geoid = feature.GetField("GEOID")
    if geoid in saveblocks:
        for field in fields:
            feature.SetField(field, saveblocks[geoid][field])
            layer.SetFeature(feature)
    # else:
        # print(geoid)
    feature = layer.GetNextFeature()
"""

# add ages from Census API
for county in county_fips:
    cols = [
        # male ages
        "B01001_003E", # < 5
        "B01001_004E", # 5-9
        "B01001_005E", # 10-14
        "B01001_006E", # 15-17
        "B01001_007E", # 18-19
        "B01001_008E", # 20
        "B01001_009E", # 21
        "B01001_010E", # 22-24
        "B01001_011E", # 25-29
        "B01001_012E", # 30-34
        "B01001_013E", # 35-39
        "B01001_014E", # 40-44
        "B01001_015E", # 45-49
        "B01001_016E", # 50-54
        "B01001_017E", # 55-59
        "B01001_018E", # 60-61
        "B01001_019E", # 62-64
        "B01001_020E", # 65-66
        "B01001_021E", # 67-69
        "B01001_022E", # 70-74
        "B01001_023E", # 75-79
        "B01001_024E", # 80-84
        "B01001_025E", # 85+

        # female ages
        "B01001_027E", # < 5
        "B01001_028E", # 5-9
        "B01001_029E", # 10-14
        "B01001_030E", # 15-17
        "B01001_031E", # 18-19
        "B01001_032E", # 20
        "B01001_033E", # 21
        "B01001_034E", # 22-24
        "B01001_035E", # 25-29
        "B01001_036E", # 30-34
        "B01001_037E", # 35-39
        "B01001_038E", # 40-44
        "B01001_039E", # 45-49
        "B01001_040E", # 50-54
        "B01001_041E", # 55-59
        "B01001_042E", # 60-61
        "B01001_043E", # 62-64
        "B01001_044E", # 65-66
        "B01001_045E", # 67-69
        "B01001_046E", # 70-74
        "B01001_047E", # 75-79
        "B01001_048E", # 80-84
        "B01001_049E", # 85+
    ]

    name_of = {
        "B01001_003E": "age_lt_5",
        "B01001_004E": "age_5_9",
        "B01001_005E": "age_10_14",
        "B01001_006E": "age_15_17",
        "B01001_007E": "age_18_19",
        "B01001_008E": "age_20",
        "B01001_009E": "age_21",
        "B01001_010E": "age_22_24",
        "B01001_011E": "age_25_29",
        "B01001_012E": "age_30_34",
        "B01001_013E": "age_35_39",
        "B01001_014E": "age_40_44",
        "B01001_015E": "age_45_49",
        "B01001_016E": "age_50_54",
        "B01001_017E": "age_55_59",
        "B01001_018E": "age_60_61",
        "B01001_019E": "age_62_64",
        "B01001_020E": "age_65_66",
        "B01001_021E": "age_67_69",
        "B01001_022E": "age_70_74",
        "B01001_023E": "age_75_79",
        "B01001_024E": "age_80_84",
        "B01001_025E": "age_85_plu"
    }

    url = 'https://api.census.gov/data/2018/acs/acs5?get=' + ','.join(cols) + '&for=block group:*&in=state:' + state + '+county:' + county + '&key=' + api_key
    resp = requests.get(url)
    blocks = resp.json()
    print(county + ": " + str(len(blocks)))

    headers = None
    for block in blocks:
        if headers is None:
            headers = block
        else:
            blockid = block[headers.index('state')] + block[headers.index('county')] + block[headers.index('tract')] + block[headers.index('block group')]

            saveblocks[blockid] = {}
            female_equivalent_index = cols.index('B01001_027E')
            for mvar in cols[:cols.index('B01001_027E')]:
                fvar = cols[female_equivalent_index]
                saveblocks[blockid][name_of[mvar]] = int(block[headers.index(mvar)]) + int(block[headers.index(fvar)])
                female_equivalent_index += 1
    time.sleep(1)

driver = ogr.GetDriverByName('ESRI Shapefile')
dataSource = driver.Open("../public/nc-geo/tl_2018_37_bg/tl_2018_37_bg.shp", 1)
layer = dataSource.GetLayer()

for item in saveblocks.keys():
    fields = saveblocks[item].keys()
    break

# print('creating columns')
# for field in fields:
#     fldDef = ogr.FieldDefn(field, ogr.OFTInteger)
#     layer.CreateField(fldDef)

print('setting columns')
feature = layer.GetNextFeature()
while feature:
    geoid = feature.GetField("GEOID")
    if geoid in saveblocks:
        for field in fields:
            feature.SetField(field, saveblocks[geoid][field])
            layer.SetFeature(feature)
    # else:
        # print(geoid)
    feature = layer.GetNextFeature()

#
# base = open('../uploader/data/ca_base.yml', 'r').read()
# for index, row in cali_counties.iterrows():
#     nm = row["NAME10"].replace(' ', '')
#     op = base.replace('COUNTY_ID', 'ca_' + nm)
#     op = op.replace('COUNTY_NAME', row["NAME10"] + " County")
#     op = op.replace('SHAPEFILE', '../cali_plans/' + nm + '_county.shp')
#     f = open('../uploader/data/ca_' + nm + '.yml', 'w')
#     f.write(op)
