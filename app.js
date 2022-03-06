const schoolFormSubmit = document.querySelector(".btn-outline-primary");
const schoolInputs = document.querySelectorAll(".modal input, .modal select");
// const schoolForm = document.querySelector("header");
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
const schoolForm = document.getElementById('staticBackdrop')
const modalLauncher = document.getElementById("modal-launcher")


/**  başlangıçta modal açılması için verilen bootstrap5 destekli kodlar fakat problem çıkarıyor
var myModal = new bootstrap.Modal(schoolForm, {})
schoolForm.show()
*/
// fonksiyonları yukarıda topladım 


// localstorage da kayıt varsa içinden sınıf sayılarını çeker ve bunlar ile select içne options koyar
function fillSelect() {
  classNum.innerHTML = "";
  classNum.innerHTML = `<option selected disabled>Select Grade</option>`;
  Object.keys(data).forEach((item) => {
    classNum.innerHTML += `<option value="${item}">${item}</option>`;
  });
}
//! tablonun üst kısmında yapılan işleme göre alarm div oluşturuyor. str=metin kısmı/ alertType= "warning", "success" bootstrap classları/ strongStr= Dikkat edilmesini istediğiniz metin, başta çıkıyor. burada default değerler de koydum. strongStr opsiyonel.
function showAlert(str="Error", alertType="warning", strongStr = "") {
  let alertDiv = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
 <strong>${strongStr}</strong> ${str}
 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
 </div>`;
 //* burada tablonun üst kısmında bulunan boş div içine alert oluşturuyoruz. faydası üst üste oluşan alertler aynı yerde tek çıkıyor. alert içinde kapatma butonu da var */
 alertBox.innerHTML = alertDiv;
}
//okul sınıf numaralarını oluştururken kullandığımız boş değişkenler
let clsNumbers = [];
let letters = [];

// burada eğer localStorage içinde daha önce kayıtlarımız varsa çekiyoruz. yoksa boş bir obje oluşturuyoruz
let data = JSON.parse(localStorage.getItem("school")) || {};
// datayı çektikten sonra sınıf listesini doldurduk
fillSelect();
//* main kısmındaki başlığa ternary if ile localstorage dan varsa okul ismini çektik, yoksa "Enter School Information" yazdırdık  */ 
schoolNameHeader.innerHTML = localStorage.getItem("schoolName")
? `${localStorage.getItem(
  "schoolName"
  )}<br><span class="badge rounded-pill bg-info fs-4">${localStorage.getItem(
    "schoolType"
    )}</span>`
    : "Enter School Information";
    
    /** burada okul genel bilgilerinin local'de kayıtlı olup olmadığını okul ismiyle 
      kontrol ediyoruz. eğer yoksa modal açma butonunu click'ledik. daha stabil yol bulamadım.
       arama/ekleme butonlarını deaktif yapıyoruz */
    if (!localStorage.getItem("schoolName")) {
      window.onload = () => {
        modalLauncher.click()
      }
      //modal açıldığında ilk inputu aktif etme
      schoolForm.addEventListener('shown.bs.modal', function () {
        schoolInputs[0].focus()
      })
      searchBtn.disabled = true;
      addStudent.disabled = true;
    }
  //** bu kısım modal kısmında ki form. */
schoolFormSubmit.addEventListener("click", () => {
  // preventDefault iptal sebebim bu kısım doldurulup onaylandıktan sonra bir daha ihtiyaç duymamam ve sayfaya bir kaç komut eklemek yerine yenilenmesi daha kolay :)
  // e.preventDefault(); 

  //aşağıda bulunan okul objemize okul ismi ve türünü aktarıyoruz.
  school.schoolName = schoolInputs[0].value;
  school.schoolType = schoolInputs[1].value;
  
  //**  burada sınıfların başlangıç ve bitiş array'ini oluşturuyoruz
  //! özetle [...Array(5).keys()].splice(1) == [1,2,3,4]
  /*!        5 elemanlı bir array oluşturup bunun "keys()" index'leriyle başka bir 
  array yapıyoruz. index 0 dan başladığı için yapmak istediğimiz diziden bir fazlasını
   yapıp ilk elemanı splice ile siliyoruz.*/
  clsNumbers = [...Array(+schoolInputs[3].value + 1).keys()].splice(schoolInputs[2].value);
  //! letters ve clsNumbers globalde oluşturmamızın sebebi daha sonra school metodunda kullanacak olmamız
  // burada formda belirtilen harf kadar bir array dizisi oluşturduk
  const alphabet = "ABCDEFGHIJK";
  letters = alphabet.slice(0, schoolInputs[4].value).split("");
  //sınıf kademeleri select'ini doldurduk. 
  fillSelect();
/* burada localStorage'da "school" key ile, school.makeClasses metodunda oluşturduğumuz
objemizi json metnine dönüştürüp kaydettik
ayrıca okul ismi ve tipini de kaydettik*/
  localStorage.setItem("school", JSON.stringify(school.makeClasses()));
  localStorage.setItem("schoolName", school.schoolName);
  localStorage.setItem("schoolType", school.schoolType);

  // kayıt işleminden sonra başlıklarımızı yeniledik
  schoolNameHeader.innerHTML = `${localStorage.getItem(
    "schoolName"
  )}<br><span class="badge rounded-pill bg-info fs-4">${localStorage.getItem(
    "schoolType"
  )}</span>`;
  // son halini local storage dan çekerek data değişkenimizi yeniledik
  data = JSON.parse(localStorage.getItem("school"))
});
// sınıf seviyesi seçilince ilgili sınıflar select menüye ekleniyor
studentForm.addEventListener("change", (e) => {
  if (e.target.id == "class-num") {
    className.innerHTML = "";
    /** data ile classnumber value ile birleştirip
     *  key'leri yani sınıf adlarını foreach ile  çekerek class name 
     * selectine options olarak ekledik. kısaca "data[x].keys().foreach gibi */  
    Object.keys(data[e.target.value]).forEach(
      (item) => {
        className.innerHTML += `<option value="${item}">${item}</option>`;
      }
    );
  }
});
//* öğrenci formu click eventleri */
studentForm.addEventListener("click", (e) => {
  // öğrenci arama listeleme
  if (e.target == searchBtn) {
    // sayfa yenilememesi için
    e.preventDefault();
    //sınıf adı boşsa alert ver
    if (!className.value) {
      return showAlert("Select Class Name", "alert alert-warning");
    }
// boşluklar doluysa öğrenciyi çek ve 
    if (studentNo.value&&classNum.value) {
      let studentList = school.clsStudents.getStudents(
        classNum.value,
        className.value,
        studentNo.value
      );
      //gelen verileri tabloya yazdır
      if (studentList) {
        let tableRow = `<tr>
    <th scope="row">${className.value}</th>
    <td>${studentNo.value}</td>
    <td>${studentList.info[0]}</td>
    <td>${studentList.info[1]}</td>
  </tr>`;
        tableBody.innerHTML = "";
        tableBody.innerHTML += tableRow;
      } else {
        //gelen veri yoksa alert ver
        showAlert(
          "There is not a student with search arguments",
          "alert alert-warning"
        );
      }
      // öğrenci no yosa sınıf listesini getirir
    } else {
      let studentList = school.clsStudents.getStudents(
        classNum.value,
        className.value
      );
      //tabloyu boşalt
      tableBody.innerHTML = "";
      // getstudents ile gelen listeden restructure yöntemiyle gelen verileri tabloya foreach ile yazdırıyoruz
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
    <td>${grades}<i class="bi bi-person-x fs-5 float-end btn"></i></td>
  </tr>`;
        tableBody.innerHTML += tableRow;
      });
    }
  }
  if (e.target == addStudent) {
    e.preventDefault();
   let result = school.clsStudents.addStnt(
      classNum.value,
      className.value,
      studentNo.value,
      studentName.value,
      [...studentGrades].map((x) => x.value)
    );
    console.log(result);
    (result)?showAlert(`${studentNo.value} : ${studentName.value}'s record has been added.`,"success" ):showAlert("Error : Please control student information", "danger")
    // console.log([...studentGrades].map((x) => x.value));
  }
  if (e.target== resetBtn ) {
    className.innerHTML=""
  }
  if (e.target==deleteAll&&confirm("Are you sure you want to delete all entries!!!")) {
    
    school.clsStudents.deleteAll()
  }
  if (e.target.classList.contains("bi-person-x")) {
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


const school = {
  schoolName: "School Name",
  schoolType: "School Type",

  makeClasses: function () {
    let obj = {};
    let makeClasses = {};
    let d = clsNumbers[0];

    let list = this.findClassesWithLetters(d);
    for (const i of clsNumbers) {
      for (const j of list) {
        obj[j] = {};
      }
      d++;
      makeClasses[i] = obj;
      obj = {};

      list = this.findClassesWithLetters(d);
    }

    return makeClasses;
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
    addStnt: function (clsNum, clsName, no, studentName, ...grades) {
      if (clsNum&& clsName&& no&& studentName) {
        
        // nulish operator
        let data = JSON.parse(localStorage.getItem("school")); //?? school.makeClasses();
        // console.log(data);
  let res;
       Object.keys(data).forEach((dtClsNum) => {
          Object.keys(data[dtClsNum]).forEach((dtClsName) => {
            Object.keys(data[dtClsNum][dtClsName]).forEach((dtNo) => {
              if (dtNo == no) {
                if (
                  confirm(
                    `At ${dtClsName} class there is same ${dtNo} number. Do you want to update student name and grades?`
                  )
                ) {
                  data[dtClsNum][dtClsName][dtNo] = { info: [studentName, grades] };
                  localStorage.setItem("school", JSON.stringify(data));
                  res= "success";
                } else {
                  res= "cancel"
                }
              }
            });
          });
        });
        if(!res){
          data[clsNum][clsName][no] = { info: [studentName, grades] };
          localStorage.setItem("school", JSON.stringify(data));
          return "success"
        }
      } else {
       return null
      }
        
      // } catch (error) {
      //   if(error) 
      // }
      // let info = new Map();
      // s[2]["2-A"] = info.set(11, 222);
      // s[clsNum][clsName] = info.set(no, [ad, notlar]);
      // console.log(data);
      // return data;
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
// school.makeClasses()[1]["1-A"] = ["ali"];

// console.log(school.makeClasses());

// let sc = {
//   1: {
//     "1-A": {
//       101: ["ali", "veli"],
//     },
//   },
// };

// console.log(sc[1]["1-A"][101]);

