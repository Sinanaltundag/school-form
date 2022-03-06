const schoolInputs = document.querySelectorAll(".modal input, .modal select");
const schoolFormSubmit = document.querySelector(".btn-outline-primary");
const schoolNameHeader = document.querySelector("main h1");
const classNum = document.getElementById("class-num");
const className = document.getElementById("class-name");
const studentNo = document.getElementById("student-no");
const studentName = document.getElementById("fullname");
const examResults = document.querySelectorAll(".input-group input");
const studentForm = document.querySelector("main");
const tableBody = document.querySelector("tbody");
const studentGrades = document.querySelectorAll(".grades");
const alertBox = document.getElementById("alert-box");
const resetBtn = document.querySelector("#reset");
const schoolForm = document.getElementById("staticBackdrop");
const modalLauncher = document.getElementById("modal-launcher");

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
function showAlert(str = "Error", alertType = "warning", strongStr = "") {
  let alertDiv = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
 <strong>${strongStr}</strong> ${str}
 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
 </div>`;
  //* burada tablonun üst kısmında bulunan boş div içine alert oluşturuyoruz. faydası üst üste oluşan alertler aynı yerde tek çıkıyor. alert içinde kapatma butonu da var */
  alertBox.innerHTML = alertDiv;
}
// burada eğer localStorage içinde daha önce kayıtlarımız varsa çekiyoruz. yoksa boş bir obje oluşturuyoruz
let data = JSON.parse(localStorage.getItem("school")) || {};

function exportToJsonFile() {
  data = JSON.parse(localStorage.getItem("school"));
  let dataStr = JSON.stringify(data);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileDefaultName = "yedek.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}
//okul sınıf numaralarını oluştururken kullandığımız boş değişkenler
let clsNumbers = [];
let letters = [];

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
      kontrol ediyoruz. eğer yoksa  modal açma linki oluşturup click'ledik. daha stabil yol bulamadım. :) */
if (!localStorage.getItem("schoolName")) {
  window.onload = () => {
    const modalLaunch = document.createElement("a");
    modalLaunch.setAttribute("data-bs-toggle", "modal");
    modalLaunch.setAttribute("data-bs-target", "#staticBackdrop");
    document.body.appendChild(modalLaunch);
    modalLaunch.click();
  };
  //modal açıldığında ilk inputu aktif etme
  schoolForm.addEventListener("shown.bs.modal", function () {
    schoolInputs[0].focus();
  });
}
//** bu kısım modal kısmında ki form. */
schoolFormSubmit.addEventListener("click", (e) => {
  // preventDefault iptal sebebim bu kısım doldurulup onaylandıktan sonra bir daha ihtiyaç duymamam ve sayfaya bir kaç komut eklemek yerine yenilenmesi daha kolay :)
  // e.preventDefault();
  if (schoolInputs[3].value > schoolInputs[2].value) {
    //aşağıda bulunan okul objemize okul ismi ve türünü aktarıyoruz.
    school.schoolName = schoolInputs[0].value;
    school.schoolType = schoolInputs[1].value;

    //**  burada sınıfların başlangıç ve bitiş array'ini oluşturuyoruz
    //! özetle [...Array(5).keys()].splice(1) == [1,2,3,4]
    /*!        5 elemanlı bir array oluşturup bunun "keys()" index'leriyle başka bir 
  array yapıyoruz. index 0 dan başladığı için yapmak istediğimiz diziden bir fazlasını
   yapıp ilk elemanı splice ile siliyoruz.*/
    clsNumbers = [...Array(+schoolInputs[3].value + 1).keys()].splice(
      schoolInputs[2].value
    );
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
    data = JSON.parse(localStorage.getItem("school"));
  } else {
    // hatalı bilgi girilmesi durumunda sayfa yenilenmesin
    e.preventDefault();
    alert("Wrong entries!");
  }
});
// sınıf seviyesi seçilince ilgili sınıflar select menüye ekleniyor
studentForm.addEventListener("change", (e) => {
  if (e.target.id == "class-num") {
    className.innerHTML = "";
    /** data ile classnumber value ile birleştirip
     *  key'leri yani sınıf adlarını foreach ile  çekerek class name
     * selectine options olarak ekledik. kısaca "data[x].keys().foreach gibi */
    Object.keys(data[e.target.value]).forEach((item) => {
      className.innerHTML += `<option value="${item}">${item}</option>`;
    });
  }
});
//* öğrenci formu click eventleri */
studentForm.addEventListener("click", (e) => {
  // öğrenci arama listeleme
  if (e.target.id == "search") {
    // sayfa yenilememesi için
    e.preventDefault();
    //sınıf adı boşsa alert ver
    if (!className.value) {
      return showAlert("Select Class Name", "alert alert-warning");
    }
    // boşluklar doluysa öğrenciyi çek ve
    if (studentNo.value && classNum.value) {
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
      // getstudents ile gelen listeden restructure yöntemiyle yeni variable lar tanımladık. gelen verileri tabloya foreach ile yazdırıyoruz
      Object.keys(studentList).forEach((studentNo) => {
        let {
          [studentNo]: {
            info: [fullname, [grades]],
          },
        } = studentList;
        let tableRow = `<tr>
    <th scope="row">${className.value}</th>
    <td >${studentNo}</td>
    <td class="text-capitalize">${fullname}</td>
    <td>${grades}<i class="bi bi-person-x fs-5 py-0 float-end btn"></i></td>
  </tr>`;
        tableBody.innerHTML += tableRow;
      });
    }
  }
  //* öğrenci ekleme
  if (e.target.id == "register") {
    e.preventDefault();
    // addStudent metodumuza input value'ları gönderdik
    let result = school.clsStudents.addStnt(
      classNum.value,
      className.value,
      studentNo.value,
      studentName.value,
      //studentGrades queryselectorall ile gelen nodelist.
      //bunu array yaptık ve map ile valuelarını aldık
      [...studentGrades].map((x) => x.value)
    );
    //metodumuz kayıt başarılı ile bir metin döndürüyor. sonuca göre alert veriyoruz.
    result
      ? showAlert(
          `${studentNo.value} : ${studentName.value}'s record has been added.`,
          "success"
        )
      : showAlert("Error : Please control student information", "danger");
  }
  if (e.target == resetBtn) {
    className.innerHTML = "";
  }
  //localStorage silme metodunu çağırdık
  if (
    e.target.id == "delete-all" &&
    confirm("Are you sure you want to delete all entries!!!")
  ) {
    e.preventDefault();
    school.clsStudents.deleteAll();
    const modalLaunch = document.createElement("a");
    modalLaunch.setAttribute("data-bs-toggle", "modal");
    modalLaunch.setAttribute("data-bs-target", "#staticBackdrop");
    document.body.appendChild(modalLaunch);
    modalLaunch.click();
  }
  // tablodaki öğrenciyi silme işlemi
  if (e.target.classList.contains("bi-person-x")) {
    if (confirm("Are you sure you want to delete student entry!")) {
      /*!!! burada resutructuring işlemi ile tablo satırındaki tüm metinleri ayrı ayrı değişkenlere atıyoruz. */
      let [clsName, no, studentName] = [
        ...e.target.parentElement.parentElement.children,
      ].map((x) => x.innerHTML);
      //! bu değişkenleri deleteStudent metodumuza gönderdik
      school.clsStudents.deleteStudent(clsName[0], clsName, no);
      // tablo satırını sildik
      e.target.parentElement.parentElement.remove();
      //ve son olarak alert verdik
      showAlert(`${no} : ${studentName}'s record has been deleted.`, "danger");
    }
  }
  // localdeki veriyi json dosyası olarak indirmemizi sağlıyor.
  if (e.target.id == "backup") {
    e.preventDefault();
    data = JSON.parse(localStorage.getItem("school"));
    let dataStr = JSON.stringify(data);
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let exportFileDefaultName = "yedek.json";
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }
  // yedeklediğimiz json dosyasından data ve localstorage'a geri yüklüyor
  if (e.target.id == "restore") {
    const getFile = document.createElement("input");
    getFile.setAttribute("type","file")
    getFile.setAttribute("id","selectFiles")
    getFile.click()
    getFile.addEventListener("change",()=>{
      var files = getFile.files;
      if (files.length <= 0) {
      return false;
      }
      let fileReader = new FileReader();
      fileReader.onload = function(e) { 
      var result = JSON.parse(e.target.result);
       data = JSON.stringify(result);
        localStorage.setItem("school", data)
      }
      fileReader.readAsText(files.item(0));
    })

   /* !! html localde ise çalışır
     fetch("./yedek.json")
      .then((response) => {
        return response.json();
      })
      .then((jsondata) =>
        localStorage.setItem("school", JSON.stringify(jsondata))
      );

    console.log(data);  !! html localde ise çalışır*/
  }
});
//! tüm işler için kullandığımız objemiz
const school = {
  schoolName: "School Name",
  schoolType: "School Type",
  /*okul bilgileri formundan aldığımız sınıf sayısı ve şube sayısı 
verileriyle sınıf objemizi oluşturan metod. okul formunu submit ettiğimizde çağırmıştık*/
  makeClasses: function () {
    // https://www.linkedin.com/pulse/creating-nested-objects-javascript-dynamically-ahmed-ellithy/?trk=articles_directory
    let obj = {};
    let makeClasses = {};
    let d = clsNumbers[0];
    let classNames = this.findClassesWithLetters(d);
    for (const i of clsNumbers) {
      for (const j of classNames) {
        obj[j] = {};
      }
      d++;
      makeClasses[i] = obj;
      obj = {};

      classNames = this.findClassesWithLetters(d);

    }

    return makeClasses;
  },
  classGroups: () => {
    //yoruma aldığım kısımda iş görüyor ama benim başta oluşturduğum yapı bozuluyor
    // let clsWithLttrs = Object.keys(school.clsStudents.getStudents()[1]);
    // burada temp "1-A","1-B".. item ise 1,2,3 sonuç olarak sınıf sayısı ve harfleri birleştirerek şubelerisınıflar ve  map olarak döndürüyor
    const clsWithLttrs = new Map();
    clsNumbers.forEach((item) => {
      for (let i = 0; i < letters.length; i++) {
        let temp = `${item}-${letters[i]}`;
        clsWithLttrs.set(temp, item);
      }
    });

    return clsWithLttrs;
  },
  findClassesWithLetters: function (number) {
    /*classGroups metodundan dönen map'i key, value parçalarıyla array yapıp
metod parametresinden aldığımız sınıf numarası ile filtreliyoruz*/
    let filteredClasses = [...this.classGroups().entries()].filter(
      (item) => item[1] === number
    );

    // gereksiz boşlukları kaldırdık
    filteredClasses.forEach((e) => {
      e.splice(1, 1);
    });

    //içiçe(nested) arrayi düz array yaptık
    let flatClassList = filteredClasses.flat();
    return flatClassList;
  },
  classes: function () {
    /*classGroups dan aldığımız ["A-1":1]... şeklindeki veriyi [A-1:0] olarak değiştirdim. 
    amacım sınıf mevcudu ve devamsızlık gibi veriler için kullanmaktı. 
    sonra bakılacak.*/
    const classList = new Map(school.classGroups());
    [...classList.keys()].forEach((key) => {
      classList.set(key, 0);
    });
    // classList.forEach((_,i) => {classList.set(i,0)});

    return classList;
  },
  //! öğrenci işleri...
  clsStudents: {
    //öğrenci ekleme
    addStnt: function (clsNum, clsName, no, studentName, ...grades) {
      // not dışındaki veriler gelmişse
      if (clsNum && clsName && no && studentName) {
        // burada nullish kullanmıştım localde kayıt yoksa diye fakat gerek kalmadı
        let data = JSON.parse(localStorage.getItem("school")); //?? school.makeClasses();

        let res;
        // kaydedilecek öğrenci no kayıtlarda var mı?
        Object.keys(data).forEach((dtClsNum) => {
          Object.keys(data[dtClsNum]).forEach((dtClsName) => {
            Object.keys(data[dtClsNum][dtClsName]).forEach((dtNo) => {
              if (dtNo == no) {
                if (
                  confirm(
                    `At ${dtClsName} class there is same ${dtNo} number. Do you want to update student name and grades?`
                  )
                ) {
                  data[dtClsNum][dtClsName][dtNo] = {
                    info: [studentName, grades],
                  };
                  localStorage.setItem("school", JSON.stringify(data));
                  //nested yapıda return yerine kullanılabilir
                  res = "success";
                } else {
                  res = "cancel";
                }
              }
            });
          });
        });
        //yukarıda kullandığım return benzeri yapıyla kayıt işleminin tekrarlanmasını engelledim
        if (!res) {
          data[clsNum][clsName][no] = { info: [studentName, grades] };
          localStorage.setItem("school", JSON.stringify(data));
          return "success";
        }
      } else {
        // hiç bir işlem yapılamadıysa hata vermesi için
        return null;
      }
    },
    //  girilen veriye göre sıralı öğrenci listeleme
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
    //* öğrenci silme
    deleteStudent: (clsNum, clsName, no) => {
      let data = JSON.parse(localStorage.getItem("school"));
      delete data[clsNum][clsName][no];
      localStorage.setItem("school", JSON.stringify(data));

    },
    //* tüm öğrenci ve okul kayıtlarını silme
    deleteAll: () => {
      localStorage.removeItem("school");
      localStorage.removeItem("schoolName");
      localStorage.removeItem("schoolType");
    },
  },
};
