//Container 
let cellContainer=document.querySelector(".cell-container>.cell-inner");
//address bar
let addressInput=document.querySelector("#address");
//formula bar
let formulaBar=document.querySelector("#formula");

let sheetList=document.querySelector(".sheets-list");
let addSheetBtn=document.querySelector(".add-sheet");
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
                children:[],
                parent:[]
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
        console.log("After update");

        // Update it's children when blur event happens because new value is entered
        updateChildren(cellObject);

    })

    allCells[i].addEventListener("keydown",function(e){
        if(e.key=='Backspace')
        {
            let cell=e.target;
            let {rowId,colId}=getRowAndColId(e);
            let cellObject=db[rowId][colId];
            cellObject.value="";
            if(cellObject.formula)
            {
                cellObject.formula="";
                formulaBar.value="";
                cell.textContent="";

                removeFormula(cellObject);
            }
        }

    })


}



formulaBar.addEventListener("blur",function(e){
    let formula=e.target.value;
    if(formula)
    {
        let{rowId,colId}=getRowAndColId(lastSelectedCell);
        //Get cell object of that last selected cell
        let cellObject=db[rowId][colId];

        if(cellObject.formula)//If already formula present means we are changing out formula
        {
            removeFormula(cellObject); //Remove all previous child and parent name from curr object to add new parent and child
        }
        //Passing cell object in which formula is applied for parent children purpose
        let computedValue=solveFormula(formula,cellObject);
        
        cellObject.value=computedValue; //Update new compute value
        cellObject.formula=formula;//Update new formula

        lastSelectedCell.target.textContent= computedValue; //Change in Ui
        console.log(lastSelectedCell);
        
        updateChildren(cellObject);
    }
})




let sheetId=0;
addSheetBtn.addEventListener("click",function(e){
    sheetId++;
    if(sheetId<=8)
    {

    //Remove active status from last selected sheet
    let activeSheet=document.querySelector(".active-sheet");
    activeSheet.classList.remove("active-sheet");


    //Create new sheet div
    let sheetDiv=document.createElement("div");
    sheetDiv.classList.add("sheet");
    sheetDiv.classList.add("active-sheet");
    sheetDiv.setAttribute("sheetid",sheetId);
    sheetDiv.innerHTML=`<p>Sheet ${sheetId}</p>`;
    sheetList.append(sheetDiv);


    
    sheetDiv.addEventListener("click",function(){
        //Remove active status from last selected sheet
        let activeSheet=document.querySelector(".active-sheet");
        activeSheet.classList.remove("active-sheet");

        //Add active on new sheet
        sheetDiv.classList.add("active-sheet");
    })

    


    }

   
})

