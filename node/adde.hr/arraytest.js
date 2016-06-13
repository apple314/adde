#!/usr/bin/env node
var pairs = [];
pairs.push(['sasa','sasa1']);

pairs.push(['marko','marko1']);

function getPair(me,pairs_var) {
    for (var i=0; i<pairs_var.length; i++){
        var p = pairs_var[i];
        var index = p.indexOf(me);
        if (index > -1) {
            switch (index) {
                case 0:
                    return pairs_var[i][1];
                case 1:
                    return pairs_var[i][0];
            }
        }
    }
    return false;
}

console.log(getPair('marko', pairs));