export default function(state:any, action:any){
  return Object.assign({}, state, action.payload);
}