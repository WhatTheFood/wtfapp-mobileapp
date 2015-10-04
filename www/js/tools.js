/*
  Add anything globaly useful there.
*/

/* usage:
var myArray = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar'}];
var result = findBy( 'id', myArray, 45 );
// result.foo -> 'bar'
*/
function findBy(what, source, val) {
    return source.filter(function( obj ) {
        // coerce both obj.id and id to numbers 
        // for val & type comparison
        return +obj[what] === +val;
    })[ 0 ];
}
