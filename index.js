//改良版和我自己的不一样的地方：
// 1. 把所有东西都写进了renderlist，并且简化了三个filter的方程
// 2. 加了一个id给每个 budget， 方便delete和重新写入时候方便
// 3. 给delete button换了位置，不能在loop里面删除，要用id 删除



$(document).ready(function(){
    // everything inside this
    //create an budget object
    const budget = function(type,amount,date){
        this.type = type;
        this.amount = amount;
        this.date = date;
    }
    //get all data from local storage
    //give a variable called current 
    var currentFilter = "filter-all";
    var items  = JSON.parse(localStorage.getItem("budget"));
    if (!items) items=[];
    var total =0;

    function renderList(){
        // create a render list, contain funcitons:
        // 1. show total amount
        // 2. get all datas from local storage
        // 3. show all designed data on the list
        //clear list
        $(".list").html("");
        //clear total
        total = 0;
        //loop through every item
        for(let i = 0; i<items.length; i++){
            item = items[i];
            amount = item.amount;
            type = item.type;
            // calculate total amount
            changeTotal(Number(amount),type)      
             //create showing blocks  
            var wrapper = $("<div class='budget-item " + type + "' item-id='" + i + "'></div>");
            var newDiv = $("<div><h4>" + amount + "</h4><span>" + item.date + "</span></div>");
            var delBtn = $("<p class = 'delete'> delete </p>");

            //append everything to wrapper
            wrapper.append(newDiv).append(delBtn);
            //if condition for wether to display or not
            if(
                !(currentFilter == "filter-expense" && type == "income")&&
                !(currentFilter == "filter-income" && type == "expense")
            ){
                $(".list").append(wrapper);
            }    
        }
        //add function to delete button
        $(".delete").click(function () {
            var itemId = $(this).parent().attr("item-id");
            items.splice(itemId, 1);
            //不用担心id变了，因为重新用了一遍renderList，所有block的id都变了一次
            localStorage.setItem("budget", JSON.stringify(items));
            renderList();
          });
    }

    // display the list from the very start
    renderList();
    
    //give action to add income/expense button
    $(".addIncome").click(function(){
        var amount = $("#incomeAmount").val();
        console.log("user income input is: "+ amount );
        //error handling
        if(amount <0) console.error("income has to be positive");
        else if(amount=='') alert("empty income") 
        else{
        var newItem = new budget("income",amount, getDate());
        //get date of current input day
        items.push(newItem);
        //add income into income array in local storage first
        localStorage.setItem("budget", JSON.stringify(items));
        renderList();
        }
        $("#incomeAmount").val("") ;
    });
    $(".addExpense").click(function(){
        var amount = $("#expenseAmount").val();
        console.log("user expense input is: "+ amount );
        //error handling
        if(amount <0) console.error("expense has to be positive");
        else if(amount=='') alert("empty expense") 
        else{
        var newItem = new budget("expense",amount, getDate());
        //get date of current input day
        items.push(newItem);
        //add income into income array in local storage first
        localStorage.setItem("budget", JSON.stringify(items));
        renderList();
        }
        $("#expenseAmount").val("") ;
    });
    //get filter item
    $(".filter span").click(function () {
        $(".filter span").removeClass("active");
        $(this).addClass("active");
        currentFilter = $(this).attr("id");
        renderList();
      });

    //function for change total
    function changeTotal(amount,type){
        if(type=="income") total += amount;
        else if(type == "expense") total -= amount;

        if(total>=0){
            $('#totalAmount').addClass ("pos");
            $("#totalAmount").removeClass("neg");
        }
        else if(total<0){
            $('#totalAmount').removeClass ("pos");
            $('#totalAmount').addClass ("neg");
        }
        else{
            console.error("something wrong with change total");
        }
        $("#totalAmount").text(total);
    }

    //function for get designed date
    function getDate(){
        var d = new Date();
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var date = months[d.getMonth()]+" "+d.getDate() +", "+d.getFullYear();
        return date;
      }
});