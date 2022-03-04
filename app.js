const schoolFormSubmit = document.querySelector(".btn-outline-primary");
const schoolInputs = document.querySelectorAll("header input, header select");
const schoolForm = document.querySelector("header");
const schoolNameHeader = document.querySelector("main h1");
const classNum = document.getElementById("class-num");
const className = document.getElementById("class-name");
const studentNo = document.getElementById("student-no");
const studentName = document.getElementById("fullname");
const examResults = document.querySelectorAll(".input-group input");
const searchBtn = document.querySelector("main button");
const addStudent = document.getElementById("register");
const studentForm = document.querySelector("main");
const tableBody = document.querySelector("tbody");
const studentGrades = document.querySelectorAll(".grades");
const alertBox = document.getElementById("alert-box");
const resetBtn = document.querySelector('#reset');
const deleteAll = document.getElementById("delete-all")
console.log(schoolInputs[2]);
let clsNumbers = [];
const alphabet = "ABCDEFGHIJK";
let letters = [];
let alertDiv;

let data = JSON.parse(localStorage.getItem("school")) || {};
fillSelect();
console.log(Object.keys(data));
schoolNameHeader.innerHTML = localStorage.getItem("schoolName")
  ? `${localStorage.getItem(
      "schoolName"
    )}<br><span class="badge rounded-pill bg-info fs-4">${localStorage.getItem(
      "schoolType"
    )}</span>`
  : "Enter School Information";

schoolFormSubmit.addEventListener("click", (e) => {
  // e.preventDefault();
  console.log();
  school.schoolName = schoolInputs[0].value;
  school.type = schoolInputs[1].value;
  // let {schoolName, schoolType}= school
  //  clsNumbers= Array.from(Array(+schoolInputs[2].value+1).keys()).splice(1);  similar with bottom
  clsNumbers = [...Array(+schoolInputs[3].value + 1).keys()].splice(schoolInputs[2].value);
  console.log(clsNumbers);
  console.log(schoolInputs[3].value);
  letters = alphabet.slice(0, schoolInputs[4].value).split("");
  localStorage.setItem("school", JSON.stringify(school.clss()));
  localStorage.setItem("schoolName", school.schoolName);
  localStorage.setItem("schoolType", school.type);
  schoolNameHeader.innerHTML = `${localStorage.getItem(
    "schoolName"
  )}<br><span class="badge rounded-pill bg-info fs-4">${localStorage.getItem(
    "schoolType"
  )}</span>`;
  fillSelect();
  data = JSON.parse(localStorage.getItem("school"))
  console.log(school.classGroups());
  console.log(school.classes());

  console.log();
});
console.log(localStorage.getItem("schoolName"));
if (!localStorage.getItem("schoolName")) {
  schoolForm.classList.remove("d-none"); //alta al
  searchBtn.disabled = true;
  addStudent.disabled = true;
}
studentForm.addEventListener("change", (e) => {
  console.log(e);

  if (e.target.id == "class-num") {
    className.innerHTML = "";
    Object.keys(school.clsStudents.getStudents()[e.target.value]).forEach(
      (item) => {
        className.innerHTML += `<option value="${item}">${item}</option>`;
      }
    );
  }
  if (e.target.id == "fullname") {
    addStudent.disabled = false;
  }
});

studentForm.addEventListener("click", (e) => {
  if (e.target == searchBtn) {
    e.preventDefault();
    if (!className.value) {
      return showAlert("Select Class Name", "alert alert-warning");
    }
    if (studentNo.value) {
      let studentList = school.clsStudents.getStudents(
        classNum.value,
        className.value,
        studentNo.value
      );
      if (studentList) {
        let tableRow = `<tr>
    <th scope="row">${className.value}</th>
    <td>${studentNo.value}</td>
    <td>${studentList.info[0]}</td>
    <td>${studentList.info[1]}</td>
  </tr>`;
        tableBody.innerHTML = "";
        tableBody.innerHTML += tableRow;
        console.log(studentList.info[0]);
        console.log(studentList.info[1].toString());
      } else {
        showAlert(
          "There is not a student with search arguments",
          "alert alert-warning"
        );
      }
    } else {
      let studentList = school.clsStudents.getStudents(
        classNum.value,
        className.value,
        studentNo.value
      );
      tableBody.innerHTML = "";
      Object.keys(studentList).forEach((studentNo) => {
        let {
          [studentNo]: {
            info: [fullname, [grades]],
          },
        } = studentList;
        let tableRow = `<tr>
    <th scope="row">${className.value}</th>
    <td>${studentNo}</td>
    <td>${fullname}</td>
    <td>${grades}<button type="button" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button></td>
  </tr>`;
        tableBody.innerHTML += tableRow;
        console.log(studentNo,fullname, grades);
      });
    }
  }
  if (e.target == addStudent) {
    e.preventDefault();
    school.clsStudents.addStnt(
      classNum.value,
      className.value,
      studentNo.value,
      studentName.value,
      [...studentGrades].map((x) => x.value)
    );
    showAlert(`${studentNo.value} : ${studentName.value}'s record has been added.`,"success" )
    console.log([...studentGrades].map((x) => x.value));
  }
  if (e.target== resetBtn ) {
    className.innerHTML=""
  }
  if (e.target==deleteAll&&confirm("Are you sure you want to delete all entries!!!")) {
    
    school.clsStudents.deleteAll()
  }
  if (e.target.classList.contains("btn-close")) {
    if (confirm("Are you sure you want to delete student entry!")) {
      
      let [clsName, no, studentName]= [...e.target.parentElement.parentElement.children].map((x)=>x.innerHTML); 
      console.log([...e.target.parentElement.parentElement.children].map((x)=>x.innerHTML)); 
      console.log(clsName[0],clsName,no)
      school.clsStudents.deleteStudent(clsName[0],clsName,no)
      e.target.parentElement.parentElement.remove()
      showAlert(`${no} : ${studentName}'s record has been deleted.`,"danger" )
    }
    }
});

function fillSelect() {
  classNum.innerHTML = "";
  classNum.innerHTML = `<option selected disabled>Select Grade</option>`;
  Object.keys(data).forEach((item) => {
    classNum.innerHTML += `<option value="${item}">${item}</option>`;
  });
}

const school = {
  schoolName: "School Name",
  schoolType: "School Type",

  clss: function () {
    let obj = {};
    let clss = {};
    let d = clsNumbers[0];

    let list = this.findClassesWithLetters(d);
    for (const i of clsNumbers) {
      for (const j of list) {
        obj[j] = {};
      }
      d++;
      clss[i] = obj;
      obj = {};

      list = this.findClassesWithLetters(d);
    }

    return clss;
  },
  classGroups: () => {
    // let clsWithLttrs = Object.keys(school.clsStudents.getStudents()[1]);

    const clsWithLttrs = new Map();
    console.log(clsNumbers + letters);
    clsNumbers.forEach((item) => {
      for (let i = 0; i < letters.length; i++) {
        let temp = `${item}-${letters[i]}`;
        clsWithLttrs.set(temp, item);
      }
    });
    return clsWithLttrs;
  },
  findClassesWithLetters: function (number) {
    // const a = new Map();

    let a = [...this.classGroups().entries()].filter((a) => a[1] === number);
    a.forEach((e) => {
      e.splice(1, 1);
    });
    let b = a.flat();
    return b;
  },
  classes: function () {
    const classList = new Map(school.classGroups());
    [...classList.keys()].forEach((key) => {
      classList.set(key, 0);
    });
    // classList.forEach((_,i) => {classList.set(i,0)});

    return classList;
  },
  clsStudents: {
    addStnt: function (clsNum, clsName, no, ad, ...notlar) {
      // nulish operator
      let data = JSON.parse(localStorage.getItem("school")); //?? school.clss();
      // console.log(data);

      Object.keys(data).forEach((item) => {
        Object.keys(data[item]).forEach((innerItem) => {
          Object.keys(data[item][innerItem]).forEach((inner2Item) => {
            if (inner2Item == no) {
              if (
                confirm(
                  `At ${innerItem} class there is same ${inner2Item} number. Do you want to update?`
                )
              ) {
                data[clsNum][clsName][no] = { info: [ad, notlar] };
                localStorage.setItem("school", JSON.stringify(data));
                return data;
              }
            }
          });
        });
      });
      data[clsNum][clsName][no] = { info: [ad, notlar] };
      // let info = new Map();
      // s[2]["2-A"] = info.set(11, 222);
      // s[clsNum][clsName] = info.set(no, [ad, notlar]);
      // console.log(data);
      localStorage.setItem("school", JSON.stringify(data));
      return data;
    },
    getStudents: function (clsNum, clsName, no) {
      let data = JSON.parse(localStorage.getItem("school"));
      if (clsNum && clsName && no) {
        return data[clsNum][clsName][no];
      } else if (clsNum && clsName) {
        return data[clsNum][clsName];
      } else if (clsNum) {
        return data[clsNum];
      } else {
        return data;
      }
    },
    deleteStudent: (clsNum, clsName, no)=>{
      let data = JSON.parse(localStorage.getItem("school"));
      delete data[clsNum][clsName][no];
      localStorage.setItem("school", JSON.stringify(data));
console.log(data);
    },
    deleteAll: ()=>{
      localStorage.removeItem("school");
      localStorage.removeItem("schoolName");
      localStorage.removeItem("schoolType");
    }
  },
};
console.log(data);
console.log(school.classGroups());
// school.classes=Object.fromEntries(school.classGroups())
console.log(school.classes());

// school.clsStudents.deleteStudent(1, "1-D", 1323)

// console.log(school.classGroups().get("1-A"));

// console.log(school.findClassesWithLetters(1));

// school.clsStudents.addStnt(1, "1-A", 1123, "bbbccc", 55, 43, 54);
// console.log(school.clsStudents.getStudents()[1]);
// console.log(Object.keys(school.clsStudents.getStudents()[1]) );

// console.log(school.clsStudents.addStnt("ali", 1, "1-A"));
// school.clss()[1]["1-A"] = ["ali"];

// console.log(school.clss());

// let sc = {
//   1: {
//     "1-A": {
//       101: ["ali", "veli"],
//     },
//   },
// };

// console.log(sc[1]["1-A"][101]);

function showAlert(str, alertType, strongStr = "") {
  let alertDiv = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
 <strong>${strongStr}</strong> ${str}
 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
  alertBox.innerHTML = alertDiv;
}
