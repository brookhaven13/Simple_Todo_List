let section = document.querySelector("section");

//新增todo項目功能
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    //prevent form from being submitted.
    e.preventDefault();    

    // get the input values
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    //Checker
    if (todoText == "") {
        alert("Please enter your goal.");
        return;
    }

    if (todoMonth == "" || todoMonth > 12 || todoMonth < 1) {
        alert("Please enter a valid number.");
        return;
    }

    if (todoDate== "" || todoDate > 31 || todoDate < 1) {
        alert("Please enter a valid number.");
        return;
    }

    //create todo item
    createTodoItem(todoText, todoMonth, todoDate);

    //create an object
    let todoObj = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    }  

    //store obj into localStorage as array date type.
    let list = localStorage.getItem("list");
    storeList(list, todoObj);

    form.children[0].value = ""; //clear the text input    
});

//排序todo項目功能
let sort = document.querySelector("div.sort button");
sort.addEventListener("click", () => {
    //sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    //remove old todo data on Webpage
    let len = section.children.length;
    for (let i=0; i < len; i++) {
        section.children[0].remove();
    }
    //load data
    loadData();
});

//載入網頁時，先load localStorage data，並呈現在網頁上
loadData();


// FUNCTIONS 
//load localStorage
function loadData() {
    let todoList = localStorage.getItem("list");
    if (todoList !== null) {
        let todoListArray = JSON.parse(todoList);
        todoListArray.forEach( item => {
            createTodoItem(item.todoText, item.todoMonth, item.todoDate);
        });
    }
}

//create a todo item function
function createTodoItem(todoText, todoMonth, todoDate) {
    //create todo list
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    // create check and trash can icons
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    });

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
            //remove the todo from localStorage
            let text = todoItem.children[0].innerText;
            let listArray = JSON.parse(localStorage.getItem("list"));
            listArray.forEach((item, index)=> {
                if(item.todoText == text) {
                    listArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(listArray));
                }
            });
            //remove the todo from Webpage
            todoItem.remove();  
        })
        todoItem.style.animation = "scaleDown 0.3s forwards";
    });

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";
    section.appendChild(todo);
}

//store data into an array of objects function
function storeList(list, obj) {
    //check if the local storage is empty
    //將多個objects資料存在一個Array內
    if (list == null) {
        //若為空，將第一筆資料(obj)放入
        localStorage.setItem("list",JSON.stringify([obj]));
    } else {
        //若不為空，再將前面幾筆資料提領出來後，先轉換回Array格式，再將最新資料push進Array中
        let listArray = JSON.parse(list);//取出的Array存入一個變數
        listArray.push(obj);//將新一筆obj放入Array中
        localStorage.setItem("list", JSON.stringify(listArray));
    }
}

//merge sort functions
function mergeTime(arr1, arr2) {
    let result = [];
    let i=0;
    let j=0;

    while(i < arr1.length && j < arr2.length) {
        if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if(Number(arr1[i].todoDate) < Number(arr2[j].todoDate)) {
                result.push(arr1[i]);
                i++;
            } else {
                result.push(arr2[j]);
                j++;
            }
        }
    }
    
    while(i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }

    while(j < arr2.length) {
        result.push(arr2[j]);
        j++;
    } 
    return result;  
}

function mergeSort(arr){
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }    
}