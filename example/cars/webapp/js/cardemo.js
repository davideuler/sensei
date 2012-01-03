var host="localhost";
var port=8080;


var colorSel={"values":[]};
var categorySel={"values":[]};
var priceSel={"values":[]};
var yearSel={"values":[]};
var mileageSel={"values":[]};
var tagsSel={"values":[]};

var selmap = {"color":colorSel,"category":categorySel,"price":priceSel,"year":yearSel,"mileage":mileageSel,"tags":tagsSel};


var senseiReq = {"query":{"query_string":queryString}};

var fieldSort = null;

senseiReq.fetchStored = true;

senseiReq.sort = ["_score"];

senseiReq.selections = [
{
  "terms":{
    "color":colorSel
  }
},
{
  "terms":{
    "category":categorySel
  }
},
{
  "terms":{
    "price":priceSel
  }
},
{
  "terms":{
    "year":yearSel
  }
},
{
  "terms":{
    "mileage":mileageSel
  }
},
{
  "terms":{
    "tags":tagsSel
  }
}
];

var queryString = {"query" : ""};

senseiReq.facets = {};

senseiReq.facets.color={
	
};

senseiReq.facets.category={};

senseiReq.facets.year={};

senseiReq.facets.price={};

senseiReq.facets.tags={};

var repVal = function(arr,s){
  var found =false;
  for (var i=0;i<arr.length;++i){
    if (s==arr[i]){
        arr.splice(i,1);
        found = true;
        break;
    }
  }
  if (!found){
    arr.push(s);
  }
}

function handleSelected(name,facetVal){
	console.log(name+','+facetVal.value);
	var sel = selmap[name];
	var valArray = sel["values"];
	repVal(valArray,facetVal.value);
	doSearch();
}

function clearSelection(name){
	console.log("clear: "+name);
	var sel = selmap[name];
	var valArray = sel["values"];
	valArray.length=0;
	doSearch();
}

function renderFacet(name,facet){
	var node = $("#"+name);
	if (node != null){
		node.empty();
		node.append('<input type="checkbox"> All</input>');
		var allObj = node.children().last().get(0);
		allObj._name = name;

		var sel = selmap[name];
	    var valArray = sel["values"];
	    if (valArray.length==0){
	    	allObj.checked="checked";
	    }

		node.children().last().click(function(e){
				clearSelection(this._name);
		});
		node.append('<br/>');

		for (var i=0;i<facet.length;++i){
			var html;

			html = '<input type="checkbox"> '+facet[i].value+' ('+facet[i].count+')</input>';
			node.append(html);
			var obj = node.children().last().get(0);
			obj._name = name;
			obj._facetVal = facet[i];
			if (facet[i].selected){
				obj.checked ="checked";
			}
			node.children().last().click(function(e){
				handleSelected(this._name,this._facetVal);
			});

			node.append('<br/>');
		}
	}
}


function renderHits(hits){
	$('#results').empty();
	for (var i=0;i<hits.length;++i){
		var html = '<tr>';
    	var hit = hits[i];

    	var score = hit._score;
    	var id = hit._uid;
    	var color = hit.color[0];
    	var category = hit.category[0];
    	var year = hit.year[0];
    	var price = hit.price[0];
    	var mileage = hit.mileage[0];

		html += '<td>'+id+'</td>';
		html += '<td>'+color+'</td>';
		html += '<td>'+category+'</td>';
		html += '<td>'+parseFloat(year)+'</td>';
		html += '<td>'+parseFloat(price)+'</td>';
		html += '<td>'+parseFloat(mileage)+'</td>';
		html += '<td>'+score+'</td>';

		html += '</tr>';
    $('#results').append(html);
  }
}

function renderPage(senseiResult){
	console.log(senseiResult.numhits);


	$("#numhits").empty();
	$("#numhits").append(senseiResult.numhits);


	$("#totaldocs").empty();
	$("#totaldocs").append(senseiResult.totaldocs);


	var facets = senseiResult.facets;

	for (var name in facets){
		renderFacet(name,facets[name])
	}

    renderHits(senseiResult.hits);
}

function doSearch(){
	executeSenseiReq(host,port,senseiReq,renderPage);
}

function updateTextQuery(){
	var q = $('#qbox').val();
	setSenseiQueryString(senseiReq,q);
	doSearch();
}

function resetAll(){
	$('#qbox').val("");
    for (var sel in selmap){
    	var selection = selmap[sel];
    	selection["values"].length = 0;
    }
    setSenseiQueryString(senseiReq,"");
	doSearch();
}

function toggleSort(name){
	console.log('sort:'+name)
	if (fieldSort==null || fieldSort[name]==null){
		fieldSort = {};
		fieldSort[name] = 'desc';
		senseiReq.sort=[fieldSort,"_score"]
	}
	else{
		var dir = fieldSort[name];
		if ('desc'==dir){
			fieldSort[name]='asc';
		}
		else{
			fieldSort[name]='desc';
		}
	}
	doSearch();
}
