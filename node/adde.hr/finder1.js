#!/usr/bin/env node
var names = [['nikola', 'luka'],['sasa','marko'], ['drago','miki']];

function popPair(pairsVar, nameToMatch) {
    for (var i=0; i<pairsVar.length; i++){
        for (var ii=0; ii<pairsVar[i].length;ii++){
            if (nameToMatch == pairsVar[i][ii]) {
                pairsVar.splice(i,1);
            }
        }
    }
}

popPair(names, 'marko');

console.log(names);    
