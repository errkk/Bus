import simplejson,json
from pymongo import Connection

class Database(object):

    # define global vars
    con = False # connection
    col = False # collection

    def __init__(self):

        # connect to database
        self.con = Connection('localhost', 27017)
        self.col = self.con.bus

    def addRow(self,data):
        try:
            self.col.busstops.save(data)
            return True
        except Database:
            return false

    def findStops(self,swLat,swLng,neLat,neLng):

        condition = {'lat':{'$gt': str(swLat), '$lt': str(neLat)},'lng':{'$lt': str(swLng), '$gt': str(neLng)}}

        res = []
        try:
            cur = self.col.busstops.find( condition ).skip(0).limit(300)
            for d in cur:

                res.append( { 'id':d['id'],'lat':d['lat'],'lng':d['lng'],'name':d['name'],'code':d['smsCode'],'heading':d['heading'],'letter':'A' } )

            
        except Database:
            print 'DB error'
            return False

        if len(res) > 0:
            print 'Found %d stops' % len(res)
            return res
        else:
            return False


        
