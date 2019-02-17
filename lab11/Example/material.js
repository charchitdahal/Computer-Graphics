

function random_in_unit_sphere() {
    var p = vec3();
    do {
        p = subtract(scale(2, vec3(Math.random(),Math.random(),Math.random())),  vec3(1,1,1));
    } while (dot(p,p) >= 1.0);
    return p;
}

class diffuse{

    constructor(atten){
        this.attenuation = atten;
    }

    get_attenuation() { return this.attenuation; }; 

    get_next_ray(rec){
        var target = add(rec.p, add(rec.normal, random_in_unit_sphere()))
        var r = new ray(rec.p, subtract(target, rec.p))
        return r
    }
}