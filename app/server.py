import simplejson, urllib, json,csv
from bottle import route,run,static_file,template,debug






@route('/bus/:busstop/:number')
def bus(busstop = 51502,number=88):
#    busstop = 51502
    url = 'http://countdown.tfl.gov.uk/stopBoard/%s' % busstop

    result = simplejson.load(urllib.urlopen(url))
    arrivals = result['arrivals']

    found = False
    string = ''

    buses = []

    for item in arrivals:

        if item['routeName'] == str(number):
            found = True
            print ( '%s till next %s to %s' % ( item['estimatedWait'],number,item['destination'] ) )

            buses.append( {'route':item['routeName'],'wait':item['estimatedWait']} )

    return json.dumps( buses )


                

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


    return template('bus',{ 'stops' : busstops } )


@route('/static/:path#.+#')
def server_static(path):
    return static_file(path, root='/www/bus/public/')




debug(True)
run( host='localhost', port=81, reloader=True )