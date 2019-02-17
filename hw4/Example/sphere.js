class sphere{
    // Your code goes here:
    // in hit(r, rec):
    //      return false if discriminant is less than 0
    //      otherwise, update rec and then return true 

    constructor(cen, r) {
        this.center = cen
        this.radius = r
    }
    
    hit(r, rec) {
        var oc = subtract(r.origin(),this.center)
        var a = dot(r.direction(), r.direction())
        var b = dot(oc, r.direction())
        var c = dot(oc,oc) - this.radius*this.radius
        var discriminant = b*b - a*c
        if (discriminant>0){
            var temp = (-b - Math.sqrt(b*b-a*c))/a
            rec.t = temp
            rec.p = r.point_at_paramenter(rec.t)
            rec.normal = normalize(scale(1/this.radius,subtract(rec.p,this.center)))
            return true;
        }
        else 
            return false;
    }
}