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

/* usage:
 * var l = [1, 2, 3, 4, 5, 6, 7];
 * cut(l, 3);
 * // result : [[1, 2, 3], [4, 5, 6], [7]]
*/
function cut(iterable, chunksize) {
    var result = [];
    for(i=0; i < iterable.length; i += chunksize) {
        result.push(iterable.slice(i, i+chunksize));
    }
    return result;
}
