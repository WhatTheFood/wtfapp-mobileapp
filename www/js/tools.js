/*
  Add anything globaly useful there.
*/

/* usage:
var myArray = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar'}];
var result = findById( myArray, 45 );
// result.foo -> 'bar'
*/
function findById(source, id) {
    return source.filter(function( obj ) {
        // coerce both obj.id and id to numbers 
        // for val & type comparison
        return +obj.id === +id;
    })[ 0 ];
}
