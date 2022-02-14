//handles the logic behind being submitted some data
onmessage = function (e) {
	var filtered = applyFilter(e.data.filter, e.data.items);
	postMessage(filtered);
}


//returns an array of fileterd items
function applyFilter(filter, items) {
	var r = [];
	var ffields = [
		filter.keywords,
		filter.authors,
		filter.lang,
		filter.year,
		filter.repository,
		filter.typology
	];
	var l = ffields.length;

	//reset count
	for (var i = 0; i < l; i++) {
		var ffield = ffields[i];
		for (var j = 0; j < ffield.length; j++) {
			ffield[j].count = 0;
		}
	}
	//filter
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var itemFields = [
			item.keywords,
			item.authors,
			item.lang,
			item.year,
			item.repository,
			item.typology
		];
		if (compliesWithFilter(ffields, itemFields)) {
			r.push(item.id);
		}
	} //for in source
	
	return {
		filteredIds: r,
		filter: filter
	};
}


//checks whether given item's fields comply with filter fields
function compliesWithFilter(ffields, itemFields) {
	var any = false; //whether or not item matches at least one of the filters (AND or OR operators only)
	var hasOr = false; //whether or not any of the filters contains an OR operator
	for (var x = 0; x < ffields.length; x++) {
		var ffield = ffields[x];
		var ifield = itemFields[x];
		for (var i = 0; i < ffield.length; i++) {
			var ffitem = ffield[i];

			var complies = compliesWithFilterItem(ffitem, ifield);
			ffitem.complies = complies;
			if (ffitem.selected) {
				hasOr = hasOr || (ffitem.operator == 0);
				if (!complies && ffitem.operator != 0) {
					//decrement count
					for (var xx = 0; xx < x; xx++) {
						var dcrFfield = ffields[xx];
						for (var ii = 0; ii < dcrFfield.length; ii++) {
							var dcrFfitem = dcrFfield[ii];
							if (dcrFfitem.complies)
								dcrFfitem.count--;
						}
					}
					for (var ii = 0; ii < i; ii++) {
						var dcrFfitem = ffield[ii];
						if (dcrFfitem.complies)
							dcrFfitem.count--;
					}
					return false;
				}
				if (complies && ffitem.operator != 2) {
					any = true;
				}
			} else {
				var complies = compliesWithFilterItem(ffitem, ifield);
			}
			if (complies) {
				ffitem.count++;
			}

		} //for in ffield
	} //for in ffields
	//so far, the item has not been excluded
	return hasOr ? any : true;
}


//checks whether given item' fields compliy with filter field
function compliesWithFilterItem(ffitem, ifield) {
	var ffvalue = ffitem.value;
	if (Array.isArray(ifield)) {
		if (ffitem.operator == 1) {
			for (var j = 0; j < ifield.length; j++) {
				var iitem = ifield[j];
				if (iitem == ffvalue) {
					return true;
				}
			}
			return false;
		} else if (ffitem.operator == 2) {
			for (var j = 0; j < ifield.length; j++) {
				var iitem = ifield[j];
				if (iitem == ffvalue)
					return false;
			}
			return true;
		} else {
			for (var j = 0; j < ifield.length; j++) {
				var iitem = ifield[j];
				if (iitem == ffvalue) {
					return true;
				}
			}
			return false;
		} //operator switch
	} else {
		if (ffitem.operator == 1) {
			return ffvalue == ifield;
		} else if (ffitem.operator == 2) {
			return ffvalue != ifield;
		} else {
			if (ffvalue == ifield)
				return true;
			return false;
		} //operator switch
	} //if(!Array.isArray(ifield))
}