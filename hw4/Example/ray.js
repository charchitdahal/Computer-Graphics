
class ray{
    // Your code goes here:
    
     constructor(a, b){
         this.A = a;
         this.B = b;
     }

    origin(){
        return this.A;
    } 

    direction() {
        return this.B;
     }

    point_at_paramenter(t){
        return add(this.A, scale(t,this.B));
    }    
    
}