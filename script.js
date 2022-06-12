let cellContainer=document.querySelector(".cell-container>.cell-inner");//Container 
let addressInput=document.querySelector("#address");//address bar
let formulaBar=document.querySelector("#formula");//formula bar

let sheetList=document.querySelector(".sheets-list");//All sheet-list div

let sheetOne=document.querySelector(".sheets-list>.sheet");
sheetEventListener(sheetOne);//Add event in first sheet 

let addSheetBtn=document.querySelector(".add-sheet");

let lastSelectedCell;

/*--------------------Set event listener on menu icons------------------------ */

let bold=document.querySelector(".bold");
let italic=document.querySelector(".italic");
let underline=document.querySelector(".underline");

let roboto=document.querySelector("option[value='roboto']");
let arial=document.querySelector("option[value='arial']");
let rockwell=document.querySelector("option[value='rockwell']");
let monospace=document.querySelector("option[value='monospace']");



let leftAlignIcon=document.querySelector(".left-side");
let centerAlignIcon=document.querySelector(".center-side");
let rightAlignIcon=document.querySelector(".right-side");

let bgColorIcon=document.querySelector("input[id='bg-color']");
let textColorIcon=document.querySelector("input[id='text-color']");

let topIcon=document.querySelector(".top-border");
let rightIcon=document.querySelector(".right-border");
let bottomIcon=document.querySelector(".bottom-border");
let leftIcon=document.querySelector(".left-border");
let outerIcon=document.querySelector(".outer-border");

let select=document.querySelector("#fontStyleSelect");


select.addEventListener("change",function()
{
    setFontStyle(select.value,select.value);
})


bold.addEventListener("click",function()
{
    setFontStyle("bold",bold);
})

italic.addEventListener("click",function()
{
    setFontStyle("italic",italic);
})

underline.addEventListener("click",function()
{
    setFontStyle("underline",underline);
})

bgColorIcon.addEventListener("blur",function(){
    setFontStyle("bgColor",bgColorIcon);
})

textColorIcon.addEventListener("blur",function(){
    setFontStyle("textColor",textColorIcon);
})


topIcon.addEventListener("click",function()
{
    setFontStyle("top",topIcon);
})

rightIcon.addEventListener("click",function()
{
    setFontStyle("right",rightIcon);
})

bottomIcon.addEventListener("click",function()
{
    setFontStyle("bottom",bottomIcon);
})

leftIcon.addEventListener("click",function()
{
    setFontStyle("left",leftIcon);
})

outerIcon.addEventListener("click",function()
{
    setFontStyle("outer",outerIcon);
})


leftAlignIcon.addEventListener("click",function()
{
    setFontStyle("leftAlign",leftAlignIcon);
})

centerAlignIcon.addEventListener("click",function()
{
    setFontStyle("centerAlign",centerAlignIcon);
})

rightAlignIcon.addEventListener("click",function()
{
    setFontStyle("rightAlign",rightAlignIcon);
})


/*--------------Make 2600 cell by DOM------------------------*/
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



//----------Initialization database array of every cell object-----------------------
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
                visited:false,
                bgColor:"#000000",
                textColor:"#000000",
                fontStyle:{
                    bold:false,
                    italic:false,
                    underline:false
                },borderStyle:{
                    top:false,
                    right:false,
                    bottom:false,
                    left:false,
                    outer:false
                },
                alignStyle:{
                    leftAlign:true,
                    centerAlign:false,
                    rightAlign:false
                },fontFamily:{
                    roboto:true,
                    arial:false,
                    rockwell:false,
                    monospace:false
                }

                
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

        let cellObject=db[rowId][colId];

        //Show formula value
        formulaBar.value=cellObject.formula;
        

        //Border hover
        let activeCell=document.querySelector(".active-cell");
        if(activeCell)
        {
            activeCell.classList.remove("active-cell");
            
        }
        let cell=document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`); //Change in ui
        cell.classList.add("active-cell");
        
        
        //Row and column address highlight

        let activeCol=document.querySelectorAll(".active-address"); //Remove previous selected row and column
        if(activeCol)
        {
            for(let i=0;i<activeCol.length;i++)
            {
                activeCol[i].classList.remove("active-address");
            }
        }

        //Add to new alphabet column
        let alphaColumn=document.querySelector(`.alpha-cells[no="${colId}"]`); 
        alphaColumn.classList.add("active-address");
        
        //Add to new number
        let numberRow=document.querySelector(`.number-cell[no="${rowId}"]`);
        numberRow.classList.add("active-address");


        //--------Check for font-style
        checkForIconStyle(cellObject);
        

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

        //-----Update it's children when blur event happens because new value is entered
        updateChildren(cellObject); //If blur happens in A1 then update all It's children value as well

        //-----------If cell object visited is true already then return
        if(cellObject.visited)
        {
            return;
        }
        cellObject.visited=true;
        visitedCells.push({"rowId":rowId,"colId":colId});

    })


    //When user click Backspace on C1 which had already formula present then it deletes formula
    allCells[i].addEventListener("keydown",function(e){
        if(e.key=='Backspace')
        {
            let cell=e.target;
            let {rowId,colId}=getRowAndColId(e);
            let cellObject=db[rowId][colId];

            cellObject.value="";//Clear Object value
            cell.textContent=""; //Clear Ui

            if(cellObject.formula)//If formula exist
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
            
            updateChildren(cellObject);

            
            //-----------If cell object visited is true already then return
            if(cellObject.visited)
            {
                return;
            }
            cellObject.visited=true;
            visitedCells.push({"rowId":rowId,"colId":colId});
            console.log(visitedCells);
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


    function setFontStyle(styleName,iconElement)
    {   

        if(lastSelectedCell) //If any cell selected already then that is our lastSelected cell
        {


            let {rowId,colId}=getRowAndColId(lastSelectedCell);
            let cellObject= db[rowId][colId];  


            //Change in font family


            if(styleName=="roboto")
            {
                lastSelectedCell.target.style.fontFamily="Roboto,RobotoDraft,Helvetica,Arial,sans-serif";

                cellObject.fontFamily.roboto=true;
                cellObject.fontFamily.arial=false; 
                cellObject.fontFamily.rockwell=false; 
                cellObject.fontFamily.monospace=false;
                
                let option=document.querySelector("option[selected]")
                option.removeAttribute("selected");
                roboto.setAttribute("selected","");
                return;

            }else if(styleName=="arial")
            {
                lastSelectedCell.target.style.fontFamily="Georgia, 'Times New Roman', Times, serif";

                cellObject.fontFamily.arial=true; 
                cellObject.fontFamily.roboto=false;
                cellObject.fontFamily.rockwell=false; 
                cellObject.fontFamily.monospace=false;
                
                let option=document.querySelector("option[selected]")
                option.removeAttribute("selected");
                arial.setAttribute("selected","");
                return;
                
            }else if(styleName=="rockwell")
            {
                lastSelectedCell.target.style.fontFamily="Rockwell";

                cellObject.fontFamily.rockwell=true; 
                cellObject.fontFamily.arial=false; 
                cellObject.fontFamily.roboto=false;
                cellObject.fontFamily.monospace=false;
                
                let option=document.querySelector("option[selected]");
                option.removeAttribute("selected");
                rockwell.setAttribute("selected","");

                return;
                
            }else if(styleName=="monospace")
            {
                lastSelectedCell.target.style.fontFamily="monospace";

                cellObject.fontFamily.monospace=true;
                cellObject.fontFamily.arial=false; 
                cellObject.fontFamily.roboto=false;
                cellObject.fontFamily.rockwell=false; 
                
                let option=document.querySelector("option[selected]")
                option.removeAttribute("selected");
                monospace.setAttribute("selected","");
                return;
            }




            // if left is align then make right and center object false and also remove active class from them and vice versa
            if(styleName=="leftAlign")
            {
                lastSelectedCell.target.style.textAlign="left";

                cellObject.alignStyle.leftAlign=true;
                cellObject.alignStyle.centerAlign=false;
                cellObject.alignStyle.rightAlign=false;

                leftAlignIcon.classList.add("active-font-style");
                centerAlignIcon.classList.remove("active-font-style");
                rightAlignIcon.classList.remove("active-font-style");
                console.log(cellObject);
                return;

            }else if(styleName=="centerAlign")
            {
                lastSelectedCell.target.style.textAlign="center";
                cellObject.alignStyle.centerAlign=true;
                cellObject.alignStyle.leftAlign=false;
                cellObject.alignStyle.rightAlign=false;

                centerAlignIcon.classList.add("active-font-style");
                leftAlignIcon.classList.remove("active-font-style");
                rightAlignIcon.classList.remove("active-font-style");
                return;
                
            }else if(styleName=="rightAlign"){
                lastSelectedCell.target.style.textAlign="right";
                cellObject.alignStyle.rightAlign=true;
                cellObject.alignStyle.leftAlign=false;
                cellObject.alignStyle.centerAlign=false;

                rightAlignIcon.classList.add("active-font-style");
                centerAlignIcon.classList.remove("active-font-style");
                leftAlignIcon.classList.remove("active-font-style");
                return;
            }


                //------------Check for background color
            if(styleName=="bgColor"){
                cellObject.bgColor=iconElement.value;//Change in object value
                lastSelectedCell.target.style.background=iconElement.value;//Change in ui
                return;
            }
            
            
            if(styleName=="textColor"){
                cellObject.textColor=iconElement.value;//Change in object value
                lastSelectedCell.target.style.color=iconElement.value;//Change in ui
                return;
            }
            
                    

            
            //If syleName is bold ,It will check for cellObject.fontStyle.bold is true means you are click again
            if(cellObject.fontStyle[styleName])
            {

                if(styleName=="bold")
                {
                    lastSelectedCell.target.style.fontWeight="normal";
                }else if(styleName=="italic")
                {
                    lastSelectedCell.target.style.fontStyle="normal";
                }else if(styleName=="underline"){
                    lastSelectedCell.target.style.textDecoration="none";
                }

                iconElement.classList.remove("active-font-style");

            }else{ 
                //If bold is false it means Now I made is true
                if(styleName=="bold")
                {
                    lastSelectedCell.target.style.fontWeight="bold";
                    iconElement.classList.add("active-font-style");
                    
                }else if(styleName=="italic")
                {
                    lastSelectedCell.target.style.fontStyle="italic";
                    iconElement.classList.add("active-font-style");
                }else if(styleName=="underline"){
                    lastSelectedCell.target.style.textDecoration="underline"; 
                    iconElement.classList.add("active-font-style");  
                }


            }
            //If bold is true before it make false
            cellObject.fontStyle[styleName] =!cellObject.fontStyle[styleName]; 




        //Check for border style
            if(cellObject.borderStyle[styleName])
            {

                if(styleName=="top")
                {
                    lastSelectedCell.target.style.borderTop=null;
                }else if(styleName=="right")
                {
                    lastSelectedCell.target.style.borderRight=null;
                }else if(styleName=="bottom"){
                    lastSelectedCell.target.style.borderBottom=null;
                }
                else if(styleName=="left"){
                    lastSelectedCell.target.style.borderLeft=null;
                }
                else if(styleName=="outer"){
                    lastSelectedCell.target.style.border=null;
                
                }
                
            

                iconElement.classList.remove("active-font-style");

            }else{ 
                if(styleName=="top")
                {
                    lastSelectedCell.target.style.borderTop="1.5px solid black";
                    // iconElement.classList.add("active-font-style");

                }else if(styleName=="right")
                {
                    lastSelectedCell.target.style.borderRight="1.5px solid black";
                    // iconElement.classList.add("active-font-style");

                }else if(styleName=="bottom"){
                    lastSelectedCell.target.style.borderBottom="1.5px solid black";
                    // iconElement.classList.add("active-font-style");
                }
                else if(styleName=="left"){
                    lastSelectedCell.target.style.borderLeft="1.5px solid black";
                    // iconElement.classList.add("active-font-style");
                }
                else if(styleName=="outer"){
                    lastSelectedCell.target.style.border="1.5px solid black";
                    // iconElement.classList.add("active-font-style");
                } 
                iconElement.classList.add("active-font-style");
            }
            cellObject.borderStyle[styleName] =!cellObject.borderStyle[styleName]; 



        }
    }

    function checkForIconStyle(cellObject)
    {

            /*----------Check for Icons-------------------*/
            let boldIcon=document.querySelector(".bold");
            let italicIcon=document.querySelector(".italic");
            let underlineIcon=document.querySelector(".underline");
            
            if(cellObject.fontStyle.bold)//If bold is true
            {
                boldIcon.classList.add("active-font-style"); //If true then we have to change bg-color it on ui
            }else{
                boldIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }


            if(cellObject.fontStyle.italic)//If italic is true
            {
                italicIcon.classList.add("active-font-style"); //If true then we have to change bg-color it on Ui
            }else{
                italicIcon.classList.remove("active-font-style");//If false then remove bg-color on Ui
            }


            if(cellObject.fontStyle.underline)//If underline is true
            {
                underlineIcon.classList.add("active-font-style"); //If underline is true then we have to change bg-color it on ui
            }else{
                underlineIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }









            /*----------Check for Background Icon-------------------*/


            let bgColorIcon=document.querySelector("input[id='bg-color']");
            if(cellObject.bgColor!="#000000")//If color is not black
            {
                //we have to change bg-color it on ui
                bgColorIcon.value=cellObject.bgColor; 
            }else{
                // remove bg-color on ui
                bgColorIcon.value="#000000"; 
            }


            /*----------Check for Text color Icon-------------------*/

            let textColorIcon=document.querySelector("input[id='text-color']");
            if(cellObject.textColor!="#000000")//If color is not black
            {
                //we have to change text-color it on ui
                textColorIcon.value=cellObject.textColor; 
            }else{
                //remove text-color on ui
                textColorIcon.value="#000000"; 
            }
            



            /*----------Check for Border Icon-------------------*/

            let topBorderIcon=document.querySelector(".top-border");
            if(cellObject.borderStyle.top)//If italic is true
            {
                topBorderIcon.classList.add("active-font-style"); //If true then we have to change bg-color it on Ui
            }else{
                topBorderIcon.classList.remove("active-font-style");//If false then remove bg-color on Ui
            }

            let rightBorderIcon=document.querySelector(".right-border");
            if(cellObject.borderStyle.right)//If italic is true
            {
                rightBorderIcon.classList.add("active-font-style"); //If true then we have to change bg-color it on Ui
            }else{
                rightBorderIcon.classList.remove("active-font-style");//If false then remove bg-color on Ui
            }


            let bottomBorderIcon=document.querySelector(".bottom-border");
            if(cellObject.borderStyle.bottom)//If underline is true
            {
                bottomBorderIcon.classList.add("active-font-style"); //If underline is true then we have to change bg-color it on ui
            }else{
                bottomBorderIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }


            let leftBorderIcon=document.querySelector(".left-border");
            if(cellObject.borderStyle.left)//If underline is true
            {
                leftBorderIcon.classList.add("active-font-style"); //If underline is true then we have to change bg-color it on ui
            }else{
                leftBorderIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }

            let outerBorderIcon=document.querySelector(".outer-border");
            if(cellObject.borderStyle.outer)//If underline is true
            {
                outerBorderIcon.classList.add("active-font-style"); //If underline is true then we have to change bg-color it on ui
            }else{
                outerBorderIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }





            /*----------Check for Align Icon-------------------*/  


            let leftAlignIcon=document.querySelector(".left-side");
            if(cellObject.alignStyle.leftAlign)//If underline is true
            {
                leftAlignIcon.classList.add("active-font-style"); //If underline is true then we have to change bg-color it on ui
            }else{
                leftAlignIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }


            let centerAlignIcon=document.querySelector(".center-side");
            if(cellObject.alignStyle.centerAlign)//If underline is true
            {
                centerAlignIcon.classList.add("active-font-style"); //If underline is true then we have to change bg-color it on ui
            }else{
                centerAlignIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }


            let rightAlignIcon=document.querySelector(".right-side");
            if(cellObject.alignStyle.rightAlign)//If underline is true
            {
                rightAlignIcon.classList.add("active-font-style"); //If underline is true then we have to change bg-color it on ui
            }else{
                rightAlignIcon.classList.remove("active-font-style");//If false then remove bg-color on ui
            }



            /*----------Check for Font Family Icon-------------------*/  


            let roboto=document.querySelector("option[value='roboto']");
            if(cellObject.fontFamily.roboto)
            {
                roboto.setAttribute("selected","");
                select.selectedIndex = 0;
            }else{
                roboto.removeAttribute("selected");   
            }

            let arial=document.querySelector("option[value='arial']");
            if(cellObject.fontFamily.arial)
            {
                arial.setAttribute("selected","");
                select.selectedIndex = 1;
            }else{
                arial.removeAttribute("selected");   
            }

            let rockwell=document.querySelector("option[value='rockwell']");
            if(cellObject.fontFamily.rockwell)
            {
                rockwell.setAttribute("selected","");
                select.selectedIndex = 2;
            }else{
                rockwell.removeAttribute("selected");   
            }

            let monospace=document.querySelector("option[value='monospace']");
            if(cellObject.fontFamily.monospace)
            {
                monospace.setAttribute("selected","");
                select.selectedIndex = 3;
                console.log("done");
            }else{
                monospace.removeAttribute("selected");   
            }



} 