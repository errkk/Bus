<?php

  //--------------------------------------------------------------------------
  // PHPcoord
  // text.php
  //
  // (c) 2005 Jonathan Stott
  //
  // Created on 11-Aug-2005
  //
  // 2.3 - 24 Aug 2006
  //  - Changed OSRef->toSixFigureString() so that the eastings and northings
  //    are rounded rather than floored.
  // 2.2 - 11 Feb 2006
  //  - Used different algorithm for calculating distance between latitudes
  //    and longitudes - fixes a number of problems with distance calculations
  // 2.1 - 22 Dec 2005
  //  - Added getOSRefFromSixFigureReference function
  // 2.0 - 21 Dec 2005
  //  - Completely different object design - conversion functions now through
  //    objects rather than static functions
  //  - Updated comments and documentation
  // 1.1 - 11 Sep 2005
  //  - Added OSGB36/WGS84 data conversions
  // 1.0 - 11 Aug 2005
  //  - Initial version
  //--------------------------------------------------------------------------


require_once("phpcoord-2.3.php");

$outputFile = fopen("converted.csv", "w");

$row = 1;
if (($handle = fopen("stream.csv", "r")) !== FALSE) {
    while ( ($data = fgetcsv($handle, 1000, ",") ) !== FALSE) {

		$id = $data[0];
		$name = ucwords(strtolower($data[1]));
		$easting = $data[2];
		$northing = $data[3];
		$heading = $data[4];
		$smsCode = $data[5];
		
		$os1w = new OSRef($easting, $northing);
		$ll1w = $os1w->toLatLng();
		$ll1w->OSGB36ToWGS84();
		$latlong = $ll1w->toString();
		
		$latlong = str_replace('(','',$latlong);
		$latlong = str_replace(')','',$latlong);
		
		$coords = split(',',$latlong);
		
		$lat = $coords[0];
		$lng = $coords[1];		
		
		if( fputcsv($outputFile,array($row,$id,$name,$heading,$smsCode,$lat,$lng)) ){
			echo 'Writing' . $name . ' ' . $lat . ' - ' . $lng . "\r\n";			
		}
		
        $row++;
    }
    fclose($handle);
}
fclose($outputFile);
?>
