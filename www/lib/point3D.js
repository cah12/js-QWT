/*!
  \brief QwtPoint3D class defines a 3D point in double coordinates
*/

class Point3D {
    constructor(/* double  */x, /* double */ y, /* double */ z){
		var d_x = 0.0;
		var d_y = 0.0;
		var d_z = 0.0; 
		if(x == undefined){
			;
		}
		else if(y !==undefined){
			d_x = x;
			d_y = y;
			d_z = z;
		}
		else if(typeof x == 'object' && x.z == undefined){
			d_x = x.x;
			d_y = x.y;
			d_z = 0;
		}else{
			d_x = x.x();
			d_y = x.y();
			d_z = x.z();
		}		
		
		/*!
			\return True if the point is null; otherwise returns false.

			A point is considered to be null if x, y and z-coordinates
			are equal to zero.
		*/
		this.isNull = function()
		{
			return d_x == 0.0 && d_y == 0.0 && d_z == 0.0;
		}

		//! \return The x-coordinate of the point.
		this.x = function()
		{
			return d_x;
		}

		//! \return The y-coordinate of the point.
		this.y = function()
		{
			return d_y;
		}

		//! \return The z-coordinate of the point.
		this.z = function()
		{
			return d_z;
		}

		//! \return A reference to the x-coordinate of the point.
		/* this.rx()
		{
			return d_x;
		} */

		//! \return A reference to the y-coordinate of the point.
		/* this.ry()
		{
			return d_y;
		} */

		//! \return A reference to the z-coordinate of the point.
		/* this.rz()
		{
			return d_z;
		} */

		//! Sets the x-coordinate of the point to the value specified by x.
		this.setX = function( x )
		{
			d_x = x;
		}

		//! Sets the y-coordinate of the point to the value specified by y.
		this.setY = function( y )
		{
			d_y = y;
		}

		//! Sets the z-coordinate of the point to the value specified by z.
		this.setZ = function(z )
		{
			d_z = z;
		}
		
		this.setPoint3D = function(pt3D){
			d_x = pt3D.x();
			d_y = pt3D.y();
			d_z = pt3D.z();
		}

		/*!
		   \return 2D point, where the z coordinate is dropped.
		*/
		this.toPoint = function()
		{
			return new Misc.Point( d_x, d_y );
		}	
		
		this.toString = function(){
			return "["+d_x+", "+d_y+", "+d_z+"]"
		}
		
	}    
};



