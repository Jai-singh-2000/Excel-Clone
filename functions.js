function getRowIdColIdFromAddress(address){
    //address = A1 J3 T12 (Means address name)
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


//Formula C1 = (A1 + B2 - 3 ) Means A1 and B2 are 'parents' of C1
    //C1 is selfCellObject in which forumla is applied means 'child'
function solveFormula(formula,selfCellObject)
{
        let formulaArr=formula.split(" ");//Split formula on the basis of space and make formulaArray
        
        for(let i=0;i<formulaArr.length;i++)
        {
            let formulaComponent=formulaArr[i];//Every component of formulaArray like A1 B12 G3 etc.
            
            if(formulaComponent[0]>="A" && formulaComponent[0]<="Z")//If character is lie between A to Z
            {
                
                let {rowId,colId} = getRowIdColIdFromAddress(formulaComponent); //Find row&col id by address like A1 B32 E32 etc.
                let cellObject = db[rowId][colId];//Find that cell Object
                let value = cellObject.value;//Get Object value like "A1 contains 23" and "B3 contains 3"
            
                //If self object is present the push new children 
                if(selfCellObject)
                {
                    // Update child in every parent element Like in A1.children we push C1 and B2.children we push C1
                    cellObject.children.push(selfCellObject.name); 
    
                    // Update parent in this selfCellObject C1.parent we push A1 and then B2
                    selfCellObject.parent.push(cellObject.name); 
                }
                 
                formula = formula.replace(formulaComponent,value);
                // console.log( cellObject);
    
    
                // When we update new formula in cell object then child value must be change according to new formula
                // Befor C1 = A1 + 2, Now C1=A1 + 15 then any C1 child like D1 value must be update
                // updateChildren(cellObject); 
            }
        }
        let computedValue=eval(formula); //Calculate value by evaluate function
        return computedValue;

}
    


//Update all child elements recursively,If we pass cellObject of A1 then it is finding all It's children like C1 or G2 and make changes in their values also if we change A1 value
function updateChildren(cellObject) 
{
    for(let i=0;i<cellObject.children.length;i++)
    {
        let childName= cellObject.children[i];//Get child name like C1 
        let {rowId,colId}= getRowIdColIdFromAddress(childName);
        let childCellObject= db[rowId][colId];//find C1 object
         
        //Update child object new value
        let newValue=solveFormula(childCellObject.formula);//We don't pass selfCellObject for update formula in it's child
        childCellObject.value=newValue;
        
        //Also make changes on website ui
        let cellUi= document.querySelector(`div[rowid='${rowId}'][colid='${colId}']`);
        cellUi.textContent=newValue;
        console.log("Changes applied on"+childName);


        //Update current childObject childrens values also 
        if(childCellObject.children.length!=0) //If childObject children array length is more than 0
        {
            console.log("Children recursive is"+ childCellObject.children);
            updateChildren(childCellObject);
        }
    }
    
}


//Remove all formula from every child and parent element C1{parent:[A1,D3]}
function removeFormula(cellObject){ 
    for(let i=0;i<cellObject.parent.length;i++)
    {
        let parentName=cellObject.parent[i]; //Select every parent in loop like A1 and D3
        let {rowId,colId}=getRowIdColIdFromAddress(parentName);
        let parentObject=db[rowId][colId]; //Select parent object like A1 object {children:[C1,E4,G6]}
        
        //Filter children without curr object name
        let updatedChildren=parentObject.children.filter(function(child){ //Pass C1,E4,G6 in child one by one
            return child!=cellObject.name; //( CellObject Name == C1 ) UpdatedChildren would be [E4, G6] 
        })

        parentObject.children=updatedChildren; // Update Old children array with new Updated children array
    }
    cellObject.parent=[]; // Current object all parents remove C1{ parent:[] }
}