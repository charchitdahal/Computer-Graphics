
class sphere{
    // add your code here:
    constructor(center, radius, mat) {
        this.Center = center;
        this.Radius = radius;
        this.material = mat;
    }


    hit(r, t_min, t_max, rec) {
        var discriminant
        // console.log(r)
        var oc = subtract(r.origin, this.Center)
        var a = dot(r.direction, r.direction);
        var b = dot(oc, r.direction);
        var c = dot(oc, oc) - (this.Radius * this.Radius);
        var discriminant = (b * b) - (a * c);

        if (discriminant > 0) {
            var temp = ((-b) - Math.sqrt(b * b - a * c)) / a;
            if (temp < t_max && temp >  t_min) {
                rec.t = temp;
                rec.p = r.point_at_parameter(rec.t);
                rec.normal = scale(1/this.Radius, subtract(rec.p, this.Center));
                rec.material = this.material
                return true;
            }
            temp = (((-b) + Math.sqrt(b * b - a * c)) / a)
            if (temp < t_max && temp > t_min) {
                rec.t = temp;
                rec.p = (r.point_at_parameter(rec.t))
                rec.normal = scale(1/this.Radius, subtract(rec.p, this.Center));
                rec.material = this.material
                return true
            }
        }
        return false;
    }
}