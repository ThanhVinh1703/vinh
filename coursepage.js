// lấy dữ liệu từ local storage
let databaseCourse = JSON.parse(localStorage.getItem("dataCourse"));



// gọi HTML element
let tbody = document.getElementById("tbody");
let addBtn = document.getElementById("add-btn");
let closeAddBtn = document.querySelector("#add-form .close-add")
let btnCloseA = document.querySelector(".btnCloseForm")
let addForm = document.getElementById("add-form");
let mainAddForm = document.getElementsByClassName("form")[0];



function render(){
    tbody.innerHTML = "";
    for(let index in databaseCourse){
        let trangThai = "";
        if(databaseCourse[index].trangThai === true){
            trangThai = `Hoạt động
                        `;
        }else{
            trangThai = `Không hoạt động &emsp;
                        `;
        };
        let tr = `<tr> 
                    <td>${+index +1}</td>
                    <td>${databaseCourse[index].maKhoaHoc}</td>
                    <td>${databaseCourse[index].tenKhoahoc}</td>
                    <td>${databaseCourse[index].thoiGian}</td>
                    <td>${trangThai}</td> 
                    <td>
                        <button class="update-btn" data-id="${databaseCourse[index].stt}">Sửa</button>
                        <button class="delete-btn" data-id="${databaseCourse[index].stt}">Xóa</button>
                    </td>
                    
                  </tr>`;
        tbody.innerHTML= tbody.innerHTML + tr;          
    }
}
render();


// mở và đóng form thêm mới
addBtn.onclick = function(){
    addForm.classList.remove("add-form")
}
closeAddBtn.onclick = function(){
    addForm.classList.add("add-form")
}
btnCloseA.onclick = function(){
    addForm.classList.add("add-form");
}

//lấy trạng thái người dung

function userStatus(){
    let status = document.querySelector(`input[name="status"]:checked`)
    if(status){
        if(status.id === "active"){
            return true;
        }else{
            return false;
        };
    }  
}
// sự kiện thêm mới nhân viên
mainAddForm.onsubmit = function(event){    
    event.preventDefault();
    let statusUser = userStatus();
    console.log(mainAddForm.maKhoaHoc);  
    let course = {
        stt: Math.random(),
        maKhoaHoc: mainAddForm.maKhoaHoc.value,
        tenKhoaHoc: mainAddForm.tenKhoahoc.value,
        thoiGian: mainAddForm.thoiGian.value,
        trangThai: statusUser,
    };
    databaseCourse.push(course);   
    render(databaseCourse);
    
};


// tìm kiếm dữ liệu khóa học
let searchInput = document.getElementById("search-Input");
let searchButton = document.getElementById("search-Button");

searchButton.addEventListener("click", function(){
    let question = searchInput.value;
    let result = [];
    for( let i = 0; i < databaseCourse.length; i++){
        if(
            databaseCourse[i].maKhoaHoc.indexOf(question) !== -1 ||
            databaseCourse[i].tenKhoahoc.indexOf(question) !== -1
        ){
            result.push(databaseCourse[i]);
        }
    }
    render(result);
});

// Sắp xếp dữ liệu khóa học
let sortByName = document.getElementById("sortByName");
// gắn sự kiện
sortByName.addEventListener("change",function(){
    let sortValue = sortByName.value;
    if(sortValue === "2"){
    // tăng dần
      databaseCourse.sort((a, b) =>{
        let numberA = parseInt(a.tenKhoahoc.substring(9));
        let numberB = parseInt(b.tenKhoahoc.substring(9));
        return numberB - numberA;
      });
    }else if(sortValue === "1"){
    // giảm dần
      databaseCourse.sort((a, b) => {
        let numberA = parseInt(a.tenKhoahoc.substring(9));
        let numberB = parseInt(b.tenKhoahoc.substring(9));
        return numberA - numberB;
    });
    }
    render(databaseCourse);
});

// gọi button
let updateFormBtn = document.getElementById("update-form");
let btnChange = document.querySelectorAll(".update-btn");
let closeUpdateBtn = document.querySelector("#update-form .close-update");
let closeEdit = document.querySelector("#update-form .closeUpdate");
// gọi update-form
let updateForm = document.getElementById("updateNew");
let updateCourseIdInput = document.getElementById("updatedCourseId")

// mở hàm form cập nhật khóa học
btnChange.forEach((button) => {
    button.addEventListener("click",function() {
        // lấy id của từng buttom
        let courseId = this.getAttribute("data-id");
        // tìm đối tượng khóa học
        let courseToUpdate = databaseCourse.find((course) => course.stt == courseId); 

        updateCourseIdInput.value = courseToUpdate.stt;
        updateForm.editIdCourse.value = courseToUpdate.maKhoaHoc;
        updateForm.editNameCourse.value = courseToUpdate.tenKhoahoc;
        updateForm.editTimeCourse.value = courseToUpdate.thoiGian;
        if(courseToUpdate.trangThai){
            updateForm.updateStatus[0].checked = true;
        } else {
            updateForm.updateStatus[1].checked = true;
        }
        // mở form cập nhật
        updateFormBtn.classList.remove("update-form");
    });
});
// Đóng form cập nhật khi bấm nút đóng
closeUpdateBtn.onclick = function () {
    updateFormBtn.classList.add("update-form");
};
closeEdit.onclick = function () {
    updateFormBtn.classList.add("update-form");
};

// hàm update
updateForm.onsubmit = function(event){
    event.preventDefault();
    let updatedCourseId = updateCourseIdInput.value;
    let courseIndex = databaseCourse.findIndex(
        (course) => course.stt == updatedCourseId
    );
    if (courseIndex > -1) {
        databaseCourse[courseIndex] = {
          stt: updatedCourseId,
          maKhoaHoc: updateForm.editIdCourse.value,
          tenKhoahoc: updateForm.editNameCourse.value,
          thoiGian: updateForm.editTimeCourse.value,
          trangThai: updateForm.updateStatus[0].checked, // Assuming the first radio button is for "Hoạt động"
        };
        render(databaseCourse); // Re-render the table
        updateFormBtn.classList.add("update-form"); // Close the update form
      }
};



// Update delete logic
let deleteForm = document.getElementById("delete-form");
let deleteMessage = document.getElementById("delete-message");
let courseIdToDelete = null;

// Open delete form
tbody.addEventListener("click", function(event){
    if(event.target.classList.contains("delete-btn")){
        courseIdToDelete = event.target.getAttribute("data-id");
        let course = databaseCourse.find(course => course.stt == courseIdToDelete);
        if (course) {
            deleteMessage.textContent = `Bạn có chắc muốn xóa ${course.tenKhoahoc}?`;
            deleteForm.classList.remove("delete-form");
        }
    }
});

// Handle the form close
let closeDeleteBtns = document.querySelectorAll(".close-delete");
closeDeleteBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
        deleteForm.classList.add("delete-form");
        courseIdToDelete = null; // Reset the id
    });
});

// Handle delete confirmation
let deleteNewForm = document.querySelector(".deleteNew");
deleteNewForm.onsubmit = function(event) {
    event.preventDefault();
    if (courseIdToDelete) {
        databaseCourse = databaseCourse.filter(course => course.stt != courseIdToDelete);
        render(databaseCourse); // Re-render the table
        deleteForm.classList.add("delete-form"); // Close the form
        courseIdToDelete = null; // Reset the id after deletion
    }
};


















