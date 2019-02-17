
class ray{
    constructor(a,b){

        this.A =a;
        this.B =b;

    }


    // Your code goes here:
    
     ray(){ 
         return null;

     }

     ray(a, b){
        //  a = A;
        //  b = B;
         this.A = a;
         this.B = b;
         return this.A, this.B;
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