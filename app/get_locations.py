#!/usr/bin/python

import csv,simplejson,urllib
from lib.db import Database
from lib.decorators import print_timing

def import_stops():

    try:
        file = open('../utils/converted.csv', 'U')
    except:
        print 'cant get file'

    try:
        stops = csv.reader( file, dialect=csv.excel_tab )
    except:
        print 'cant get csv'
        exit()


    db = Database()

    count = 0
    for row in stops:

        count = count + 1

        thestop = row[0].split(',')

        stopcode = thestop[1]
        name = thestop[2]
        heading = thestop[3]
        smsCode = thestop[4]
        lat = thestop[5]
        lng = thestop[6]

        data = { 'id':stopcode, 'name':name, 'lat':lat, 'lng':lng, 'heading':heading, 'smsCode':smsCode }

        try:
            db.addRow(data)
            print 'Saving %s' % name
            count = count + 1
        except:
            print 'Fail for %s' % name

    print 'Saved %d records to busstops' % count



@print_timing
def import_stops_ws():
    """
    Pull All stops form WS
    """

    db = Database()
    try:
        url = 'http://countdown.tfl.gov.uk/markers/swLat/%s/swLng/%s/neLat/%s/neLng/%s/?_dc=1315936072189'\
        % ( 50,0.3,52,-0.3 )

        result = simplejson.load(urllib.urlopen(url))

        print 'Found %d busstops from webservice' % len(result['markers'])

    except:
        print 'Error getting JSON'

    stops = []
    count = 0

    for item in result['markers']:

        count = count + 1


        data = { 'id':item['id'], 'name':item['name'],'direction':item['direction'], 'letter':item['stopIndicator'], 'lat':str(item['lat']), 'lng':str(item['lng']) }


        try:
            db.addRow(data)
            print 'Saving %s' % item['name']
            count = count + 1
        except:
            print 'Error saving for %s' % item['name']

    print 'Saved %d records to busstops' % count




import_stops_ws()



        
