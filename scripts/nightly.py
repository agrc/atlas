import gspread
import ConfigParser
import os
import json

queryLayersUrl = 'https://docs.google.com/a/utah.gov/spreadsheet/ccc?key=0Aqee4VOgQcXcdG9DQzFEYld6UUtWRU1kNG5PMWVEY1E&usp=drive_web#gid=0'

# query layer fields
fldName = 'Name'
fldDescription = 'Layer Description'
fldMetaData = 'Metadata Link'
fldIndex = 'Map Service Layer Index'
fldHeading = 'Division Heading'

qlFields = [
          [fldName, 'name'], 
          [fldDescription, 'description'], 
          [fldMetaData, 'metaDataUrl'], 
          [fldIndex, 'index'],
          [fldHeading, 'heading']
          ]

# other link fields
fldID = 'ID'
fldLinkDescription = 'Description'
fldURL = 'URL'

linksFields = [
               [fldID, 'id'],
               [fldLinkDescription, 'description'],
               [fldURL, 'url']
               ]

webdata = r'C:\MapData\webdata' # dev & test
# webdata = r'\\172.16.17.57\ArcGISServer\data\webdata' # production
jsonFile = os.path.join(webdata, 'DEQEnviro.json')

def getWorksheetData(wksh, fields):
    data = []
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
        data.append(o)
    
    return data

# get secrets
config = ConfigParser.RawConfigParser()
config.read('secrets.cfg')
section = 'Google Drive Credentials'
username = config.get(section, 'username')
password = config.get(section, 'password')

gc = gspread.login(username, password)
spreadsheet = gc.open_by_url(queryLayersUrl)

# query layers worksheet
qlWksht = spreadsheet.worksheet('Query Layers')
layers = getWorksheetData(qlWksht, qlFields)

# other links
linksWksht = spreadsheet.worksheet('Other Links')
links = getWorksheetData(linksWksht, linksFields)
linksDict = {}
for l in links:
    linksDict[l[linksFields[0][1]]] = l
    
j = json.dumps({'queryLayers': layers,
                'otherLinks': linksDict}, indent=4)
f = open(jsonFile, 'w')
print >> f, j
f.close()


print('done')