import simplejson, urllib, json
from bottle import route,run,static_file,template,debug






@route('/bus/:number')
def bus(number=88):
    busstop = 51502
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
    return template('bus')


@route('/static/:path#.+#')
def server_static(path):
    return static_file(path, root='/www/bus/public/')




debug(True)
run( host='localhost', port=81, reloader=True )