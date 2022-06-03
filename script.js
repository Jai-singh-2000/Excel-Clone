//Container 
let cellContainer=document.querySelector(".cell-container>.cell-inner");
//address bar
let addressInput=document.querySelector("#address");
//formula bar
let formulaBar=document.querySelector("#formula");
let lastSelectedCell;


//Make 2600 cell by dom
function cellsInit()
{
    let cell="";

    cell+="<div class='alphabet-container'>";
    cell+=`<div class="alpha-cells"></div>`;
    for(let i=0;i<26;i++)
    {
        cell+=`<div class="alpha-cells"><p>${String.fromCharCode(65+i)}</p></div>`;
    }


    cell+="</div>";

    for(let i=0;i<100;i++)
    {
        cell+="<div class='cell-row'>"
        cell+=`<div class='number-cell'>${i+1}</div>`;
        for(let j=0;j<26;j++)
        {
            // cell
            cell+=`<div class='cell' rowId='${i}' colId='${j}' contentEditable></div>`;
        }
        cell+="</div>";
    }

    cellContainer.innerHTML=cell;
    

}

cellsInit();



//Initialization database array of every cell object
let db=[];
function databaseInit()
{
   
    for(let i=0;i<100;i++)
    {
        let row=[];
        for(let j=0;j<26;j++)
        {
            let cellObj={
                name: String.fromCharCode(65+j) + (i+1),
                value:"",
                formula:"",
                children:[]
            }
            row.push(cellObj);
        }
        db.push(row);
    }


}

databaseInit();



//Add event on every cell by loop [cell=2600]
let allCells=document.querySelectorAll(".cell");
for(let i=0;i<allCells.length;i++)
{
    //Event on cell of click
    allCells[i].addEventListener("click",function(e){

        //`Object destructing` after return object value from (function getRowAndColId)
        let{rowId,colId}=getRowAndColId(e);
        let address=String.fromCharCode(65+colId)+(rowId+1);
        addressInput.value=address;

        //Show formula value
        formulaBar.value=db[rowId][colId].formula;
        // console.log(formulaBar.value);
    })

    //Value update after blur event on every cell (total==2600)
    allCells[i].addEventListener("blur",function(e){
        let cellValue=e.target.textContent;

        //Last selected cell details after blur event happen
        lastSelectedCell=e;
        // console.log(lastSelectedCell);

        //`Object destructing` after return object value from (function getRowAndColId)
        let{rowId,colId}=getRowAndColId(e);
        
        let cellObject=db[rowId][colId];
        if(cellObject.value==cellValue)
        {  
            return; // If new written value in cell is same as already wrote value then `return`
        }

        //If user input new value in cell then update that value in cellObject alse
        cellObject.value=cellValue;
        

    })
}



formulaBar.addEventListener("blur",function(e){
    let formula=e.target.value;
    if(formula)
    {
        let{rowId,colId}=getRowAndColId(lastSelectedCell);
        
        //Get cell object of that last selected cell
        let cellObject=db[rowId][colId];
        //Passing cell object in which formula is applied for parent children purpose
        let computedValue=solveFormula(formula,cellObject);
        
        cellObject.value=computedValue;
        cellObject.formula=formula;
        // console.log(cellObject);

        lastSelectedCell.target.textContent= computedValue;
        console.log(lastSelectedCell);
    }
})







//


