
class hit_record {

    constructor(l,n){
        this.list =l;
        this.list_size =n;
    }

    get t() { return this.t_val; };
    set t(val){ this.t_val = val; };

    // add your code here:
    get p() { return this.p_val; };
    set p(pos) { this.p_val = pos };

    get normal() { return this.n; };
    set normal(normal) { this.n = normal};

hitable_list(r, rec, t_min, t_max){
    var temp_rec = rec;
    var hit_anything = false;
    var closet_so_far = t_max;
    for (i =0; i <this.list_size; i++){
        if (this.list[i] = hit(r, temp_rec, t_min, closet_so_far )){
            hit_anything = true;
            closet_so_far = temp_rec.t;
            rec = temp_rec;
        }
    }
    return hit_anything;


}
}




