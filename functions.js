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
            //If self object is present the push new children 
            if(selfCellObject)
            {
                cellObject.children.push(selfCellObject.name);
            }
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


//Update all child elements recursively

function updateChildren(cellObject)
{
    for(let i=0;i<cellObject.children.length;i++)
    {
        let childName= cellObject.children[i];
        let {rowId,colId}= getRowIdColIdFromAddress(childName);
        let childCellObject= db[rowId][colId];
         
        //Update child object new value
        let newValue=solveFormula(childCellObject.formula);
        childCellObject.value=newValue;
        //Changes on website ui
        let cellUi= document.querySelector(`div[rowid='${rowId}'][colid='${colId}']`);
        cellUi.textContent=newValue;

        //Update current cell children also
        updateChildren(childCellObject)
    }
    
}