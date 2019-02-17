
class ray{
    // Your code goes here:
    constructor(a, b) {
     this.A = a;
     this.B = b;
     };
 
     ray() {
         return null
     };
 
     ray(a, b) { 
         this.A = a; 
         this.B = b;
         return this.A, this.B;
     }
 
     get origin() { 
         return this.A; 
     }
 
     get direction() { 
         return this.B; 
     }
 
     point_at_parameter(t) { 
         return add(this.A, scale(t, this.B)) ; 
     }
 
 }