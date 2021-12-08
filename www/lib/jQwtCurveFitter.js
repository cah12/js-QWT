'use strict';
class CurveFitter {
	constructor() {
        //super();
    /*!
        Find a curve which has the best fit to a series of data points

        \param polygon Series of data points
        \return Curve points
        subclass must reimplement
     */
		this.fitCurve = function( polygon ) {
			throw '"fitCurve()" not reimplemented in subclass';
		}
	}

};


/*!
Spline type
The default setting is Auto
\sa setFitMode(), FitMode()
*/
Static.FitMode = {}

/*!
Use the default spline algorithm for polygons with
increasing x values ( p[i-1] < p[i] ), otherwise use
a parametric spline algorithm.
*/
Static.FitMode.Auto = 0

//! Use a default spline algorithm
Static.FitMode.Spline = 1

//! Use a parametric spline algorithm
Static.FitMode.ParametricSpline = 2

/*!
  \brief A curve fitter using cubic splines
*/
/////////////////SplineCurveFitter - subclass of CurveFitter//////////start
//SplineCurveFitter.inheritsFrom( CurveFitter);
//Define the SplineCurveFitter constructor
class SplineCurveFitter extends CurveFitter{
    // Call the parent constructor, making sure (using Function#call)
    // that "this" is set correctly during the call
    //CurveFitter.call(this);
	constructor() {
        super();

    var m_fitMode = Static.FitMode.Auto
    var m_spline = new Spline()
    var m_splineSize = 250

    
    function fitSpline( points ){
      m_spline.setPoints( points );
      if ( !m_spline.isValid() )
          return points;

      var fittedPoints = new Array( m_splineSize );


      var x1 = points[0].x;
      var x2 = points[points.length - 1 ].x;
      var dx = x2 - x1;
      var delta = dx / ( m_splineSize - 1 );

      for ( var i = 0; i < m_splineSize; i++ )
      {
          //var p = fittedPoints[i];

          var v = x1 + i * delta;
          var sv = m_spline.value( v );

          /*p.x = v;
          p.y = sv;*/
          fittedPoints[i] = new Misc.Point(v, sv)
          
      }
      m_spline.reset();

      return fittedPoints;

    }

    function fitParametric( points ) {
      var i;
      var size = points.length;

      var fittedPoints = []//( d_data->splineSize );
      var splinePointsX = []//( size );
      var splinePointsY = []//( size );

      var p = points;
      var spX = splinePointsX;
      var spY = splinePointsY;

      var param = 0.0;
      for ( i = 0; i < size; i++ )
      {
          var x = p[i].x;
          var y = p[i].y;
          if ( i > 0 )
          {
            console.log(Math)
              var delta = Math.sqrt( Static.sqr( x - spX[i-1].y() )
                        + Static.sqr( y - spY[i-1].y() ) );
              param += Math.max( delta, 1.0 );
          }
          spX[i].x =  param;
          spX[i].y =  x;
          spY[i].x =  param;
          spY[i].y =  y ;
      }

      m_spline.setPoints( splinePointsX );
      if ( !m_spline.isValid() )
          return points;

      var deltaX =
          splinePointsX[size - 1].x / ( m_splineSize - 1 );
      for ( i = 0; i < m_splineSize; i++ )
      {
          var dtmp = i * deltaX;
          fittedPoints[i].x = m_spline.value( dtmp );
      }

      m_spline.setPoints( splinePointsY );
      if ( m_spline.isValid() )
          return points;

      var deltaY =
          splinePointsY[size - 1].x / ( m_splineSize - 1 );
      for ( i = 0; i < m_splineSize; i++ )
      {
          var dtmp = i * deltaY;
          fittedPoints[i].y =  m_spline.value( dtmp );
      }

      return fittedPoints;

    }

    
    this.setFitMode = function( mode ){

    }

    this.fitMode = function(){

    }

    this.setSpline = function( spline ){
        m_spline = spline;
        m_spline.reset();
    }

    this.spline = function(){
        return m_spline;
    }

    this.setSplineSize = function(splineSize ){
        m_splineSize = Math.max( splineSize, 10 );
    }

    this.splineSize = function(){
        return m_splineSize;
    }

    this.fitCurve = function(points){
        //console.log(polygon)
        var size = points.length;
        if ( size <= 2 )
            return points;

        var fitMode = m_fitMode;
        if ( fitMode == Static.FitMode.Auto )
        {
            fitMode = Static.FitMode.Spline;

            var p = points//.data();
            for ( var i = 1; i < size; i++ )
            {
                if ( p[i].x <= p[i-1].x )
                {
                    fitMode = Static.FitMode.ParametricSpline;
                    break;
                }
            };
        }

        if ( fitMode == Static.FitMode.ParametricSpline )
            return fitParametric( points );
        else
            return fitSpline( points );
        }
    }
	
}

////////////////////WeedingCurveFitter////////////////////////////////////////////////
class WC_PrivateData {
	constructor(){
		this.tolerance = 1.0;
		this.chunkSize = 0;
	}
};

class WC_Line {
	constructor(i1 = 0, i2 = 0 ) {
        //super();

		this.from = i1;
		this.to = i2;
	}
};


/*!
  \brief A curve fitter implementing Douglas and Peucker algorithm

  The purpose of the Douglas and Peucker algorithm is that given a 'curve'
  composed of line segments to find a curve not too dissimilar but that
  has fewer points. The algorithm defines 'too dissimilar' based on the
  maximum distance (tolerance) between the original curve and the
  smoothed curve.

  The runtime of the algorithm increases non linear ( worst case O( n*n ) )
  and might be very slow for huge polygons. To avoid performance issues
  it might be useful to split the polygon ( setChunkSize() ) and to run the algorithm
  for these smaller parts. The disadvantage of having no interpolation
  at the borders is for most use cases irrelevant.

  The smoothed curve consists of a subset of the points that defined the
  original curve.

  In opposite to QwtSplineCurveFitter the Douglas and Peucker algorithm reduces
  the number of points. By adjusting the tolerance parameter according to the
  axis scales QwtSplineCurveFitter can be used to implement different
  level of details to speed up painting of curves of many points.
*/
/////////////////WeedingCurveFitter - subclass of CurveFitter//////////start
class WeedingCurveFitter extends CurveFitter{
    constructor(tolerance ) {
        super();
        var d_data;		

		this.simplify = function(/* QPolygonF */ points ){		
			var toleranceSqr = d_data.tolerance * d_data.tolerance;

			 /* QStack<Line> */  var stack = [];
			//stack.reserve( 500 );

			/* const QPointF * */var p = points;//.data();
			/* const int */ var nPoints = points.length;

			//QVector<bool> usePoint( nPoints, false );
			var usePoint = [];
			usePoint.resize(nPoints, false);

			stack.push( new WC_Line( 0, nPoints - 1 ) );

			//while ( !stack.isEmpty() )
			while ( stack.length )
			{
				/* const Line */ var r = stack.pop();

				// initialize line segment
				/* const double */var vecX = p[r.to].x - p[r.from].x;
				/* const double */var vecY = p[r.to].y - p[r.from].y;

				/* const double */var vecLength = Math.sqrt( vecX * vecX + vecY * vecY );

				/* const double */var unitVecX = ( vecLength != 0.0 ) ? vecX / vecLength : 0.0;
				/* const double */var unitVecY = ( vecLength != 0.0 ) ? vecY / vecLength : 0.0;

				var maxDistSqr = 0.0;
				var nVertexIndexMaxDistance = r.from + 1;
				for ( var i = r.from + 1; i < r.to; i++ )
				{
					//compare to anchor
					var fromVecX = p[i].x - p[r.from].x;
					var fromVecY = p[i].y - p[r.from].y;

					var distToSegmentSqr;
					if ( fromVecX * unitVecX + fromVecY * unitVecY < 0.0 )
					{
						distToSegmentSqr = fromVecX * fromVecX + fromVecY * fromVecY;
					}
					else
					{
						var toVecX = p[i].x - p[r.to].x;
						var toVecY = p[i].y - p[r.to].y;
						var toVecLength = toVecX * toVecX + toVecY * toVecY;

						var s = toVecX * ( -unitVecX ) + toVecY * ( -unitVecY );
						if ( s < 0.0 )
						{
							distToSegmentSqr = toVecLength;
						}
						else
						{
							distToSegmentSqr = Math.abs( toVecLength - s * s );
						}
					}

					if ( maxDistSqr < distToSegmentSqr )
					{
						maxDistSqr = distToSegmentSqr;
						nVertexIndexMaxDistance = i;
					}
				}
				if ( maxDistSqr <= toleranceSqr )
				{
					usePoint[r.from] = true;
					usePoint[r.to] = true;
				}
				else
				{
					stack.push( new WC_Line( r.from, nVertexIndexMaxDistance ) );
					stack.push( new WC_Line( nVertexIndexMaxDistance, r.to ) );
				}
			}

			/* QPolygonF */var stripped = [];
			for ( var i = 0; i < nPoints; i++ )
			{
				if ( usePoint[i] )
					//stripped += p[i];
				    stripped.push(p[i]);
			}

			return stripped;
		}

		/*!
		 Assign the tolerance

		 The tolerance is the maximum distance, that is acceptable
		 between the original curve and the smoothed curve.

		 Increasing the tolerance will reduce the number of the resulting points.

		 \param tolerance Tolerance

		 \sa tolerance()
		*/
		this.setTolerance = function( tolerance ){
			d_data.tolerance = Math.max( tolerance, 0.0 );
		}

		/*!
		  \return Tolerance
		  \sa setTolerance()
		*/
		this.tolerance = function() {
			return d_data.tolerance;
		}

		/*!
		 Limit the number of points passed to a run of the Douglas Peucker algorithm

		 The runtime of the Douglas Peucker algorithm increases non linear
		 with the number of points. For a chunk size > 0 the polygon
		 is split into pieces passed to the algorithm one by one.

		 \param numPoints Maximum for the number of points passed to the algorithm

		 \sa chunkSize()
		*/
		this.setChunkSize = function( numPoints  ){
			if ( numPoints > 0 )
				//numPoints = Math.max( numPoints, 3U );
				numPoints = Math.max( numPoints, 3 );

			d_data.chunkSize = numPoints;

		}

		/*!
  
		  \return Maximum for the number of points passed to a run 
				  of the algorithm - or 0, when unlimited
		  \sa setChunkSize()
		*/
		this.chunkSize = function(){
			return d_data.chunkSize;
		}

		/*!
		  \param points Series of data points
		  \return Curve points
		*/
		this.fitCurve = function(/* QPolygonF */ points ){
			/* QPolygonF */ var fittedPoints = [];

			if ( d_data.chunkSize == 0 )
			{
				fittedPoints = this.simplify( points );
			}
			else
			{
				for ( var i = 0; i < points.length; i += d_data.chunkSize )
				{
					var p = points.mid( i, d_data.chunkSize );
					//fittedPoints += simplify( p );
					fittedPoints = fittedPoints.concat(this.simplify( p ));
				}
			}

			return fittedPoints;
		}

		d_data = new WC_PrivateData;
		this.setTolerance( tolerance );

	}
	
}

	
