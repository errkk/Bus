import simplejson, urllib, json,csv
from bottle import route,run,static_file,template,debug






@route('/bus/:busstop/:number')
def bus(busstop = 51502,number=88):
#    busstop = 51502
    url = 'http://countdown.tfl.gov.uk/stopBoard/%s?_dc=1315936072189' % busstop

    jsonfile = urllib.urlopen(url)

    result = simplejson.load( jsonfile )

    if result:
        print 'Getting stops'
    else:
        print 'Stops JSON Fail'

    arrivals = result['arrivals']

    found = False

    buses = []

    for item in arrivals:

        if item['routeName'] == str(number):
            found = True
            print ( '%s till next %s to %s' % ( item['estimatedWait'],number,item['destination'] ) )

            buses.append( {'route':item['routeName'],'wait':item['estimatedWait']} )

    if found:
        return json.dumps( buses )
    else:
        return 'Fail'

@route('/stops/:lat/:lng')
def stops( lat=51.4612,lng=-0.1402 ):
    print 'Searching near %s - %s' % ( lat,lng )
    dist = 0.003

    swLat = float(lat) - dist
    swLng = float(lng) - dist
    neLat = float(lat) + dist
    neLng = float(lng) + dist


    url = 'http://countdown.tfl.gov.uk/markers/swLat/%s/swLng/%s/neLat/%s/neLng/%s/?_dc=1315936072189' \
        % ( swLat, swLng, neLat, neLng )

    result = simplejson.load(urllib.urlopen(url))

    print 'Found %d busstops' % len(result['markers'])

    stops = []

    for item in result['markers']:
        stops.append( { 'id':item['id'], 'name':item['name'], 'letter':item['stopIndicator'], 'lat':item['lat'], 'lng':item['lng'] } )

    return json.dumps( stops )
                

@route('/')
def index():
    file = open('bus_stops_example.csv', 'rU')
    stops = csv.reader( file, dialect=csv.excel_tab )

    busstops = []

    for row in stops:
        thestop = row[0].split(',')
        name = thestop[1]
        id = thestop[0]

        busstops.append( {'name':name,'id':id} )
    

    return template( 'bus' )


@route('/static/:path#.+#')
def server_static(path):
    return static_file(path, root='../public/')




#debug(True)
run( server='tornado' )