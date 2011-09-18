import simplejson, urllib, json,csv
from bottle import route,run,static_file,template,debug


class BusStuff:
    dist = 0.003

    def getStops(self,lat,lng, dist):

        if dist:
            self.dist = float(dist)
        print 'Searching near %s - %s' % ( lat,lng )

        swLat = float(lat) - self.dist
        swLng = float(lng) - ( self.dist * 1.4 )
        neLat = float(lat) + self.dist
        neLng = float(lng) + ( self.dist * 1.4 )


        url = 'http://countdown.tfl.gov.uk/markers/swLat/%s/swLng/%s/neLat/%s/neLng/%s/?_dc=1315936072189' \
            % ( swLat, swLng, neLat, neLng )

        result = simplejson.load(urllib.urlopen(url))

        print 'Found %d busstops' % len(result['markers'])

        stops = []

        for item in result['markers']:

            stops.append( { 'id':item['id'], 'name':item['name'], 'direction':item['direction'], 'letter':item['stopIndicator'], 'lat':item['lat'], 'lng':item['lng'] } )

        return stops


    def getBuses(self,busStop):
    #    busstop = 51502
        url = 'http://countdown.tfl.gov.uk/stopBoard/%s?_dc=1315936072189' % busStop
        print url
        jsonfile = urllib.urlopen( url )

        result = simplejson.load( jsonfile )

        arrivals = result['arrivals']

        found = False

        buses = []

        for item in arrivals:


            found = True
            print ( '%s till next %s to %s' % ( item['estimatedWait'],item['routeName'],item['destination'] ) )

            buses.append( {'route':item['routeName'],'wait':item['estimatedWait'],'destination':item['destination']} )

        return buses




BusStuff = BusStuff()

@route('/bus/:busStop')
def bus(busStop = 51502):
    buses = BusStuff.getBuses( busStop )
    return json.dumps( buses )


@route('/stops/:lat/:lng/:dist')
def stops( lat=51.4612,lng=-0.1402,dist=0.003 ):
    
    return json.dumps( BusStuff.getStops(lat,lng,dist) )


@route('/')
def index():
    return template( 'bus' )


@route('/cache.manifest')
def manifest():
    print 'Serving Cache Manifest'
    return static_file('cache.manifest', root='', mimetype='text/cache-manifest')


@route('/static/:path#.+#')
def server_static(path):
    print 'Serving static: %s' % path
    return static_file(path, root='../public/')

@route('/favicon.ico')
def favicon():
    return ''



#debug(True)
run( server='tornado',port=80 )