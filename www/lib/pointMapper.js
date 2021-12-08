'use strict';
// Mapping points with filtering out consecutive
// points mapped to the same position

Static.mToPolylineFiltered = function (xMap, yMap, series, from, to, round) {
	// in curves with many points consecutive points
	// are often mapped to the same position. As this might
	// result in empty lines ( or symbols hidden by others )
	// we try to filter them out

	//var polyline = [];//( to - from + 1 );
	//Point *points = polyline.data();
	var points = [];

	var sample0 = series.sample(from);

	//points.push({x:Math.round( xMap.transform( sample0.x ) ), y:Math.round( yMap.transform( sample0.y ) )})
	//points.push(new Misc.Point(Math.round(xMap.transform(sample0.x)), Math.round(yMap.transform(sample0.y))));
	points[0] = new Misc.Point(Math.round(xMap.transform(sample0.x)), Math.round(yMap.transform(sample0.y)));

	var pos = 0;
	for (var i = from + 1; i <= to; i++) {
		var sample = series.sample(i);
		var p;
		if (round)
			//p = { x:Math.round( xMap.transform( sample.x ) ), y:Math.round( yMap.transform( sample.y ) ) };
			p = new Misc.Point(Math.round(xMap.transform(sample.x)), Math.round(yMap.transform(sample.y)));
		else
			//            p = { x: xMap.transform( sample.x ), y: yMap.transform( sample.y )  };
			p = new Misc.Point(xMap.transform(sample.x), yMap.transform(sample.y));

		if (points[pos].x === p.x && points[pos].y === p.y)
			continue;
		pos++;
		//points.push(p);
		points[pos] = p;
	}

	//polyline.resize( pos + 1 );
	return points;
}

// mapping points without any filtering - beside checking
// the bounding rectangle

Static.mToPoints = function (boundingRect, xMap, yMap, series, from, to, round) {
	//Polygon polyline( to - from + 1 );
	var points = [];

	var numPoints = 0;

	if (boundingRect.left() <= boundingRect.right() && boundingRect.top() <= boundingRect.bottom()) {
		// iterating over all values
		// filtering out all points outside of
		// the bounding rectangle

		for (i = from; i <= to; i++) {
			var sample = series.sample(i);

			var x = xMap.transform(sample.x);
			var y = yMap.transform(sample.y);

			if (x >= boundingRect.left() && x <= boundingRect.right() && y >= boundingRect.top() && y <= boundingRect.bottom()) {
				if (round) {
					//                    points.push({x:Math.round( x ), y:Math.round( y )});
					points.push(new Misc.Point(Math.round(x), Math.round(y)));
				} else {
					//                    points.push({x:x, y:y});
					points.push(new Misc.Point(x, y));
				}
				numPoints++;
			}
		}

		//polyline.resize( numPoints );
	} else {

		// simply iterating over all values
		// without any filtering

		for (var i = from; i <= to; i++) {

			var sample = series.sample(i);

			var x = xMap.transform(sample.x) - 1; //minus 1 why
			var y = yMap.transform(sample.y) - 1; //minus 1 why

			if (round) {

				//                points.push({x:Math.round( x ), y:Math.round( y )});
				points.push(new Misc.Point(Math.round(x), Math.round(y)));

			} else {

				//                points.push({x:x, y:y});
				points.push(new Misc.Point(x, y));
			}

			numPoints++;
		}
	}
	return points;
}




////////////////////PointMapper////////////////////start
class PointMapper {
	constructor() {
		var m_flags = 0;
		//var m_boundingRect = { left:0.0, top:0.0, right:-1.0, bottom:-1.0, width:-1.0, height:-1 };
		var m_boundingRect = new Misc.Rect();
		/*!
		Set a bounding rectangle for the point mapping algorithm
	
		A valid bounding rectangle can be used for optimizations
	
		\param rect Bounding rectangle
		\sa boundingRect()
		 */
		this.setBoundingRect = function (rect) {
			m_boundingRect = rect;
		}

		/*!
		\return Bounding rectangle
		\sa setBoundingRect()
		 */
		this.boundingRect = function () {
			return m_boundingRect;
		}

		/*!
		Modify a flag affecting the transformation process
	
		\param flag Flag type
		\param on Value
	
		\sa flag(), setFlags()
		 */
		this.setFlag = function (flag, on) {
			if (on)
				m_flags |= flag;
			else
				m_flags &= ~flag;
		}

		/*!
		\return True, when the flag is set
		\param flag Flag type
		\sa setFlag(), setFlags()
		 */
		this.testFlag = function (flag) {
			return m_flags & flag;
		}

		/*!
		\brief Translate a series of points into a QPolygonF
	
		When the WeedOutPoints flag is enabled consecutive points,
		that are mapped to the same position will be one point.
	
		When PointMapper.TransformationFlag.RoundPoints is set all points are rounded to integers
		but returned as PolygonF - what only makes sense
		when the further processing of the values need a QPolygonF.
	
		\param xMap x map
		\param yMap y map
		\param series Series of points to be mapped
		\param from Index of the first point to be painted
		\param to Index of the last point to be painted
	
		\return Translated polygon
		 */
		this.toPolygonF = function (xMap, yMap, series, from, to) {
			var polyline = [];

			if (m_flags & PointMapper.TransformationFlag.WeedOutPoints) {
				if (m_flags & PointMapper.TransformationFlag.RoundPoints) {
					polyline = mToPolylineFiltered(xMap, yMap, series, from, to, true);
				} else {
					polyline = mToPolylineFiltered(xMap, yMap, series, from, to, false);
				}
			} else {
				if (m_flags & PointMapper.TransformationFlag.RoundPoints) {
					polyline = Static.mToPoints(new Misc.Rect(0.0, 0.0, -1.0, -1), xMap, yMap, series, from, to, true);
				} else {

					polyline = Static.mToPoints(new Misc.Rect(0.0, 0.0, -1.0, -1), xMap, yMap, series, from, to, false);
					//alert(polyline)
				}
			}

			return polyline;
		}

		/*!
		\brief Translate a series into a QPolygonF
	
		- WeedOutPoints & PointMapper.TransformationFlag.RoundPoints & boundingRect().isValid()
		All points that are mapped to the same position
		will be one point. Points outside of the bounding
		rectangle are ignored.
	
		- WeedOutPoints & PointMapper.TransformationFlag.RoundPoints & !boundingRect().isValid()
		All consecutive points that are mapped to the same position
		will one point
	
		- WeedOutPoints & !PointMapper.TransformationFlag.RoundPoints
		All consecutive points that are mapped to the same position
		will one point
	
		- !WeedOutPoints & boundingRect().isValid()
		Points outside of the bounding rectangle are ignored.
	
		When PointMapper.TransformationFlag.RoundPoints is set all points are rounded to integers
		but returned as PolygonF - what only makes sense
		when the further processing of the values need a QPolygonF.
	
		\param xMap x map
		\param yMap y map
		\param series Series of points to be mapped
		\param from Index of the first point to be painted
		\param to Index of the last point to be painted
	
		\return Translated polygon
		 */
		this.toPointsF = function (xMap, yMap, series, from, to) {
			var points //= [];

			if (m_flags & PointMapper.TransformationFlag.WeedOutPoints) {
				if (m_flags & PointMapper.TransformationFlag.RoundPoints) {
					if (m_boundingRect.left() <= m_boundingRect.right() && m_boundingRect.top() <= m_boundingRect.bottom()) {
						points = Static.mToPointsFiltered(m_boundingRect,
							xMap, yMap, series, from, to);
					} else {
						// without a bounding rectangle all we can
						// do is to filter out duplicates of
						// consecutive points

						points = mToPolylineFiltered(
							xMap, yMap, series, from, to, true);
					}
				} else {
					// when rounding is not allowed we can't use
					// qwtToPointsFilteredF

					points = Static.mToPolylineFiltered(
						xMap, yMap, series, from, to, false);
				}
			} else {
				if (m_flags & PointMapper.TransformationFlag.RoundPoints) {
					points = Static.mToPoints(m_boundingRect,
						xMap, yMap, series, from, to, true);
				} else {
					points = Static.mToPoints(m_boundingRect,
						xMap, yMap, series, from, to, false);
				}
			}

			return points;
		}

	}
	toString() {
		return '[PointMapper]';
	}
}
Enumerator.enum("TransformationFlag { RoundPoints = 0x01 , WeedOutPoints = 0x02}", PointMapper);