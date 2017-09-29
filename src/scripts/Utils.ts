export function isEmpty(obj:Object){
  return Object.keys(obj).length === 0 && obj.constructor === Object
}