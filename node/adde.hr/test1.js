#!/usr/bin/env node
var names = [['sasa','marko'],['nikola', 'pero']]

console.log(getArrayIndex(names,'nikola'));
function getArrayIndex(arrayVar, name){
 for(var i=0;i<arrayVar.length;i++){
  if (arrayVar[i].indexOf(name) >= 0){
   return i;
  }else{
   return false;
  }
 }
}
