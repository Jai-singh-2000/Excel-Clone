//Get row and column by event target
function getRowAndColId(e)
{
    let rowId=Number(e.target.getAttribute("rowid"));
    let colId=Number(e.target.getAttribute("colid"));
    return{
        rowId,
        colId
    }
}


//solve formula 
function solveFormula(formula,selfCellObject)
{
    let formulaArr=formula.split(" ");
    for(let i=0;i<formulaArr.length;i++)
    {
        let formulaComponent=formulaArr[i];
        
        if(formulaComponent[0]>="A" && formulaComponent[0]<="Z"){
            let {rowId,colId} = getRowIdColIdFromAddress(formulaComponent);
            let cellObject = db[rowId][colId];
            let value = cellObject.value;
            cellObject.children.push(selfCellObject.name);
            console.log(cellObject);
            formula = formula.replace(formulaComponent,value);
        }
    }
    let computedValue=eval(formula);
    return computedValue;
}


function getRowIdColIdFromAddress(address){
    //address = A1 (Means address name)
    let colId = address.charCodeAt(0)-65;
    let rowId = Number(address.substring(1))-1;
    return {
        rowId,
        colId
    }
}