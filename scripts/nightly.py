import gspread
import ConfigParser
import os
import json

queryLayersUrl = 'https://docs.google.com/a/utah.gov/spreadsheet/ccc?key=0Aqee4VOgQcXcdG9DQzFEYld6UUtWRU1kNG5PMWVEY1E&usp=drive_web#gid=0'

fldName = 'Name'
fldDescription = 'Layer Description'
fldMetaData = 'Metadata Link'
fldIndex = 'Map Service Layer Index'
fldHeading = 'Division Heading'

webdata = r'C:\MapData\webdata' # dev & test
# webdata = r'\\172.16.17.57\ArcGISServer\data\webdata' # production
jsonFile = os.path.join(webdata, 'queryLayers.json')

fields = [
          [fldName, 'name'], 
          [fldDescription, 'description'], 
          [fldMetaData, 'metaDataUrl'], 
          [fldIndex, 'index'],
          [fldHeading, 'heading']
          ]

# get secrets
config = ConfigParser.RawConfigParser()
config.read('secrets.cfg')
section = 'Google Drive Credentials'
username = config.get(section, 'username')
password = config.get(section, 'password')

# get worksheet
gc = gspread.login(username, password)
wksh = gc.open_by_url(queryLayersUrl).worksheet('Query Layers')

layers = []
fieldIndices = {}
firstRow = True
for row in wksh.get_all_values():
    if firstRow:
        # get field indices
        i = 0
        for cell in row:
            fieldIndices[cell] = i
            i = i + 1
            
        firstRow = False
        continue
    
    o = {}
    for f in fields:
        o[f[1]] = row[fieldIndices[f[0]]].strip()
    layers.append(o)
    
j = json.dumps(layers, indent=4)
f = open(jsonFile, 'w')
print >> f, j
f.close()


print('done')