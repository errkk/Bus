import simplejson, urllib, json
from bottle import route,run,static_file,template,debug
from lib.db import Database
from lib.decorators import print_timing


class BusStuff:
    dist = 0.003

    def _coords(self,lat,lng,dist):
        if dist:
            self.dist = float(dist)
        print 'Searching near %s - %s' % (lat, lng)
        swLat = float(lat) - self.dist
        swLng = float(lng) - (self.dist * 1.4)
        neLat = float(lat) + self.dist
        neLng = float(lng) + (self.dist * 1.4)
        return swLat, swLng, neLat, neLng


    @print_timing
    def getStops(self,lat,lng, dist):
        coords = self._coords(lat,lng,dist)
        db = Database()
        res = db.findStops(*coords)
        return res


    @print_timing
    def getStopsWs(self, lat, lng, dist):

        coords = self._coords(lat, lng, dist)

        url = 'http://countdown.tfl.gov.uk/markers/swLat/%s/swLng/%s/neLat/%s/neLng/%s/?_dc=1315936072189' \
            % coords

        result = simplejson.load(urllib.urlopen(url))
        print 'Found %d busstops from webservice' % len(result['markers'])
        stops = []
        for item in result['markers']:
            stops.append({
                'id': item['id'],
                'name': item['name'],
                'direction':item['direction'],
                'letter':item['stopIndicator'],
                'lat':item['lat'],
                'lng':item['lng']
            })
        return stops


    @print_timing
    def getBuses(self,busStop):
        url = 'http://countdown.tfl.gov.uk/stopBoard/%s?_dc=1316722451243' % busStop
        print url
        jsonfile = urllib.urlopen(url)
        result = simplejson.load(jsonfile)
        try:
            arrivals = result['arrivals']
            buses = []
            for item in arrivals:
                print ( '%s till next %s to %s' % ( item['estimatedWait'],item['routeName'],item['destination'] ) )
                buses.append( {'route':item['routeName'],'wait':item['estimatedWait'],'destination':item['destination']} )
        except:
            print 'Error finding busstop: %s' % busStop
            return false

        if( len(buses) > 0 ):
            return buses
        else:
            return false


BusStuff = BusStuff()


@route('/bus/:busStop')
def bus(busStop = 51502):
    buses = BusStuff.getBuses(busStop)
    return json.dumps(buses)


@route('/stops/:lat/:lng/:dist')
def stops(lat=51.4612, lng=-0.1402, dist=0.003):
    stops = BusStuff.getStops(lat, lng, dist)
    return json.dumps( stops )


@route('/')
def index():
    return template( 'bus' )


@route('/cache.manifest')
def manifest():
    print 'Serving Cache Manifest'
    return static_file('cache.manifest', root='',
                       mimetype='text/cache-manifest')

@route('/favicon.ico')
def favicon():
    return ''


debug(True)
run(server='tornado', port=9000)
