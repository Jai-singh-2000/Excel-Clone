let cellContainer=document.querySelector(".cell-container>.cell-inner");//Container 
let addressInput=document.querySelector("#address");//address bar
let formulaBar=document.querySelector("#formula");//formula bar

let sheetList=document.querySelector(".sheets-list");//All sheet-list div

let sheetOne=document.querySelector(".sheets-list>.sheet");
sheetEventListener(sheetOne);//Add event in first sheet 

let addSheetBtn=document.querySelector(".add-sheet");

let lastSelectedCell;


//----------Make 2600 cell by dom
function cellsInit()
{
    let cell="";

    cell+="<div class='alphabet-container'>";
    cell+=`<div class="alpha-cells"></div>`;
    for(let i=0;i<26;i++)
    {
        cell+=`<div class="alpha-cells" no="${i}"><p>${String.fromCharCode(65+i)}</p></div>`;
    }


    cell+="</div>";

    for(let i=0;i<100;i++)
    {
        cell+="<div class='cell-row'>"
        cell+=`<div class='number-cell' no="${i}"><p>${i+1}</p></div>`;
        for(let j=0;j<26;j++)
        {
            // cell
            cell+=`<div class='cell' rowid='${i}' colid='${j}' contentEditable></div>`;
        }
        cell+="</div>";
    }

    cellContainer.innerHTML=cell;
    

}

cellsInit();



//----------Initialization database array of every cell object
let allSheetsDb=[];
let db;
let visitedCells;
function databaseInit()
{
    let newDb=[];
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
                parent:[],
                visited:false
            }
            row.push(cellObj);
        }
        newDb.push(row);
    }
    db=newDb;//Make db 
    
    visitedCells=[]; //Make visited cell array in every database sheet[index]

    allSheetsDb.push({db:newDb,visitedCells:visitedCells});//Push db and visited array Objects in every sheet

    console.log(allSheetsDb);
}

databaseInit();



//------Add event on every cell by loop [cell=2600]
let allCells=document.querySelectorAll(".cell");
for(let i=0;i<allCells.length;i++)
{
    //Event on cell of click
    allCells[i].addEventListener("click",function(e){

        //`Object destructing` after return object value from (function getRowAndColId)
        let{rowId,colId}=getRowAndColId(e);
        let address=String.fromCharCode(65+colId)+(rowId+1);
        addressInput.value=address;

        let cellObject=db[rowId][colId]
        //Show formula value
        formulaBar.value=cellObject.formula;
        


        //Border hover
        let activeCell=document.querySelector(".active-cell");
        if(activeCell)
        {
            activeCell.classList.remove("active-cell");
            
        }
        let cell=document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`);
        cell.classList.add("active-cell");
        
        
        //Row and column address highlight

        let activeCol=document.querySelectorAll(".active-address"); //remove previous selected row and column
        if(activeCol)
        {
            for(let i=0;i<activeCol.length;i++)
            {
                activeCol[i].classList.remove("active-address");
            }
        }
        
            
        let alphaColumn=document.querySelector(`.alpha-cells[no="${colId}"]`); //Add to new alphabet column
        alphaColumn.classList.add("active-address");
        
        let numberRow=document.querySelector(`.number-cell[no="${rowId}"]`);//Add to new number
        numberRow.classList.add("active-address");

        

    })

    //Value update after blur event on every cell (total==2600)
    allCells[i].addEventListener("blur",function(e){
        let cellValue=e.target.textContent;

        lastSelectedCell=e; //Last selected cell details after blur event happen

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

        //-----Update it's children when blur event happens because new value is entered
        updateChildren(cellObject); //If blur happens in A1 then update all It's children value as well

        //-----------If cell object visited is true already then return
        if(cellObject.visited)
        {
            return;
        }
        cellObject.visited=true;
        visitedCells.push({"rowId":rowId,"colId":colId});
        console.log(visitedCells);

    })


    //When user click Backspace on C1 which had already formula present then it deletes formula
    allCells[i].addEventListener("keydown",function(e){
        if(e.key=='Backspace')
        {
            let cell=e.target;
            let {rowId,colId}=getRowAndColId(e);
            let cellObject=db[rowId][colId];
            cellObject.value="";
            if(cellObject.formula)
            {
                cellObject.formula=""; //Update db cell formula
                formulaBar.value=""; //Clear formula bar on Ui
                cell.textContent=""; //Cell content got full erase on 1 backspace

                //Remove Cell name(C1) from it's Parent's.children Like A1.children[B2,C1] remove C1 from there
                removeFormula(cellObject); 
            }
        }

    })


}


//Event when we insert formula in formula bar
formulaBar.addEventListener("blur",function(e){
    let formula=e.target.value; //Take value from formula bar

    if(formula)
    {
        let{rowId,colId}=getRowAndColId(lastSelectedCell);//Get row&col id of lastSelected cell

        //Find cell object of that last selected cell
        let cellObject=db[rowId][colId];

        //If already formula present means we are inserting new formula 
        if(cellObject.formula)
        {
            //Remove all previous child and parent name from curr object because new formula may contain new parent and child elements 
            removeFormula(cellObject); 
        }

        //Passing cell object in which formula is applied for parent children purpose
        let computedValue=solveFormula(formula,cellObject);
        
        cellObject.value=computedValue; //Update new compute value
        cellObject.formula=formula;//Update new formula

        lastSelectedCell.target.textContent= computedValue; //Change in Ui
        
        // console.log(lastSelectedCell);
        updateChildren(cellObject);
    }
})




let sheetId=0;
addSheetBtn.addEventListener("click",function(){
    sheetId++;
    if(sheetId<=7)
    {

    //---------Remove active status from last selected sheet
    let activeSheet=document.querySelector(".active-sheet");
    activeSheet.classList.remove("active-sheet");


    //---------- Create new sheet div
    let sheetDiv=document.createElement("div");
    sheetDiv.classList.add("sheet");
    sheetDiv.classList.add("active-sheet");
    sheetDiv.setAttribute("sheetid",sheetId);
    console.log(sheetId);
    sheetDiv.innerHTML=`<p>Sheet ${sheetId+1}</p>`;
    sheetList.append(sheetDiv);
    
    clearUi();
    databaseInit(); //create new db after click on new sheet    

    //------ Add event of toggle on every sheet we create
    sheetEventListener(sheetDiv);
        

    }
})


function sheetEventListener(sheet)
{
    sheet.addEventListener("click",function(){
        if(sheet.classList.contains("active-sheet"))
        {
            return;
        }
        clearUi();

        //Remove active status from last selected sheet
        let activeSheet=document.querySelector(".active-sheet");
        activeSheet.classList.remove("active-sheet");
        //Add active on new sheet
        sheet.classList.add("active-sheet");
        
        let sheetId=sheet.getAttribute("sheetid");
        console.log(sheetId);
        db=allSheetsDb[sheetId].db; //Select db of sheetDb[index] Eg:- db = allSheetDb[2] means 3rd sheet db address pass
        visitedCells=allSheetsDb[sheetId].visitedCells; //Select visitedCells of sheetDb[index]
        
        setUiValue(); //Set value of selected db in Website Ui
    })
}


function clearUi()
{
    for(let i=0;i<100;i++)
    {
        for(let j=0;j<26;j++)
        {
            let cell=document.querySelector(`div[rowid="${i}"][colid="${j}"]`);
            cell.innerHTML="";
        }
    }
}


function setUiValue()
{
    for(let i=0;i<visitedCells.length;i++)
    {
        let {rowId,colId}=visitedCells[i];
        let cellObject=db[rowId][colId];
        let cell=document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`);
        cell.innerHTML=cellObject.value; 
       console.log(cellObject.value)
    }
}

