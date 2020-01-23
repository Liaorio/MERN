export function getAgGridRowData(jsonData) {
    const rowData = [], colIds = [];
    jsonData.forEach((item, index) => {
        const eachRow = {};
        Object.keys(item).forEach(key => {
            switch(key) {
                case "name":
                    eachRow["firstName"] = { value: item["name"].firstName, editStatus: -1 };
                    eachRow["lastName"] = { value: item["name"].lastName, editStatus: -1 };
                    colIds.push("firstName");
                    colIds.push("lastName");
                    break;
                case "_id":
                case "_v":
                    break;
                default:
                    eachRow[key] = { value: item[key], editStatus: -1 };
                    colIds.push(key);
            }
            eachRow.rowTag = index;
            eachRow.Select = { value: false, editStatus: -1 };
        });
        rowData.push(eachRow);
    });

    pushLine(null, rowData, colIds);

    return rowData;
}



function blankRowTag(ary) {
    return -ary.length - 1;
}

// function isTheLastLine(rowData, rowTag) {
// 	const length = rowData.length;
// 	return rowTag === length - 1 || rowTag === -length - 1
// }


function getCellConst(colName, colIdx, lineData, lineIdx) {
    return { value: (lineData == null ? null : lineData[colIdx]), editStatus: -1 };
}


function pushLine(lineData, rowData, colIds, getCell = getCellConst, lineIdx = -1) {
    const rowTag = lineData == null ? blankRowTag(rowData) : rowData.length;
    const line = { rowTag: rowTag };
    colIds.forEach((colId, index) => {
        const thisCell = getCell(colId, index, lineData, lineIdx);
        line[colId] = thisCell;
    });
    line["Select"] = { value: false, editStatus: -1 };
    rowData.push(line);
}



