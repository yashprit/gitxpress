export default function(state, action){
  return Object.assign({}, state, action.payload);
}