import json

from osgeo import ogr

by_precinct = json.loads(open('./nc_by_precinct.json', 'r').read())
#for prec in by_precinct.keys():
#	print(prec)
#	quit()

driver = ogr.GetDriverByName('ESRI Shapefile')
# clipped_portland.shp
dataSource = driver.Open("Voting_Precincts.shp", 1) #1 is read/write

layer = dataSource.GetLayer()

print('creating columns')
for field in ['voters', 'v_inactive', 'v_active', 'v_removed', 'v_denied', 'v_temp', 'v_white', 'v_black', 'v_hisp', 'v_in_person', 'v_provisional']:
    fldDef = ogr.FieldDefn(field, ogr.OFTInteger)
    layer.CreateField(fldDef)

def count_by_key(precinct, key):
    total = 0
    if key in precinct["by_race"]:
        for eth_key in precinct["by_race"][key].keys():
           total += precinct["by_race"][key][eth_key]
        return total
    elif key == "hisp":
        for rac_key in precinct["by_race"].keys():
            if 'hl' in precinct["by_race"][rac_key]:
                total += precinct["by_race"][rac_key]['hl']
        return total
    else:
        return 0

print('setting columns')
feature = layer.GetNextFeature()
while feature:
    geoid = '37'
    county = str(int(feature.GetField("county_id")) * 2 - 1)
    while len(county) < 3:
        county = '0' + county
    prec = feature.GetField("prec_id").replace(' ', '-')
    try:
        s = float(prec)
        while prec[0] == '0':
            prec = prec[1:]
    except:
        s = 1

    geoid += county + prec

    if geoid in by_precinct:
        feature.SetField('voters', by_precinct[geoid].get('total', 0))
        feature.SetField('v_inactive', by_precinct[geoid].get('inactive', 0))
        feature.SetField('v_active', by_precinct[geoid].get('active', 0))
        feature.SetField('v_removed', by_precinct[geoid].get('removed', 0))
        feature.SetField('v_denied', by_precinct[geoid].get('denied', 0))
        feature.SetField('v_temp', by_precinct[geoid].get('temporary', 0))
        feature.SetField('v_white', count_by_key(by_precinct[geoid], 'w'))
        feature.SetField('v_black', count_by_key(by_precinct[geoid], 'b'))
        feature.SetField('v_hisp', count_by_key(by_precinct[geoid], 'hisp'))
        feature.SetField('v_in_perso', by_precinct[geoid].get('ever_in_person', 0))
        feature.SetField('v_provisio', by_precinct[geoid].get('only_provisional', 0))

        layer.SetFeature(feature)
    else:
        print("Did not find: " + geoid)
    feature = layer.GetNextFeature()

